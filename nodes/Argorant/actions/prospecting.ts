import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { buildCompanyFilters } from '../shared/filters';
import { simplifyCompany, simplifyPerson } from '../shared/simplify';
import { argorantPaginate, argorantRequest, chunk, splitList } from '../shared/transport';
import type { BulkHandler, ItemHandler } from './helpers';
import { asQuery, collectAcrossItems, enc, pairedFrom, peopleFilters, requireFilters, SCOPE } from './helpers';

const simplifyOn = (ctx: IExecuteFunctions, i: number) => ctx.getNodeParameter('simplify', i, true) as boolean;

// ---------------------------------------------------------------- account

export const account: Record<string, ItemHandler> = {
	async get() {
		return (await argorantRequest.call(this, 'GET', '/api/v1/account')) as IDataObject;
	},
};

// ---------------------------------------------------------------- lead

async function revealByFilters(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const filters = await peopleFilters.call(this, i, 'filterSource');
	requireFilters.call(this, filters, i);
	let left = this.getNodeParameter('revealCount', i, 10) as number;
	const seen = new Set<string>();
	const people: IDataObject[] = [];
	let summary: IDataObject = {};
	while (left > 0) {
		const answer = (await argorantRequest.call(this, 'POST', '/api/v1/people/reveal', {
			body: { ...filters, limit: Math.min(25, left) },
			scope: SCOPE.unlock,
		})) as IDataObject;
		summary = answer;
		const batch = ((answer.people as IDataObject[]) ?? []).filter((p) => !seen.has(String(p.record_id)));
		if (!batch.length) break;
		for (const p of batch) seen.add(String(p.record_id));
		people.push(...batch);
		left -= batch.length;
	}
	if (!people.length) {
		return [
			{
				returned: 0,
				credits_charged: summary.credits_charged ?? 0,
				total_matches: summary.total_matches,
				note: summary.note ?? 'No new person with a passing email matched. Nothing was charged.',
			},
		];
	}
	const simplify = simplifyOn(this, i);
	return people.map((p) => (simplify ? simplifyPerson(p) : p));
}

export const lead: Record<string, ItemHandler> = {
	async count(i) {
		const filters = await peopleFilters.call(this, i, 'filterSource');
		requireFilters.call(this, filters, i);
		const answer = (await argorantRequest.call(this, 'GET', '/api/v1/people/count', {
			qs: asQuery(filters),
			scope: SCOPE.read,
		})) as IDataObject;
		return { ...answer, filters };
	},

	async search(i) {
		const filters = await peopleFilters.call(this, i, 'filterSource');
		requireFilters.call(this, filters, i);
		const limit = this.getNodeParameter('limit', i, 10) as number;
		const options = this.getNodeParameter('searchOptions', i, {}) as IDataObject;
		const qs = asQuery(filters);
		if (options.cursor) qs.cursor = options.cursor;
		const rows = await argorantPaginate.call(this, '/api/v1/people/search', 'people', qs, limit, 100, 'cursor', SCOPE.search);
		return simplifyOn(this, i) ? rows.map(simplifyPerson) : rows;
	},

	async reveal(i) {
		// Record IDs are handled in bulk (leadBulk.reveal); this path reveals by filters.
		return await revealByFilters.call(this, i);
	},

	async enrich(i) {
		const by = this.getNodeParameter('enrichBy', i) as string;
		const body: IDataObject =
			by === 'email'
				? { email: String(this.getNodeParameter('email', i)).trim() }
				: {
						name: String(this.getNodeParameter('name', i)).trim(),
						domain: String(this.getNodeParameter('domain', i)).trim(),
					};
		const answer = (await argorantRequest.call(this, 'POST', '/api/v1/enrich', {
			body,
			scope: SCOPE.unlock,
		})) as IDataObject;
		if (!simplifyOn(this, i)) return answer;
		const person = (answer.person as IDataObject | undefined) ?? undefined;
		return {
			found: answer.found ?? false,
			credits_charged: answer.charged ?? 0,
			...(person ? simplifyPerson(person) : {}),
			...(answer.verification !== undefined ? { verification: answer.verification } : {}),
		};
	},
};

