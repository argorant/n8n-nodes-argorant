import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { buildPeopleFilters } from '../shared/filters';
import { locatorValue } from '../shared/locators';
import { simplifyExport, simplifyList, simplifyPerson } from '../shared/simplify';
import { argorantPaginate, argorantRequest, chunk, splitList } from '../shared/transport';
import type { BulkHandler, ItemHandler } from './helpers';
import { collectAcrossItems, enc, pairedFrom, peopleFilters, requireFilters, SCOPE, waitForExport } from './helpers';

const simplifyOn = (ctx: IExecuteFunctions, i: number) => ctx.getNodeParameter('simplify', i, true) as boolean;
const listPath = (ctx: IExecuteFunctions, i: number) => `/api/v1/lists/${enc(locatorValue.call(ctx, 'listId', i))}`;

/** Record IDs across all items, sent to one list in batches. */
async function recordIdBatches(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	indices: number[],
	path: (i: number) => string,
	extraBody: (i: number) => IDataObject,
): Promise<INodeExecutionData[]> {
	const out: INodeExecutionData[] = [];
	// Group items by target list so every list gets its own batches.
	const byTarget = new Map<string, number[]>();
	for (const i of indices) {
		const target = path(i);
		byTarget.set(target, [...(byTarget.get(target) ?? []), i]);
	}
	for (const [target, members] of byTarget) {
		const ids = collectAcrossItems
			.call(this, items, 'recordIds', (v) => splitList(v))
			.filter((c) => members.includes(c.item));
		if (!ids.length) {
			throw new NodeOperationError(this.getNode(), 'No record IDs given', {
				description: 'Map the record_id of people from Lead > Search or List > Get People.',
			});
		}
		const size = this.getNodeParameter('batchSize', members[0], 1000) as number;
		for (const batch of chunk(ids, size)) {
			const answer = (await argorantRequest.call(this, 'POST', target, {
				body: { record_ids: batch.map((b) => b.value), ...extraBody(members[0]) },
				scope: SCOPE.lists,
			})) as IDataObject;
			out.push({ json: answer, pairedItem: pairedFrom(batch.map((b) => b.item)) });
		}
	}
	return out;
}

