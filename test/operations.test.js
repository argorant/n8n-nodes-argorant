'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { dist, fakeContext, ok } = require('./helpers');

const { route } = dist('nodes/Argorant/actions/router.js');
const { buildPeopleFilters, buildCompanyFilters, savedSearchFilters } = dist('nodes/Argorant/shared/filters.js');
const { verifySignature } = dist('nodes/ArgorantTrigger/signature.js');
const crypto = require('node:crypto');

const CAMPAIGN = '7f3a2c1e-9b4d-4e8a-a1c2-5d6e7f8a9b0c';
const locator = (value) => ({ __rl: true, mode: 'id', value });

test('filters: lists join with commas, exact industries with |, empty values drop out', () => {
	const f = buildPeopleFilters({
		title: ' CFO, VP Finance ',
		seniority: ['C-Level', 'VP'],
		industries: ['Banking', 'Insurance'],
		country: [],
		q: '',
		businessEmailOnly: true,
		foundedMin: 2015,
	});
	assert.deepEqual(f, {
		title: 'CFO, VP Finance',
		seniority: 'C-Level,VP',
		industries: 'Banking|Insurance',
		business_email_only: true,
		founded_min: 2015,
	});
	assert.deepEqual(buildCompanyFilters({ title: 'CFO', keywords: 'solar' }), { keywords: 'solar' });
});

test('a saved search gives back the request it was saved with', () => {
	assert.deepEqual(
		savedSearchFilters({ filters: { title: 'CFO', record_type: 'person', request: { title: 'CFO', country: 'Germany' } } }),
		{ title: 'CFO', country: 'Germany' },
	);
	assert.deepEqual(savedSearchFilters({ filters: { title: 'CFO', record_type: 'person' } }), { title: 'CFO' });
});

test('launch without Confirm Launch only checks and never sends', async () => {
	const ctx = fakeContext({
		params: { resource: 'campaign', operation: 'launch', campaignId: locator(CAMPAIGN), confirmLaunch: false, simplify: true },
		answer: (o) => {
			assert.equal(o.method, 'GET', 'a dry run must not POST');
			return ok({ campaign: { id: CAMPAIGN, name: 'Test', status: 'draft' }, launch_blockers: [{ code: 'no_senders', message: 'No sending mailbox' }] });
		},
	});
	const [[out]] = await route.call(ctx);
	assert.equal(out.json.launched, false);
	assert.equal(out.json.dry_run, true);
	assert.equal(out.json.ready, false);
	assert.deepEqual(out.json.launch_blockers, ['No sending mailbox']);
	assert.match(out.json.message, /Nothing was sent/);
	assert.ok(ctx.calls.every((c) => !c.url.endsWith('/launch')));
});

test('launch with Confirm Launch posts to /launch once', async () => {
	const ctx = fakeContext({
		params: { resource: 'campaign', operation: 'launch', campaignId: locator(CAMPAIGN), confirmLaunch: true, allowPlaceholders: false, simplify: true },
		answer: () => ok({ campaign: { id: CAMPAIGN, name: 'Test', status: 'active' } }),
	});
	const [[out]] = await route.call(ctx);
	assert.equal(ctx.calls.length, 1);
	assert.equal(ctx.calls[0].method, 'POST');
	assert.equal(ctx.calls[0].url, `https://app.argorant.com/api/v1/campaigns/${CAMPAIGN}/launch`);
	assert.deepEqual(ctx.calls[0].body, { allow_placeholders: false });
	assert.equal(out.json.launched, true);
	assert.equal(out.json.status, 'active');
});

test('resume needs the same confirmation', async () => {
	const ctx = fakeContext({
		params: { resource: 'campaign', operation: 'resume', campaignId: locator(CAMPAIGN), confirmLaunch: false },
		answer: () => ok({ campaign: { id: CAMPAIGN, status: 'paused' }, launch_blockers: [] }),
	});
	const [[out]] = await route.call(ctx);
	assert.equal(out.json.launched, false);
	assert.equal(out.json.ready, true);
	assert.match(out.json.message, /Ready to resume/);
});

