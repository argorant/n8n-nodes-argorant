'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { dist, fakeContext, ok } = require('./helpers');

const { describeError, retryDelayMs, argorantRequest, argorantPaginate, chunk, splitList } = dist(
	'nodes/Argorant/shared/transport.js',
);

const envelope = (code, message, details = {}) => ({ error: { code, message, details }, request_id: 'req_test' });

test('402 says how many credits and where to top up', () => {
	const d = describeError(402, envelope('insufficient_credits', 'The balance does not cover the people asked for.', { needed: 25, balance: 3 }));
	assert.equal(d.message, 'Not enough Argorant credits');
	assert.match(d.description, /needs 25 credits/);
	assert.match(d.description, /has 3/);
	assert.match(d.description, /settings\?section=plans/);
	assert.match(d.description, /Nothing was charged/);
});

test('403 names the scope the key lacks', () => {
	const d = describeError(403, envelope('scope_missing', 'The key lacks argorant:unlock_contacts.'));
	assert.equal(d.code, 'scope_missing');
	assert.match(d.message, /argorant:unlock_contacts/);
	assert.match(d.description, /settings\?section=api-keys/);
});

test('403 without a scope in the message falls back to the scope of the operation', () => {
	const d = describeError(403, envelope('scope_missing', 'Missing scope.'), 'argorant:manage_lists');
	assert.match(d.message, /argorant:manage_lists/);
});

test('launch blocked lists every blocker', () => {
	const d = describeError(
		400,
		envelope('launch_blocked', 'Something is missing; details.blockers says what.', {
			blockers: [{ code: 'no_senders', message: 'No sending mailbox with room' }, 'No people with a valid email'],
		}),
	);
	assert.match(d.message, /^Launch blocked: No sending mailbox with room; No people with a valid email$/);
	assert.match(d.description, /Nothing was sent/);
});

test('daily limit and rate limit read differently', () => {
	assert.match(describeError(429, envelope('daily_limit_reached', 'Counts for the day are used up.')).description, /midnight UTC/);
	assert.match(describeError(429, envelope('rate_limited', 'Too many requests this minute.')).message, /too many requests/);
});

test('validation errors name the fields', () => {
	const d = describeError(422, envelope('validation_error', 'Some fields are missing or not valid.', { fields: [{ field: 'limit', problem: 'Input should be less than or equal to 100' }] }));
	assert.equal(d.description, 'limit: Input should be less than or equal to 100');
});

test('401 and a non-public webhook address explain the fix', () => {
	assert.match(describeError(401, envelope('unauthorized', 'x')).description, /API keys/);
	assert.match(describeError(400, envelope('invalid_webhook_url', 'x')).message, /public HTTPS/);
});

test('retry waits follow Retry-After, then the reset header, then backoff', () => {
	assert.equal(retryDelayMs({ 'retry-after': '3' }, 0), 3000);
	assert.equal(retryDelayMs({ 'x-ratelimit-reset': '2' }, 0), 2250);
	assert.equal(retryDelayMs({ 'x-ratelimit-reset': String(1_800_000_010) }, 0, 1_800_000_000_000), 10_250);
	assert.equal(retryDelayMs({}, 0), 1000);
	assert.equal(retryDelayMs({}, 3), 8000);
	assert.equal(retryDelayMs({ 'retry-after': '600' }, 0), 60_000);
});

test('a busy answer is retried with the same Idempotency-Key, then succeeds', async () => {
	const ctx = fakeContext({
		params: {},
		answer: (_o, n) =>
			n < 3
				? { statusCode: 429, body: envelope('rate_limited', 'Too many requests this minute.'), headers: { 'retry-after': '0.01' } }
				: ok({ ok: true }),
	});
	const out = await argorantRequest.call(ctx, 'POST', '/api/v1/lists', { body: { name: 'x' } });
	assert.deepEqual(out, { ok: true });
	assert.equal(ctx.calls.length, 3);
	const keys = new Set(ctx.calls.map((c) => c.headers['Idempotency-Key']));
	assert.equal(keys.size, 1);
	assert.match([...keys][0], /^n8n-/);
	assert.equal(ctx.calls[0].credential, 'argorantApi');
	assert.equal(ctx.calls[0].url, 'https://app.argorant.com/api/v1/lists');
});

test('a daily limit is not retried and throws a readable error', async () => {
	const ctx = fakeContext({ params: {}, answer: () => ({ statusCode: 429, body: envelope('daily_limit_reached', 'Used up.'), headers: {} }) });
	await assert.rejects(argorantRequest.call(ctx, 'GET', '/api/v1/people/count'), (e) => {
		assert.equal(e.constructor.name, 'NodeApiError');
		assert.match(e.description, /midnight UTC/);
		return true;
	});
	assert.equal(ctx.calls.length, 1);
});

test('reads never carry an Idempotency-Key', async () => {
	const ctx = fakeContext({ params: {}, answer: () => ok({ count: 1 }) });
	await argorantRequest.call(ctx, 'GET', '/api/v1/people/count', { qs: { title: 'CFO' } });
	assert.equal(ctx.calls[0].headers['Idempotency-Key'], undefined);
	assert.deepEqual(ctx.calls[0].qs, { title: 'CFO' });
});

test('pagination follows next_cursor and stops at the limit', async () => {
	const pages = [
		{ rows: [{ id: 1 }, { id: 2 }], has_more: true, next_cursor: 'c2' },
		{ rows: [{ id: 3 }, { id: 4 }], has_more: true, next_cursor: 'c3' },
		{ rows: [{ id: 5 }], has_more: false, next_cursor: null },
	];
	const ctx = fakeContext({ params: {}, answer: (_o, n) => ok(pages[n - 1]) });
	const all = await argorantPaginate.call(ctx, '/x', 'rows', {}, undefined, 2);
	assert.deepEqual(all.map((r) => r.id), [1, 2, 3, 4, 5]);
	assert.equal(ctx.calls[1].qs.cursor, 'c2');

	const ctx2 = fakeContext({ params: {}, answer: (_o, n) => ok(pages[n - 1]) });
	const three = await argorantPaginate.call(ctx2, '/x', 'rows', {}, 3, 2);
	assert.deepEqual(three.map((r) => r.id), [1, 2, 3]);
	assert.equal(ctx2.calls[1].qs.limit, 1);
});

test('campaign people page with next_after', async () => {
	const pages = [{ leads: [{ id: 'a' }], next_after: 'k1' }, { leads: [{ id: 'b' }], next_after: null }];
	const ctx = fakeContext({ params: {}, answer: (_o, n) => ok(pages[n - 1]) });
	const rows = await argorantPaginate.call(ctx, '/c', 'leads', {}, undefined, 500, 'after');
	assert.deepEqual(rows.map((r) => r.id), ['a', 'b']);
	assert.equal(ctx.calls[1].qs.after, 'k1');
});

test('chunk and splitList', () => {
	assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
	assert.deepEqual(splitList(' a, b ,,c\nd'), ['a', 'b', 'c', 'd']);
	assert.deepEqual(splitList(['x', ' y ']), ['x', 'y']);
	assert.deepEqual(splitList(undefined), []);
});
