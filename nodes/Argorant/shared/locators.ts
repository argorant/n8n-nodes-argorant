import type { INodeProperties } from 'n8n-workflow';

export const listLocator: INodeProperties = {
	displayName: 'List',
	name: 'listId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The saved list',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a list...',
			typeOptions: { searchListMethod: 'searchLists', searchable: true },
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 312',
			validation: [
				{
					type: 'regex',
					properties: { regex: '^[0-9]+$', errorMessage: 'A list ID is a number' },
				},
			],
		},
	],
};

export const campaignLocator: INodeProperties = {
	displayName: 'Campaign',
	name: 'campaignId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a campaign...',
			typeOptions: { searchListMethod: 'searchCampaigns', searchable: true },
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 7f3a2c1e-9b4d-4e8a-a1c2-5d6e7f8a9b0c',
		},
	],
};
