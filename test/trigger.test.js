'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { dist } = require('./helpers');

const { ArgorantTrigger } = dist('nodes/ArgorantTrigger/ArgorantTrigger.node.js');
const SECRET = 'whsec_unit_test';
const CAMPAIGN = '7f3a2c1e-9b4d-4e8a-a1c2-5d6e7f8a9b0c';

function delivery(event, data) {
	const raw = Buffer.from(JSON.stringify({ event, delivery_id: '9001', created_at: '2026-11-07T15:00:00+00:00', data }));
	return { raw, signature: `sha256=${crypto.createHmac('sha256', SECRET).update(raw).digest('hex')}` };
}

function webhookContext({ raw, signature, options = {}, state = { webhookSecret: SECRET }, inbox = [] }) {
	const calls = [];
	let status;
	return {
		calls,
		status: () => status,
		getWorkflowStaticData: () => state,
		getRequestObject: () => ({ rawBody: raw }),
		getBodyData: () => JSON.parse(raw.toString()),
		getHeaderData: () => ({ 'x-argorant-signature': signature }),
		getNodeParameter: (name, fallback) => (name === 'options' ? options : fallback),
		getResponseObject: () => ({ status: (s) => ((status = s), { json: () => undefined }) }),
		getNode: () => ({ name: 'Argorant Trigger', type: 'n8n-nodes-argorant.argorantTrigger', typeVersion: 1 }),
		helpers: {
			returnJsonArray: (rows) => rows.map((json) => ({ json })),
			async httpRequestWithAuthentication(_c, o) {
				calls.push(o);
				return { statusCode: 200, body: { events: inbox }, headers: {} };
			},
		},
	};
}

const reply = { classification: 'positive', lead_email: 'maya.chen@linfield.example', campaign_id: CAMPAIGN, subject: 'Re: Quick question', snippet: 'Happy to talk.' };

test('a signed reply starts the workflow with the conversation ID added', async () => {
	const d = delivery('reply.positive', reply);
	const ctx = webhookContext({ ...d, inbox: [{ id: 'native-conversation:lead:x:y', from_email: 'Maya.Chen@linfield.example', inbox_email: 'alex.rivera@yourcompany.example', lead_name: 'Maya Chen' }] });
	const out = await new ArgorantTrigger().webhook.call(ctx);
	const item = out.workflowData[0][0].json;
	assert.equal(item.event, 'reply.positive');
	assert.equal(item.lead_email, 'maya.chen@linfield.example');
	assert.equal(item.conversation_id, 'native-conversation:lead:x:y');
	assert.equal(item.inbox_email, 'alex.rivera@yourcompany.example');
	assert.equal(ctx.calls[0].qs.q, 'maya.chen@linfield.example');
	assert.equal(ctx.calls[0].qs.campaign_id, CAMPAIGN);
});

test('a wrong signature is refused with 401 and starts nothing', async () => {
	const d = delivery('reply.positive', reply);
	const ctx = webhookContext({ raw: d.raw, signature: 'sha256=00' });
	const out = await new ArgorantTrigger().webhook.call(ctx);
	assert.deepEqual(out, { noWebhookResponse: true });
	assert.equal(ctx.status(), 401);
});

test('events of other campaigns are skipped when campaigns are chosen', async () => {
	const d = delivery('reply.received', reply);
	const ctx = webhookContext({ ...d, options: { campaigns: ['00000000-0000-4000-8000-000000000000'] } });
	assert.deepEqual(await new ArgorantTrigger().webhook.call(ctx), {});
});

test('test events can be ignored, and are never looked up', async () => {
	const d = delivery('reply.positive', { test: true, event: 'reply.positive', message: 'Argorant webhook test delivery' });
	assert.deepEqual(await new ArgorantTrigger().webhook.call(webhookContext({ ...d, options: { ignoreTests: true } })), {});
	const ctx = webhookContext(d);
	const out = await new ArgorantTrigger().webhook.call(ctx);
	assert.equal(out.workflowData[0][0].json.test, true);
	assert.equal(ctx.calls.length, 0);
});

test('an export event passes through without a lookup', async () => {
	const d = delivery('export.ready', { job_id: 510, status: 'done', total_rows: 1, verified_rows: 1 });
	const ctx = webhookContext(d);
	const out = await new ArgorantTrigger().webhook.call(ctx);
	assert.equal(out.workflowData[0][0].json.job_id, 510);
	assert.equal(ctx.calls.length, 0);
});

test('the trigger offers every Argorant webhook event', () => {
	const events = new ArgorantTrigger().description.properties.find((p) => p.name === 'events').options.map((o) => o.value).sort();
	assert.deepEqual(events, ['campaign.paused', 'campaign.resumed', 'email.bounced', 'email.unsubscribed', 'export.ready', 'list.ready', 'reply.positive', 'reply.received', 'segment.new_matches', 'verification.completed']);
});
