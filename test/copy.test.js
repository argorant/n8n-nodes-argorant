'use strict';
// Copy rules for every text a user or an AI agent reads in the nodes: no long dashes, no other vendor names,
// example addresses on reserved domains only, and every operation that spends credits or sends email says so.
const test = require('node:test');
const assert = require('node:assert/strict');
const { dist } = require('./helpers');

const { Argorant } = dist('nodes/Argorant/Argorant.node.js');
const { ArgorantTrigger } = dist('nodes/ArgorantTrigger/ArgorantTrigger.node.js');
const { ArgorantApi } = dist('credentials/ArgorantApi.credentials.js');

function strings(value, out = []) {
	if (typeof value === 'string') out.push(value);
	else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
	else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
	return out;
}

const all = [
	...strings(new Argorant().description),
	...strings(new ArgorantTrigger().description),
	...strings(new ArgorantApi().properties),
];

const VENDORS = [
	'apollo', 'zoominfo', 'hunter', 'lusha', 'cognism', 'leadiq', 'seamless', 'rocketreach', 'snov', 'clearbit', 'clay',
	'instantly', 'smartlead', 'lemlist', 'salesloft', 'outreach.io', 'reply.io', 'woodpecker', 'mailshake',
	'neverbounce', 'zerobounce', 'millionverifier', 'mailtester', 'bouncer', 'kickbox', 'debounce',
	'hubspot', 'salesforce', 'pipedrive', 'openai', 'chatgpt', 'anthropic', 'claude', 'gemini',
	'linkedin', 'shopify',
];

test('no long dashes anywhere', () => {
	for (const s of all) assert.ok(!/[–—]/.test(s), `long dash in: ${s}`);
});

test('no other vendor or tool names', () => {
	for (const s of all) {
		const lower = s.toLowerCase();
		for (const v of VENDORS) assert.ok(!new RegExp(`\\b${v.replace('.', '\\.')}\\b`).test(lower), `"${v}" in: ${s}`);
	}
});

test('example addresses and domains are reserved names only', () => {
	for (const s of all) {
		if (!/^e\.g\./.test(s)) continue;
		const domains = s.replace(/[\w.+-]+@/g, '').match(/[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}/gi) ?? [];
		for (const d of domains) {
			const ok = /\.example$/i.test(d) || /(^|\.)example\.com$/i.test(d) || /argorant\.com$/i.test(d) || /^\d/.test(d);
			assert.ok(ok, `example domain ${d} in: ${s}`);
		}
	}
});

test('every operation that spends credits or sends email says so', () => {
	const ops = new Argorant().description.properties.filter((p) => p.name === 'operation');
	const byKey = {};
	for (const p of ops) for (const o of p.options) byKey[`${p.displayOptions.show.resource[0]}.${o.value}`] = o.description;
	const spends = ['lead.reveal', 'lead.enrich', 'lead.getPhones', 'email.find', 'email.check', 'list.export', 'export.create', 'campaign.addLeads'];
	for (const key of spends) assert.match(byKey[key], /credit/i, `${key} must state its credit cost`);
	const sends = ['campaign.launch', 'campaign.resume', 'campaign.sendTestEmail', 'reply.reply', 'reply.forward'];
	for (const key of sends) assert.match(byKey[key], /send/i, `${key} must say it sends email`);
	for (const [key, text] of Object.entries(byKey)) {
		if (spends.includes(key)) continue;
		assert.ok(/free|credit|send/i.test(text), `${key} should say what it costs: ${text}`);
	}
});

test('launch and resume default to not sending', () => {
	const confirm = new Argorant().description.properties.find((p) => p.name === 'confirmLaunch');
	assert.equal(confirm.default, false);
	assert.deepEqual(confirm.displayOptions.show.operation.sort(), ['launch', 'resume']);
});

test('the node is usable as an AI tool and every operation has an action', () => {
	const d = new Argorant().description;
	assert.equal(d.usableAsTool, true);
	for (const p of d.properties.filter((x) => x.name === 'operation')) {
		for (const o of p.options) assert.ok(o.action && o.description && o.description.length > 30, `${o.value}`);
	}
});
