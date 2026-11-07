'use strict';
// A small stand-in for the n8n execute context: parameters per item, recorded HTTP calls, scripted answers.
const path = require('node:path');

const dist = (p) => require(path.join(__dirname, '..', 'dist', p));

function fakeNode() {
	return { id: 'test', name: 'Argorant', type: 'n8n-nodes-argorant.argorant', typeVersion: 1, position: [0, 0], parameters: {} };
}

/**
 * params: object of parameter values (same for every item) or a function (name, itemIndex) => value.
 * answer: function (options) => { statusCode, body, headers } for each HTTP call.
 */
function fakeContext({ params, items = [{ json: {} }], answer, continueOnFail = false }) {
	const calls = [];
	const get = typeof params === 'function' ? params : (name) => params[name];
	const ctx = {
		calls,
		getInputData: () => items,
		getNode: fakeNode,
		continueOnFail: () => continueOnFail,
		getNodeParameter(name, itemIndex, fallback, options) {
			let value = get(name, itemIndex);
			if (value === undefined) value = fallback;
			if (options && options.extractValue && value && typeof value === 'object' && 'value' in value) return value.value;
			return value;
		},
		helpers: {
			async httpRequestWithAuthentication(credential, options) {
				calls.push({ credential, ...options });
				return answer(options, calls.length);
			},
			async prepareBinaryData(buffer, fileName, mimeType) {
				return { data: buffer.toString('base64'), fileName, mimeType };
			},
			returnJsonArray: (rows) => rows.map((json) => ({ json })),
		},
	};
	return ctx;
}

const ok = (body, headers = {}) => ({ statusCode: 200, body, headers });

module.exports = { dist, fakeContext, ok };