export const leadBulk: Record<string, BulkHandler> = {
	async reveal(items) {
		const out: INodeExecutionData[] = [];
		const byFilters: number[] = [];
		const ids: Array<{ value: string; item: number }> = [];
		for (let i = 0; i < items.length; i++) {
			if ((this.getNodeParameter('revealBy', i) as string) === 'filters') byFilters.push(i);
		}
		const idItems = items.map((_, i) => i).filter((i) => !byFilters.includes(i));
		if (idItems.length) {
			const collected = collectAcrossItems.call(this, items, 'recordIds', (v) => splitList(v));
			ids.push(...collected.filter((c) => idItems.includes(c.item)));
			if (!ids.length) {
				throw new NodeOperationError(this.getNode(), 'No record IDs to reveal', {
					description: 'Map the record_id of people from Lead > Search or List > Get People.',
				});
			}
			const itemOf = new Map(ids.map((c) => [c.value, c.item]));
			const simplify = simplifyOn(this, 0);
			for (const batch of chunk(ids, 25)) {
				const answer = (await argorantRequest.call(this, 'POST', '/api/v1/people/reveal', {
					body: { record_ids: batch.map((b) => b.value) },
					scope: SCOPE.unlock,
				})) as IDataObject;
				const people = (answer.people as IDataObject[]) ?? [];
				for (const p of people) {
					const item = itemOf.get(String(p.record_id)) ?? batch[0].item;
					out.push({ json: simplify ? simplifyPerson(p) : p, pairedItem: { item } });
				}
				const notRevealed = (answer.not_revealed as unknown[]) ?? [];
				if (!people.length || notRevealed.length) {
					out.push({
						json: {
							returned: people.length,
							credits_charged: answer.credits_charged ?? 0,
							not_revealed: notRevealed,
							note: answer.note,
						},
						pairedItem: pairedFrom(batch.map((b) => b.item)),
					});
				}
			}
		}
		for (const i of byFilters) {
			for (const json of await revealByFilters.call(this, i)) out.push({ json, pairedItem: { item: i } });
		}
		return out;
	},

	async getPhones(items) {
		const ids = collectAcrossItems.call(this, items, 'recordIds', (v) => splitList(v));
		if (!ids.length) {
			throw new NodeOperationError(this.getNode(), 'No record IDs given', {
				description: 'Map the record_id of people you found or revealed.',
			});
		}
		const itemOf = new Map(ids.map((c) => [c.value, c.item]));
		const out: INodeExecutionData[] = [];
		for (const batch of chunk(ids, 100)) {
			const answer = (await argorantRequest.call(this, 'POST', '/api/v1/people/phones', {
				body: { record_ids: batch.map((b) => b.value) },
				scope: SCOPE.unlock,
			})) as IDataObject;
			for (const r of (answer.results as IDataObject[]) ?? []) {
				out.push({ json: r, pairedItem: { item: itemOf.get(String(r.record_id)) ?? batch[0].item } });
			}
			if (answer.stopped) {
				out.push({
					json: { stopped: answer.stopped, summary: answer.summary, credits_charged: answer.credits_charged },
					pairedItem: pairedFrom(batch.map((b) => b.item)),
				});
				break;
			}
		}
		return out;
	},
};

// ---------------------------------------------------------------- company

export const company: Record<string, ItemHandler> = {
	async count(i) {
		const filters = buildCompanyFilters(this.getNodeParameter('filters', i, {}) as IDataObject);
		requireFilters.call(this, filters, i);
		const answer = (await argorantRequest.call(this, 'GET', '/api/v1/companies/count', {
			qs: asQuery(filters),
			scope: SCOPE.read,
		})) as IDataObject;
		return { ...answer, filters };
	},

	async search(i) {
		const filters = buildCompanyFilters(this.getNodeParameter('filters', i, {}) as IDataObject);
		requireFilters.call(this, filters, i);
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const rows = await argorantPaginate.call(this, '/api/v1/companies/search', 'companies', asQuery(filters), max, 100, 'cursor', SCOPE.search);
		return simplifyOn(this, i) ? rows.map(simplifyCompany) : rows;
	},

	async get(i) {
		const domain = String(this.getNodeParameter('domain', i))
			.trim()
			.replace(/^https?:\/\//i, '')
			.replace(/^www\./i, '')
			.replace(/\/.*$/, '');
		const limit = this.getNodeParameter('previewLimit', i, 5) as number;
		const answer = (await argorantRequest.call(this, 'GET', `/api/v1/companies/${enc(domain)}/people`, {
			qs: { limit },
			scope: SCOPE.search,
		})) as IDataObject;
		if (!simplifyOn(this, i)) return answer;
		const companyRow = (answer.company as IDataObject | null) ?? null;
		return {
			found: Boolean(companyRow),
			...(companyRow ? simplifyCompany(companyRow) : { company_domain: domain }),
			people_count: answer.people_count ?? 0,
			with_work_email: answer.with_work_email ?? 0,
			people_preview: ((answer.people as IDataObject[]) ?? []).map(simplifyPerson),
		};
	},
};

// ---------------------------------------------------------------- email

export const email: Record<string, ItemHandler> = {
	async find(i) {
		return (await argorantRequest.call(this, 'POST', '/api/v1/email-finder/find', {
			body: {
				first_name: String(this.getNodeParameter('firstName', i)).trim(),
				last_name: String(this.getNodeParameter('lastName', i)).trim(),
				domain: String(this.getNodeParameter('domain', i)).trim(),
			},
			scope: SCOPE.unlock,
		})) as IDataObject;
	},

	async check(i) {
		const address = String(this.getNodeParameter('email', i)).trim();
		const answer = (await argorantRequest.call(this, 'POST', '/api/mcp/email/verify', {
			body: { email: address },
			scope: SCOPE.unlock,
		})) as IDataObject;
		const rest: IDataObject = { ...answer };
		delete rest.ok;
		delete rest.quota;
		return rest;
	},
};
