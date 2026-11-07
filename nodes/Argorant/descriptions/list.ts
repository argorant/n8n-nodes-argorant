import type { INodeProperties } from 'n8n-workflow';
import { peopleFilterOptions } from '../shared/filters';
import { listLocator } from '../shared/locators';
import { notice, returnAllAndLimit, showFor, simplifyField } from './common';

const peopleSource = (operation: string, withSavedSearch: boolean): INodeProperties[] => {
	const show = showFor('list', [operation]);
	const options = [
		{ name: 'Record IDs', value: 'recordIds', description: 'The people you picked, by record_id' },
		{ name: 'Filters', value: 'filters', description: 'Every person who matches the filters below' },
	];
	if (withSavedSearch) {
		options.push({
			name: 'Saved Search',
			value: 'savedSearch',
			description: 'Everyone who matches the filters of a list saved from a search; only new people join',
		});
	}
	return [
		{
			displayName: 'People From',
			name: 'peopleSource',
			type: 'options',
			noDataExpression: true,
			options,
			default: 'recordIds',
			displayOptions: { show },
		},
		{
			displayName: 'Record IDs',
			name: 'recordIds',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed, 6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
			description:
				'Record IDs from a search, separated by commas. IDs from all input items are combined and sent in batches.',
			displayOptions: { show: { ...show, peopleSource: ['recordIds'] } },
		},
		{
			...listLocator('savedSearch', 'Saved Search', 'A list saved from a search in Argorant; its filters are used', 'searchSavedSearches'),
			displayOptions: { show: { ...show, peopleSource: ['savedSearch'] } },
		},
		{
			displayName: 'Filters',
			name: 'filters',
			type: 'collection',
			placeholder: 'Add Filter',
			default: {},
			displayOptions: { show: { ...show, peopleSource: ['filters'] } },
			options: peopleFilterOptions(),
		},
	];
};

export const listDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['list'] } },
		options: [
			{
				name: 'Add People',
				value: 'addPeople',
				action: 'Add people to a list',
				description:
					'Add people to a saved list by record ID, by filters or from a saved search. People already in it are skipped. Free; nothing is revealed.',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a list',
				description:
					'Save the people you picked, or a search that keeps itself up to date, as a list. Free; nothing is revealed.',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a list',
				description: 'Delete a saved list. Exports and campaigns made from it keep their people. Free.',
			},
			{
				name: 'Export',
				value: 'export',
				action: 'Export a list',
				description:
					'Build a CSV of the people in a list. Every email is checked when the file is built. 1 credit per contact whose email passes the check; people exported before are left out by default.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a list',
				description: 'Get a saved list with its size and, while it fills, its progress. Free.',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many lists',
				description: 'Get your saved lists and saved searches, newest first. Free.',
			},
			{
				name: 'Get People',
				value: 'getPeople',
				action: 'Get people in a list',
				description:
					'Get the people in a list. Contact details stay masked unless your account already revealed them. Free.',
			},
			{
				name: 'Remove People',
				value: 'removePeople',
				action: 'Remove people from a list',
				description: 'Take people out of a saved list by record ID or by filters. Free.',
			},
			{
				name: 'Rename',
				value: 'rename',
				action: 'Rename a list',
				description: 'Give a saved list a new name. Free.',
			},
		],
		default: 'create',
	},

	notice(
		'exportNotice',
		'Costs 1 credit per contact whose email passes the check. People exported before are left out unless you turn that off.',
		showFor('list', ['export']),
	),

	{
		...listLocator('listId', 'List', 'The saved list'),
		displayOptions: {
			show: showFor('list', ['addPeople', 'delete', 'export', 'get', 'getPeople', 'removePeople', 'rename']),
		},
	},

	// create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Operations leads in Texas',
		description: 'The name of the list',
		displayOptions: { show: showFor('list', ['create', 'rename']) },
	},
	{
		displayName: 'People From',
		name: 'peopleSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Filters',
				value: 'filters',
				description: 'A saved search: everyone who matches, kept up to date',
			},
			{ name: 'Record IDs', value: 'recordIds', description: 'Exactly the people you picked, by record_id' },
		],
		default: 'filters',
		displayOptions: { show: showFor('list', ['create']) },
	},
	{
		displayName: 'Record IDs',
		name: 'recordIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed, 6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
		description: 'Record IDs from a search, separated by commas. IDs from all input items go into one list.',
		displayOptions: { show: { ...showFor('list', ['create']), peopleSource: ['recordIds'] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...showFor('list', ['create']), peopleSource: ['filters'] } },
		options: peopleFilterOptions(),
	},

	// add + remove
	...peopleSource('addPeople', true),
	...peopleSource('removePeople', false),
	{
		displayName: 'Batch Size',
		name: 'batchSize',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 10000 },
		default: 1000,
		description: 'Record IDs per request when many are sent',
		displayOptions: { show: { ...showFor('list', ['addPeople', 'removePeople']), peopleSource: ['recordIds'] } },
	},
	{
		displayName: 'Preview Only',
		name: 'preview',
		type: 'boolean',
		default: false,
		description: 'Whether to only count who would be taken out, without changing the list',
		displayOptions: { show: showFor('list', ['removePeople']) },
	},

	// get many
	{
		displayName: 'Kind',
		name: 'kind',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Picked People', value: 'records' },
			{ name: 'Saved Searches', value: 'filtered' },
		],
		default: 'all',
		description: 'Which lists to get',
		displayOptions: { show: showFor('list', ['getMany']) },
	},
	...returnAllAndLimit(showFor('list', ['getMany', 'getPeople'])),
	simplifyField(showFor('list', ['get', 'getMany', 'getPeople', 'export'])),

	// get
	{
		displayName: 'Include Fill Progress',
		name: 'includeFill',
		type: 'boolean',
		default: true,
		description: 'Whether to add how far a list that is still filling has come',
		displayOptions: { show: showFor('list', ['get']) },
	},

	// export
	{
		displayName: 'Max Rows',
		name: 'exportLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1000,
		description: 'Most people in the file, and so the most credits it can cost',
		displayOptions: { show: showFor('list', ['export']) },
	},
	{
		displayName: 'Options',
		name: 'exportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showFor('list', ['export']) },
		options: [
			{
				displayName: 'Email Me When Ready',
				name: 'emailWhenDone',
				type: 'boolean',
				default: false,
				description: 'Whether Argorant emails you when the file is ready',
			},
			{
				displayName: 'Leave Out People Exported Before',
				name: 'excludePreviouslyExported',
				type: 'boolean',
				default: true,
				description: 'Whether to leave out people you exported before, so you never pay twice',
			},
			{
				displayName: 'Wait for File',
				name: 'waitMinutes',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 30 },
				default: 0,
				description:
					'Minutes to wait for the file before the node continues; 0 returns at once. Use Export > Download or the Argorant Trigger (Export Ready) to get the file.',
			},
		],
	},
];
