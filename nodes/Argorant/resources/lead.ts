import type { INodeProperties } from 'n8n-workflow';
import { peopleFiltersCollection } from '../shared/filters';

const showForLead = { resource: ['lead'] };

export const leadDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForLead },
		options: [
			{
				name: 'Count',
				value: 'count',
				action: 'Count leads',
				description:
					'Count how many people match the filters. Free. Use it first to size a market.',
				routing: {
					request: { method: 'GET', url: '/api/v1/people/count' },
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search leads',
				description:
					'Preview the people who match the filters: role, seniority, company and place, with names masked. Free.',
				routing: {
					request: { method: 'GET', url: '/api/v1/people/search' },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'people' } }],
					},
				},
			},
		],
		default: 'search',
	},
	peopleFiltersCollection('query', { resource: ['lead'], operation: ['count', 'search'] }),
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 10 },
		default: 10,
		description: 'How many people to return, 1 to 10. Use Page Cursor in Options for the next page.',
		displayOptions: { show: { resource: ['lead'], operation: ['search'] } },
		routing: { send: { type: 'query', property: 'limit' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['search'] } },
		options: [
			{
				displayName: 'Page Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'The next_cursor of an earlier search, to get the next page',
				routing: { send: { type: 'query', property: 'cursor' } },
			},
		],
	},
];
