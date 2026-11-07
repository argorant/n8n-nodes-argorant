import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';
import { randomUUID } from 'crypto';

export const BASE_URL = 'https://app.argorant.com';
export const PLANS_URL = 'https://app.argorant.com/settings?section=plans';
export const API_KEYS_URL = 'https://app.argorant.com/settings?section=api-keys';

export type ArgorantContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;

export interface ArgorantRequestOptions {
	qs?: IDataObject;
	body?: IDataObject;
	/** Return the raw body as a Buffer (CSV downloads). */
	binary?: boolean;
	/** The scope this call needs, named in a 403 message when the key lacks it. */
	scope?: string;
	/** Most retries on a busy answer (429 rate_limited, 502, 503, 504). */
	maxRetries?: number;
}

interface FullResponse {
	statusCode: number;
	headers: Record<string, string | string[] | undefined>;
	body: unknown;
}

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const RETRY_STATUS = new Set([502, 503, 504]);
const MAX_WAIT_MS = 60_000;

function header(headers: FullResponse['headers'], name: string): string | undefined {
	const value = headers[name] ?? headers[name.toLowerCase()];
	return Array.isArray(value) ? value[0] : value;
}

/** How long to wait before the next try: Retry-After, then X-RateLimit-Reset, then 1, 2, 4, 8 and 16 seconds. */
export function retryDelayMs(
	headers: FullResponse['headers'],
	attempt: number,
	nowMs: number = Date.now(),
): number {
	const retryAfter = Number(header(headers, 'retry-after'));
	if (Number.isFinite(retryAfter) && retryAfter > 0) return Math.min(retryAfter * 1000, MAX_WAIT_MS);
	const reset = Number(header(headers, 'x-ratelimit-reset'));
	if (Number.isFinite(reset) && reset > 0) {
		// Either seconds until the window resets or a Unix time in seconds.
		const ms = reset > 1_000_000_000 ? reset * 1000 - nowMs : reset * 1000;
		if (ms > 0) return Math.min(ms + 250, MAX_WAIT_MS);
	}
	return Math.min(1000 * 2 ** attempt, MAX_WAIT_MS);
}

function errorObject(body: unknown): IDataObject {
	if (body && typeof body === 'object' && !Buffer.isBuffer(body)) {
		const err = (body as IDataObject).error;
		if (err && typeof err === 'object') return err as IDataObject;
		const detail = (body as IDataObject).detail;
		if (detail && typeof detail === 'object') return detail as IDataObject;
		if (typeof detail === 'string') return { message: detail };
	}
	if (typeof body === 'string' && body.trim()) {
		try {
			return errorObject(JSON.parse(body));
		} catch {
			return { message: body.slice(0, 300) };
		}
	}
	return {};
}

function blockerText(blocker: unknown): string {
	if (typeof blocker === 'string') return blocker.replace(/[.\s]+$/, '');
	if (blocker && typeof blocker === 'object') {
		const b = blocker as IDataObject;
		return String(b.message ?? b.summary ?? b.reason ?? b.code ?? JSON.stringify(b)).replace(/[.\s]+$/, '');
	}
	return String(blocker).replace(/[.\s]+$/, '');
}

