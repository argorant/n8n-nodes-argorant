import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError, sleep } from 'n8n-workflow';
import { buildPeopleFilters, savedSearchFilters } from '../shared/filters';
import { locatorValue } from '../shared/locators';
import { argorantRequest } from '../shared/transport';

export type ItemHandler = (this: IExecuteFunctions, i: number) => Promise<IDataObject | IDataObject[] | INodeExecutionData[]>;
export type BulkHandler = (this: IExecuteFunctions, items: INodeExecutionData[]) => Promise<INodeExecutionData[]>;

export const SCOPE = {
	read: 'argorant:read_counts',
	search: 'argorant:search_segments',
	lists: 'argorant:manage_lists',
	exports: 'argorant:create_exports',
	unlock: 'argorant:unlock_contacts',
} as const;

export const enc = (value: string) => encodeURIComponent(value);

export function isExecutionData(value: unknown): value is INodeExecutionData[] {
	return Array.isArray(value) && value.every((v) => v && typeof v === 'object' && 'json' in (v as object));
}

/** Query strings take plain values: lists become comma-joined text. */
export function asQuery(filters: IDataObject): IDataObject {
	const out: IDataObject = {};
	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined || value === null || value === '') continue;
		out[key] = Array.isArray(value) ? value.join(',') : (value as IDataObject[keyof IDataObject]);
	}
	return out;
}

/** People filters from the node fields, or from a saved search in Argorant. */
export async function peopleFilters(
	this: IExecuteFunctions,
	i: number,
	sourceParam: string,
	savedSearchValue = 'savedSearch',
): Promise<IDataObject> {
	const source = this.getNodeParameter(sourceParam, i, 'fields') as string;
	if (source === savedSearchValue) {
		const listId = locatorValue.call(this, 'savedSearch', i);
		const list = (await argorantRequest.call(this, 'GET', `/api/v1/lists/${enc(listId)}`, {
			scope: SCOPE.lists,
		})) as IDataObject;
		const filters = savedSearchFilters(list);
		if (!Object.keys(filters).length) {
			throw new NodeOperationError(this.getNode(), `The saved search ${listId} has no filters`, {
				itemIndex: i,
				description: 'Pick a saved search (a list saved from filters), not a list of picked people.',
			});
		}
		return filters;
	}
	const filters = buildPeopleFilters(this.getNodeParameter('filters', i, {}) as IDataObject);
	return filters;
}

export function requireFilters(this: IExecuteFunctions, filters: IDataObject, i: number): void {
	if (!Object.keys(filters).length) {
		throw new NodeOperationError(this.getNode(), 'Add at least one filter', {
			itemIndex: i,
			description: 'Without a filter the search would match everyone. Add a job title, an industry or a country.',
		});
	}
}

/** Polls an export until it is done, failed or the wait is over. */
export async function waitForExport(this: IExecuteFunctions, jobId: unknown, minutes: number): Promise<IDataObject | undefined> {
	if (!minutes || jobId === undefined || jobId === null) return undefined;
	const deadline = Date.now() + minutes * 60_000;
	let last: IDataObject | undefined;
	while (Date.now() < deadline) {
		last = (await argorantRequest.call(this, 'GET', `/api/v1/exports/${enc(String(jobId))}`, {
			scope: SCOPE.exports,
		})) as IDataObject;
		const status = String(last.status ?? '');
		if (status === 'done' || status === 'failed' || status === 'cancelled') return last;
		await sleep(5000);
	}
	return last;
}

/** Collects one comma-separated parameter across all input items, with the item each value came from. */
export function collectAcrossItems(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	param: string,
	split: (value: unknown) => string[],
): Array<{ value: string; item: number }> {
	const seen = new Set<string>();
	const out: Array<{ value: string; item: number }> = [];
	for (let i = 0; i < items.length; i++) {
		for (const value of split(this.getNodeParameter(param, i, ''))) {
			if (seen.has(value)) continue;
			seen.add(value);
			out.push({ value, item: i });
		}
	}
	return out;
}

export const pairedFrom = (indices: number[]) => [...new Set(indices)].map((item) => ({ item }));
