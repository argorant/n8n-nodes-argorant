import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { route } from './actions/router';
import { campaignDescription } from './descriptions/campaign';
import { exportDescription } from './descriptions/export';
import { accountDescription, companyDescription, emailDescription, leadDescription } from './descriptions/lead';
import { listDescription } from './descriptions/list';
import { blocklistDescription, mailboxDescription, replyDescription } from './descriptions/reply';
import {
	getCampaignTags,
	getCountries,
	getIndustries,
	getMailboxes,
	getReplyStatuses,
	searchCampaigns,
	searchLists,
	searchMailboxes,
	searchSavedSearches,
} from './methods';

export class Argorant implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Argorant',
		name: 'argorant',
		icon: { light: 'file:../../icons/argorant.svg', dark: 'file:../../icons/argorant.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Find leads, check every email, build lists, write and launch campaigns, and handle replies in Argorant',
		defaults: {
			name: 'Argorant',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'argorantApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account', description: 'Credits, plan and limits' },
					{ name: 'Blocklist', value: 'blocklist', description: 'Addresses and domains never to email' },
					{ name: 'Campaign', value: 'campaign', description: 'Create, fill, launch and track campaigns' },
					{ name: 'Company', value: 'company', description: 'Count, search and look up companies' },
					{ name: 'Email', value: 'email', description: 'Find a work email or check an address' },
					{ name: 'Export', value: 'export', description: 'CSV files of checked contacts' },
					{ name: 'Lead', value: 'lead', description: 'Count, search, reveal and enrich people' },
					{ name: 'List', value: 'list', description: 'Saved lists and saved searches' },
					{ name: 'Mailbox', value: 'mailbox', description: 'The mailboxes your campaigns send from' },
					{ name: 'Reply', value: 'reply', description: 'Replies across your campaigns' },
				],
				default: 'lead',
			},
			...accountDescription,
			...blocklistDescription,
			...campaignDescription,
			...companyDescription,
			...emailDescription,
			...exportDescription,
			...leadDescription,
			...listDescription,
			...mailboxDescription,
			...replyDescription,
		],
	};

	methods = {
		listSearch: {
			searchCampaigns,
			searchLists,
			searchMailboxes,
			searchSavedSearches,
		},
		loadOptions: {
			getCampaignTags,
			getCountries,
			getIndustries,
			getMailboxes,
			getReplyStatuses,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await route.call(this);
	}
}