/** Plain-English message and fix for an Argorant error answer. Exported for the unit tests. */
export function describeError(
	statusCode: number,
	body: unknown,
	scope?: string,
): { code: string; message: string; description: string } {
	const err = errorObject(body);
	const code = String(err.code ?? err.error ?? '');
	const apiMessage = String(err.message ?? '').trim();
	const details = (err.details && typeof err.details === 'object' ? err.details : err) as IDataObject;

	if (statusCode === 401) {
		return {
			code: code || 'unauthorized',
			message: 'The Argorant API key is missing, wrong or revoked',
			description: `Create a key in Argorant under Settings, API keys (${API_KEYS_URL}) and paste it into the Argorant credential.`,
		};
	}
	if (statusCode === 402) {
		const needed = details.needed ?? details.credits_needed ?? details.required;
		const balance = details.balance ?? details.available ?? details.credits_available;
		const perCompany = details.credits_per_company;
		const parts: string[] = [];
		if (needed !== undefined) parts.push(`This needs ${needed} credits.`);
		if (balance !== undefined) parts.push(`The account has ${balance}.`);
		if (perCompany !== undefined) parts.push(`A full company profile costs ${perCompany} credit.`);
		const head =
			code === 'insufficient_credits' || code === 'company_credits_required'
				? 'Not enough Argorant credits'
				: apiMessage || 'This needs a paid plan or more credits';
		return {
			code: code || 'payment_required',
			message: head,
			description: `${[apiMessage, ...parts].filter((s) => s).join(' ')} Nothing was charged. Add credits or change the plan at ${PLANS_URL}.`.trim(),
		};
	}
	if (statusCode === 403) {
		const lacking = /argorant:[a-z_]+/.exec(apiMessage)?.[0] ?? scope;
		if (code === 'scope_missing' || (lacking && /lacks/i.test(apiMessage))) {
			return {
				code: 'scope_missing',
				message: `The API key lacks the scope ${lacking ?? 'this operation needs'}`,
				description: `Create a key with the scope ${lacking ?? 'this operation needs'} in Argorant under Settings, API keys (${API_KEYS_URL}), then update the Argorant credential.`,
			};
		}
		return {
			code: code || 'forbidden',
			message: apiMessage || 'Your workspace role may not do this',
			description: 'Ask the workspace owner for the permission, or use a key of a member who has it.',
		};
	}
	if (code === 'launch_blocked') {
		const blockers = (details.blockers ?? err.blockers ?? []) as unknown[];
		const list = Array.isArray(blockers) ? blockers.map(blockerText) : [];
		return {
			code,
			message: list.length
				? `Launch blocked: ${list.join('; ')}`
				: `Launch blocked: ${apiMessage || 'the campaign is not ready'}`,
			description:
				'Nothing was sent. A launch needs at least one email, a sending mailbox with room and people with a valid email. Fix the points above, then launch again.',
		};
	}
	if (statusCode === 429) {
		if (code === 'daily_limit_reached') {
			return {
				code,
				message: apiMessage || 'The daily limit for this action is used up',
				description: `Daily limits reset at midnight UTC. Plans have higher limits: ${PLANS_URL}.`,
			};
		}
		return {
			code: code || 'rate_limited',
			message: 'Argorant is receiving too many requests from this key',
			description:
				'The node already waited and tried again. Send fewer items at once or add a Wait node between batches.',
		};
	}
	if (statusCode === 404) {
		return {
			code: code || 'not_found',
			message: apiMessage || 'Not found in your Argorant workspace',
			description: 'Nothing was changed. Only items of your own workspace can be found.',
		};
	}
	if (code === 'invalid_webhook_url') {
		return {
			code,
			message: 'Argorant can only call a public HTTPS address',
			description:
				'Set the public https:// address of your n8n (the WEBHOOK_URL setting) so Argorant can reach the trigger, then activate the workflow again.',
		};
	}
	const fields = Array.isArray(details.fields) ? (details.fields as IDataObject[]) : [];
	if (fields.length) {
		return {
			code: code || 'validation_error',
			message: apiMessage || 'Some fields are missing or not valid',
			description: fields.map((f) => `${f.field}: ${f.problem ?? f.message ?? ''}`).join('; '),
		};
	}
	return {
		code: code || `http_${statusCode}`,
		message: apiMessage || `Argorant answered with HTTP ${statusCode}`,
		description:
			details && Object.keys(details).length && details !== err ? JSON.stringify(details).slice(0, 600) : '',
	};
}

