import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { campaignDescription } from './resources/campaign';
import { emailDescription } from './resources/email';
import { leadDescription } from './resources/lead';
import { listDescription } from './resources/list';
import { replyDescription } from './resources/reply';
import { searchCampaigns } from './listSearch/searchCampaigns';
import { searchLists } from './listSearch/searchLists';

export class Argorant implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Argorant',
		name: 'argorant',
		icon: { light: 'file:../../icons/argorant.svg', dark: 'file:../../icons/argorant.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Find leads, check emails, build lists and campaigns, and read replies in Argorant',
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
		requestDefaults: {
			baseURL: 'https://app.argorant.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Campaign', value: 'campaign' },
					{ name: 'Email', value: 'email' },
					{ name: 'Lead', value: 'lead' },
					{ name: 'List', value: 'list' },
					{ name: 'Reply', value: 'reply' },
				],
				default: 'lead',
			},
			...campaignDescription,
			...emailDescription,
			...leadDescription,
			...listDescription,
			...replyDescription,
		],
	};

	methods = {
		listSearch: {
			searchCampaigns,
			searchLists,
		},
	};
}