export const list: Record<string, ItemHandler> = {
	async create(i) {
		const name = String(this.getNodeParameter('name', i)).trim();
		const filters = buildPeopleFilters(this.getNodeParameter('filters', i, {}) as IDataObject);
		requireFilters.call(this, filters, i);
		const answer = (await argorantRequest.call(this, 'POST', '/api/v1/lists', {
			body: { name, filters },
			scope: SCOPE.lists,
		})) as IDataObject;
		return simplifyOn(this, i) ? { ...simplifyList(answer), materialize: answer.materialize } : answer;
	},

	async get(i) {
		const path = listPath(this, i);
		const answer = (await argorantRequest.call(this, 'GET', path, { scope: SCOPE.lists })) as IDataObject;
		const out: IDataObject = simplifyOn(this, i) ? simplifyList(answer) : answer;
		if (this.getNodeParameter('includeFill', i, true)) {
			const fill = (await argorantRequest.call(this, 'GET', `${path}/fill`, { scope: SCOPE.lists })) as IDataObject;
			out.filling = fill.filling;
			out.fill = fill.fill;
			out.summary = fill.summary;
		}
		return out;
	},

	async getMany(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const kind = this.getNodeParameter('kind', i, 'all') as string;
		const rows = await argorantPaginate.call(this, '/api/v1/lists', 'lists', { kind }, max, 100, 'cursor', SCOPE.lists);
		return simplifyOn(this, i) ? rows.map(simplifyList) : rows;
	},

	async getPeople(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		// Pages of this route must keep one size (offset is a multiple of limit).
		const size = max === undefined ? 100 : Math.min(100, max);
		const rows = await argorantPaginate.call(this, `${listPath(this, i)}/people`, 'people', {}, max, size, 'cursor', SCOPE.lists, true);
		return simplifyOn(this, i) ? rows.map(simplifyPerson) : rows;
	},

	async addPeople(i) {
		// Record IDs go through listBulk; this path adds by filters or saved search.
		const filters = await peopleFilters.call(this, i, 'peopleSource');
		requireFilters.call(this, filters, i);
		return (await argorantRequest.call(this, 'POST', `${listPath(this, i)}/items`, {
			body: { filters },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async removePeople(i) {
		const filters = buildPeopleFilters(this.getNodeParameter('filters', i, {}) as IDataObject);
		requireFilters.call(this, filters, i);
		return (await argorantRequest.call(this, 'POST', `${listPath(this, i)}/items/remove`, {
			body: { filters, preview: this.getNodeParameter('preview', i, false) },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async rename(i) {
		const answer = (await argorantRequest.call(this, 'PATCH', listPath(this, i), {
			body: { name: String(this.getNodeParameter('name', i)).trim() },
			scope: SCOPE.lists,
		})) as IDataObject;
		return simplifyList(answer);
	},

	async delete(i) {
		return (await argorantRequest.call(this, 'DELETE', listPath(this, i), { scope: SCOPE.lists })) as IDataObject;
	},

	async export(i) {
		const options = this.getNodeParameter('exportOptions', i, {}) as IDataObject;
		const answer = (await argorantRequest.call(this, 'POST', `${listPath(this, i)}/export`, {
			body: {
				limit: this.getNodeParameter('exportLimit', i, 1000),
				exclude_previously_exported: options.excludePreviouslyExported ?? true,
				email_when_done: options.emailWhenDone ?? false,
			},
			scope: SCOPE.exports,
		})) as IDataObject;
		const done = await waitForExport.call(this, answer.job_id, Number(options.waitMinutes ?? 0));
		const result = done ?? answer;
		return simplifyOn(this, i) ? { ...simplifyExport(result), status_url: answer.status_url } : result;
	},
};

export const listBulk: Record<string, BulkHandler> = {
	async create(items) {
		const indices = items.map((_, i) => i).filter((i) => this.getNodeParameter('peopleSource', i) === 'recordIds');
		const out: INodeExecutionData[] = [];
		if (indices.length) {
			const ids = collectAcrossItems
				.call(this, items, 'recordIds', (v) => splitList(v))
				.filter((c) => indices.includes(c.item));
			if (!ids.length) throw new NodeOperationError(this.getNode(), 'No record IDs given');
			const name = String(this.getNodeParameter('name', indices[0])).trim();
			const [first, ...rest] = chunk(ids, 10000);
			const created = (await argorantRequest.call(this, 'POST', '/api/v1/lists', {
				body: { name, record_ids: first.map((b) => b.value) },
				scope: SCOPE.lists,
			})) as IDataObject;
			for (const batch of rest) {
				await argorantRequest.call(this, 'POST', `/api/v1/lists/${enc(String(created.list_id))}/items`, {
					body: { record_ids: batch.map((b) => b.value) },
					scope: SCOPE.lists,
				});
			}
			const json = this.getNodeParameter('simplify', indices[0], true) ? simplifyList(created) : created;
			out.push({ json: { ...json, people_sent: ids.length }, pairedItem: pairedFrom(indices) });
		}
		for (let i = 0; i < items.length; i++) {
			if (indices.includes(i)) continue;
			out.push({ json: (await list.create.call(this, i)) as IDataObject, pairedItem: { item: i } });
		}
		return out;
	},

	async addPeople(items) {
		return await addOrRemove.call(this, items, 'items', {});
	},

	async removePeople(items) {
		return await addOrRemove.call(this, items, 'items/remove', null);
	},
};

async function addOrRemove(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	suffix: string,
	extra: IDataObject | null,
): Promise<INodeExecutionData[]> {
	const byIds = items.map((_, i) => i).filter((i) => this.getNodeParameter('peopleSource', i) === 'recordIds');
	const out = byIds.length
		? await recordIdBatches.call(
				this,
				items,
				byIds,
				(i) => `${listPath(this, i)}/${suffix}`,
				(i) => (extra === null ? { preview: this.getNodeParameter('preview', i, false) } : extra),
			)
		: [];
	const handler = suffix === 'items' ? list.addPeople : list.removePeople;
	for (let i = 0; i < items.length; i++) {
		if (byIds.includes(i)) continue;
		out.push({ json: (await handler.call(this, i)) as IDataObject, pairedItem: { item: i } });
	}
	return out;
}

// ---------------------------------------------------------------- export

export const exportJob: Record<string, ItemHandler> = {
	async create(i) {
		const filters = await peopleFilters.call(this, i, 'filterSource');
		requireFilters.call(this, filters, i);
		const options = this.getNodeParameter('exportOptions', i, {}) as IDataObject;
		const answer = (await argorantRequest.call(this, 'POST', '/api/v1/exports', {
			body: {
				filters,
				limit: this.getNodeParameter('exportLimit', i, 1000),
				include_phones: options.includePhones ?? false,
				exclude_previously_exported: options.excludePreviouslyExported ?? true,
				email_when_done: options.emailWhenDone ?? false,
			},
			scope: SCOPE.exports,
		})) as IDataObject;
		const done = await waitForExport.call(this, answer.job_id, Number(options.waitMinutes ?? 0));
		return done ? { ...done, status_url: answer.status_url, download_url: answer.download_url } : answer;
	},

	async get(i) {
		const id = String(this.getNodeParameter('exportId', i)).trim();
		const answer = (await argorantRequest.call(this, 'GET', `/api/v1/exports/${enc(id)}`, {
			scope: SCOPE.exports,
		})) as IDataObject;
		return simplifyOn(this, i) ? simplifyExport(answer) : answer;
	},

	async getMany(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const rows = await argorantPaginate.call(this, '/api/v1/exports', 'exports', {}, max, 100, 'cursor', SCOPE.exports);
		return simplifyOn(this, i) ? rows.map(simplifyExport) : rows;
	},

	async download(i) {
		const id = String(this.getNodeParameter('exportId', i)).trim();
		const grades = this.getNodeParameter('grades', i, 'valid') as string;
		const field = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		const response = (await argorantRequest.call(this, 'GET', `/api/v1/exports/${enc(id)}/download`, {
			qs: { grades },
			binary: true,
			scope: SCOPE.exports,
		})) as { body: ArrayBuffer | Buffer };
		const buffer = Buffer.isBuffer(response.body) ? response.body : Buffer.from(response.body);
		const binary = await this.helpers.prepareBinaryData(buffer, `argorant-export-${id}.csv`, 'text/csv');
		const rows = Math.max(0, buffer.toString('utf8').split('\n').filter((l) => l.trim()).length - 1);
		return [{ json: { export_id: id, rows, grades }, binary: { [field]: binary } }];
	},
};
