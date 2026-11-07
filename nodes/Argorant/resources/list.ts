import type { INodeProperties } from 'n8n-workflow';
import { peopleFiltersCollection, SPLIT_IDS } from '../shared/filters';
import { listLocator } from '../shared/locators';

const showForList = { resource: ['list'] };

const sourceField = (operation: string): INodeProperties => ({
	displayName: 'People From',
	name: 'source',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Filters',
			value: 'filters',
			description: 'Every person who matches a search',
		},
		{
			name: 'Record IDs',
			value: 'recordIds',
			description: 'The people you picked, by the record_id from a search',
		},
	],
	default: 'filters',
	displayOptions: { show: { resource: ['list'], operation: [operation] } },
});

const recordIdsField = (operation: string): INodeProperties => ({
	displayName: 'Record IDs',
	name: 'recordIds',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed, 6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
	description: 'Record IDs from Lead > Search, separated by commas',
	displayOptions: { show: { resource: ['list'], operation: [operation], source: ['recordIds'] } },
	routing: { send: { type: 'body', property: 'record_ids', value: SPLIT_IDS } },
});

export const listDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForList },
		options: [
			{
				name: 'Add People',
				value: 'addPeople',
				action: 'Add people to a list',
				description:
					'Add people to a saved list, by record ID or by search filters. People already in it are skipped. Free.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v1/lists/{{$parameter.listId}}/items',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a list',
				description:
					'Save a search or the people you picked as a list. Saving costs nothing and reveals no contacts.',
				routing: {
					request: { method: 'POST', url: '/api/v1/lists' },
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. CFOs in Germany',
		description: 'The name of the new list',
		displayOptions: { show: { resource: ['list'], operation: ['create'] } },
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		...listLocator,
		displayOptions: { show: { resource: ['list'], operation: ['addPeople'] } },
	},
	sourceField('create'),
	sourceField('addPeople'),
	peopleFiltersCollection('body', {
		resource: ['list'],
		operation: ['create', 'addPeople'],
		source: ['filters'],
	}),
	recordIdsField('create'),
	recordIdsField('addPeople'),
];
