import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { argorantApiRequest } from '../shared/transport';

type Campaign = { id: string; name: string; status?: string; url?: string };
type CampaignsPage = { campaigns?: Campaign[]; next_cursor?: string | null; has_more?: boolean };

export async function searchCampaigns(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const qs: Record<string, string | number> = { limit: 100 };
	if (paginationToken) qs.cursor = paginationToken;
	const page = (await argorantApiRequest.call(this, 'GET', '/api/v1/campaigns', qs)) as CampaignsPage;
	const needle = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = (page.campaigns ?? [])
		.filter((campaign) => !needle || campaign.name.toLowerCase().includes(needle))
		.map((campaign) => ({
			name: campaign.status ? `${campaign.name} (${campaign.status})` : campaign.name,
			value: campaign.id,
			url: campaign.url ?? `https://app.argorant.com/campaigns/${campaign.id}`,
		}));
	return { results, paginationToken: page.has_more ? (page.next_cursor ?? undefined) : undefined };
}