/** One call to the Argorant API with the node's credential, safe retries and readable errors. */
export async function argorantRequest(
	this: ArgorantContext,
	method: IHttpRequestMethods,
	path: string,
	options: ArgorantRequestOptions = {},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	const headers: IDataObject = { Accept: options.binary ? 'text/csv, */*' : 'application/json' };
	// One Idempotency-Key for every try of this write, so a retry never does the work twice.
	if (WRITE_METHODS.has(method)) headers['Idempotency-Key'] = `n8n-${randomUUID()}`;
	const request: IHttpRequestOptions = {
		method,
		url: `${BASE_URL}${path}`,
		headers,
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
		arrayFormat: 'repeat',
		timeout: 120_000,
	};
	if (options.qs && Object.keys(options.qs).length) request.qs = options.qs;
	if (options.body !== undefined) request.body = options.body;
	if (options.binary) {
		request.encoding = 'arraybuffer';
		request.json = false;
	} else {
		request.json = true;
	}

	const maxRetries = options.maxRetries ?? 5;
	for (let attempt = 0; ; attempt++) {
		const response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'argorantApi',
			request,
		)) as FullResponse;
		const status = response.statusCode;
		if (status >= 200 && status < 300) {
			if (options.binary) return response;
			return response.body ?? {};
		}
		const code = String(errorObject(response.body).code ?? '');
		const busy = (status === 429 && code !== 'daily_limit_reached') || RETRY_STATUS.has(status);
		if (busy && attempt < maxRetries) {
			await sleep(retryDelayMs(response.headers ?? {}, attempt));
			continue;
		}
		const described = describeError(status, response.body, options.scope);
		const errorBody =
			response.body && typeof response.body === 'object' && !Buffer.isBuffer(response.body)
				? (response.body as JsonObject)
				: ({ message: described.message } as JsonObject);
		throw new NodeApiError(this.getNode(), errorBody, {
			message: described.message,
			description: described.description,
			httpCode: String(status),
		});
	}
}

export type CursorMode = 'cursor' | 'after';

/**
 * Reads a paged list. With max undefined it reads every page (Return All); otherwise it stops at max rows.
 * Pages follow next_cursor while has_more is true, or next_after for campaign people.
 */
export async function argorantPaginate(
	this: ArgorantContext,
	path: string,
	itemsKey: string,
	qs: IDataObject,
	max: number | undefined,
	pageSize: number,
	mode: CursorMode = 'cursor',
	scope?: string,
	fixedPageSize = false,
): Promise<IDataObject[]> {
	const out: IDataObject[] = [];
	let cursor: string | undefined;
	for (let page = 0; page < 10_000; page++) {
		const left = max === undefined ? pageSize : max - out.length;
		const want = fixedPageSize ? pageSize : Math.min(pageSize, left);
		if (left <= 0) break;
		const pageQs: IDataObject = { ...qs, limit: want };
		if (cursor) pageQs[mode] = cursor;
		const answer = (await argorantRequest.call(this, 'GET', path, { qs: pageQs, scope })) as IDataObject;
		const rows = (answer[itemsKey] as IDataObject[] | undefined) ?? [];
		out.push(...rows);
		const next =
			mode === 'after'
				? (answer.next_after as string | null | undefined)
				: answer.has_more
					? (answer.next_cursor as string | null | undefined)
					: undefined;
		if (!rows.length || !next || next === cursor) break;
		cursor = next;
	}
	return max === undefined ? out : out.slice(0, max);
}

/** Splits a list into chunks of at most size. */
export function chunk<T>(values: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
	return out;
}

/** "a, b ,c" or ["a","b"] -> ["a","b","c"]; drops empty values. */
export function splitList(value: unknown, separator: RegExp = /[,\n]/): string[] {
	if (value === undefined || value === null) return [];
	const parts = Array.isArray(value) ? value.map((v) => String(v)) : String(value).split(separator);
	return parts.map((s) => s.trim()).filter((s) => s);
}