test('add leads from input items: batched rows, valid emails only, extra columns as variables', async () => {
	const people = ['a', 'b', 'c', 'd', 'e'].map((n) => ({ json: { email: `${n}@linfield.example`, city: 'Austin' } }));
	const ctx = fakeContext({
		items: people,
		params: (name, i) =>
			({
				resource: 'campaign',
				operation: 'addLeads',
				campaignId: locator(CAMPAIGN),
				leadSource: 'items',
				leadEmail: people[i] ? people[i].json.email : undefined,
				leadFields: { first_name: 'Maya', company: '' },
				extraColumns: { column: [{ name: 'City', value: 'Austin' }] },
				batchSize: 2,
				addLeadsOptions: {},
			})[name],
		answer: (o) => ok({ added: o.body.rows.length }),
	});
	const [out] = await route.call(ctx);
	assert.equal(ctx.calls.length, 3);
	assert.deepEqual(ctx.calls.map((c) => c.body.rows.length), [2, 2, 1]);
	for (const c of ctx.calls) assert.deepEqual(c.body.grades, ['valid']);
	assert.deepEqual(ctx.calls[0].body.rows[0], { email: 'a@linfield.example', first_name: 'Maya', city: 'Austin' });
	assert.deepEqual(out.map((o) => o.pairedItem.map((p) => p.item)), [[0, 1], [2, 3], [4]]);
});

test('reveal by record IDs combines items and sends 25 at a time', async () => {
	const ids = Array.from({ length: 30 }, (_, n) => `p_${n}`);
	const items = [{ json: {} }, { json: {} }];
	const ctx = fakeContext({
		items,
		params: (name, i) =>
			({
				resource: 'lead',
				operation: 'reveal',
				revealBy: 'recordIds',
				recordIds: i === 0 ? ids.slice(0, 20).join(',') : ids.slice(20).join(','),
				simplify: true,
			})[name],
		answer: (o) => ok({ people: o.body.record_ids.map((record_id) => ({ record_id, email: `${record_id}@linfield.example`, email_status: 'valid' })), credits_charged: o.body.record_ids.length }),
	});
	const [out] = await route.call(ctx);
	assert.deepEqual(ctx.calls.map((c) => c.body.record_ids.length), [25, 5]);
	assert.equal(out.length, 30);
	assert.equal(out[0].pairedItem.item, 0);
	assert.equal(out[29].pairedItem.item, 1);
});

test('an empty filter set is refused before any call', async () => {
	const ctx = fakeContext({ params: { resource: 'lead', operation: 'count', filterSource: 'fields', filters: {} }, answer: () => ok({}) });
	await assert.rejects(route.call(ctx), /Add at least one filter/);
	assert.equal(ctx.calls.length, 0);
});

test('continue on fail returns the error per item', async () => {
	const ctx = fakeContext({
		continueOnFail: true,
		params: { resource: 'email', operation: 'find', firstName: 'Maya', lastName: 'Chen', domain: 'linfield.example' },
		answer: () => ({ statusCode: 402, body: { error: { code: 'insufficient_credits', message: 'No credits left.', details: { needed: 1, balance: 0 } } }, headers: {} }),
	});
	const [[out]] = await route.call(ctx);
	assert.equal(out.json.error, 'Not enough Argorant credits');
});

test('export download returns a CSV file', async () => {
	const csv = 'First Name,Email\nMaya,maya.chen@linfield.example\n';
	const ctx = fakeContext({
		params: { resource: 'export', operation: 'download', exportId: '84213', grades: 'valid', binaryPropertyName: 'data' },
		answer: () => ({ statusCode: 200, body: Buffer.from(csv), headers: {} }),
	});
	const [[out]] = await route.call(ctx);
	assert.equal(out.json.rows, 1);
	assert.equal(out.binary.data.fileName, 'argorant-export-84213.csv');
	assert.equal(ctx.calls[0].qs.grades, 'valid');
});

test('webhook signatures are checked against the raw body', () => {
	const secret = 'whsec_test';
	const body = Buffer.from('{"event":"reply.positive","data":{}}');
	const good = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;
	assert.equal(verifySignature(body, good, secret), true);
	assert.equal(verifySignature(body, good.replace(/.$/, '0'), secret), false);
	assert.equal(verifySignature(Buffer.from('{"event":"x"}'), good, secret), false);
	assert.equal(verifySignature(body, '', secret), false);
	assert.equal(verifySignature(body, good, undefined), false);
});
