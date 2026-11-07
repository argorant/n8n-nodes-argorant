import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';
import { REGIONS } from '../shared/filters';
import { argorantRequest } from '../shared/transport';

type Page = IDataObject & { next_cursor?: string | null; has_more?: boolean };

const nextToken = (page: Page) => (page.has_more ? (page.next_cursor ?? undefined) : undefined);
const matches = (needle: string, ...values: unknown[]) =>
	!needle || values.some((v) => String(v ?? '').toLowerCase().includes(needle));

/** A list made from a search keeps its filters; a list of picked people only has record_type. */
const hasSearch = (list: IDataObject) =>
	Object.keys((list.filters as IDataObject | undefined) ?? {}).some((k) => !['record_type', 'request'].includes(k));

async function searchListsOfKind(
	ctx: ILoadOptionsFunctions,
	searchesOnly: boolean,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const qs: IDataObject = { limit: 100, kind: 'all' };
	if (paginationToken) qs.cursor = paginationToken;
	const page = (await argorantRequest.call(ctx, 'GET', '/api/v1/lists', { qs })) as Page;
	const needle = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = ((page.lists as IDataObject[]) ?? [])
		.filter((list) => !searchesOnly || hasSearch(list))
		.filter((list) => matches(needle, list.name, list.list_id))
		.map((list) => ({
			name:
				typeof list.item_count === 'number'
					? `${list.name} (${(list.item_count as number).toLocaleString('en-US')} people)`
					: String(list.name),
			value: String(list.list_id),
			url: `https://app.argorant.com/lists/${list.list_id}`,
		}));
	return { results, paginationToken: nextToken(page) };
}

export async function searchLists(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListsOfKind(this, false, filter, paginationToken);
}

export async function searchSavedSearches(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListsOfKind(this, true, filter, paginationToken);
}

export async function searchCampaigns(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const qs: IDataObject = { limit: 100 };
	if (paginationToken) qs.cursor = paginationToken;
	const page = (await argorantRequest.call(this, 'GET', '/api/v1/campaigns', { qs })) as Page;
	const needle = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = ((page.campaigns as IDataObject[]) ?? [])
		.filter((c) => matches(needle, c.name, c.id))
		.map((c) => ({
			name: c.status ? `${c.name} (${c.status})` : String(c.name),
			value: String(c.id),
			url: String(c.url ?? `https://app.argorant.com/campaigns/${c.id}`),
		}));
	return { results, paginationToken: nextToken(page) };
}

export async function searchMailboxes(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const qs: IDataObject = { limit: 100, summary: false };
	if (filter) qs.q = filter;
	if (paginationToken) qs.cursor = paginationToken;
	const page = (await argorantRequest.call(this, 'GET', '/api/v1/inboxes', { qs })) as Page;
	const results: INodeListSearchItems[] = ((page.inboxes as IDataObject[]) ?? []).map((m) => ({
		name: m.status_label ? `${m.email} (${m.status_label})` : String(m.email),
		value: String(m.email),
	}));
	return { results, paginationToken: nextToken(page) };
}

async function lookup(ctx: ILoadOptionsFunctions, kind: string): Promise<string[]> {
	const page = (await argorantRequest.call(ctx, 'GET', `/api/v1/lookups/${kind}`, {
		qs: { limit: 100 },
	})) as IDataObject;
	return ((page.suggestions as IDataObject[]) ?? []).map((s) => String(s.value)).filter((v) => v);
}

const byName = (a: INodePropertyOptions, b: INodePropertyOptions) => a.name.localeCompare(b.name);

export async function getIndustries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return (await lookup(this, 'industries')).map((value) => ({ name: value, value })).sort(byName);
}

export async function getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const countries = (await lookup(this, 'countries')).map((value) => ({ name: value, value })).sort(byName);
	const regions = REGIONS.map((value) => ({ name: `${value} (Region)`, value }));
	return [...regions, ...countries];
}

export async function getReplyStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const page = (await argorantRequest.call(this, 'GET', '/api/v1/reply-statuses', {
		qs: { limit: 500 },
	})) as IDataObject;
	return ((page.statuses as IDataObject[]) ?? []).map((s) => ({
		name: String(s.label ?? s.key),
		value: String(s.key),
		description: s.description ? String(s.description) : undefined,
	}));
}

export async function getCampaignTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const page = (await argorantRequest.call(this, 'GET', '/api/v1/campaign-tags')) as IDataObject;
	return ((page.tags as IDataObject[]) ?? []).map((t) => {
		const name = String(t.tag ?? t.name ?? t);
		return { name, value: name };
	});
}

export async function getMailboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const page = (await argorantRequest.call(this, 'GET', '/api/v1/inboxes', {
		qs: { limit: 500, summary: false },
	})) as IDataObject;
	return ((page.inboxes as IDataObject[]) ?? []).map((m) => ({
		name: m.status_label ? `${m.email} (${m.status_label})` : String(m.email),
		value: String(m.email),
	}));
}
