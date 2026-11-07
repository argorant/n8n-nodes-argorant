import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { argorantApiRequest } from '../shared/transport';

type SavedList = { list_id: number; name: string; item_count?: number | null };
type ListsPage = { lists?: SavedList[]; next_cursor?: string | null; has_more?: boolean };

export async function searchLists(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const qs: Record<string, string | number> = { limit: 100 };
	if (paginationToken) qs.cursor = paginationToken;
	const page = (await argorantApiRequest.call(this, 'GET', '/api/v1/lists', qs)) as ListsPage;
	const needle = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = (page.lists ?? [])
		.filter((list) => !needle || list.name.toLowerCase().includes(needle))
		.map((list) => ({
			name:
				typeof list.item_count === 'number'
					? `${list.name} (${list.item_count.toLocaleString('en-US')} people)`
					: list.name,
			value: String(list.list_id),
			url: `https://app.argorant.com/lists/${list.list_id}`,
		}));
	return { results, paginationToken: page.has_more ? (page.next_cursor ?? undefined) : undefined };
}
