import type { INodeProperties } from 'n8n-workflow';
import { peopleFilterOptions } from '../shared/filters';
import { listLocator } from '../shared/locators';
import { notice, returnAllAndLimit, showFor, simplifyField } from './common';

export const exportDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['export'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an export',
				description:
					'Build a CSV of the people who match filters or a saved search. Every email is checked when the file is built. 1 credit per contact whose email passes the check, plus 10 per phone number when phone numbers are asked for.',
			},
			{
				name: 'Download',
				value: 'download',
				action: 'Download an export',
				description: 'Download a finished export as a CSV file. Free, also again later.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an export',
				description: 'Get where an export is: queued, processing, done or failed, with its rows and credits. Free.',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many exports',
				description: 'Get your exports, newest first. Free.',
			},
		],
		default: 'create',
	},
	notice(
		'exportCreateNotice',
		'Costs 1 credit per contact whose email passes the check (plus 10 per phone number if asked for). People exported before are left out unless you turn that off.',
		showFor('export', ['create']),
	),
	{
		displayName: 'Filters From',
		name: 'filterSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Fields Below', value: 'fields' },
			{ name: 'Saved Search', value: 'savedSearch' },
		],
		default: 'fields',
		displayOptions: { show: showFor('export', ['create']) },
	},
	{
		...listLocator('savedSearch', 'Saved Search', 'A list saved from a search in Argorant; its filters are used', 'searchSavedSearches'),
		displayOptions: { show: { ...showFor('export', ['create']), filterSource: ['savedSearch'] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...showFor('export', ['create']), filterSource: ['fields'] } },
		options: peopleFilterOptions(),
	},
	{
		displayName: 'Max Rows',
		name: 'exportLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1000,
		description: 'Most people in the file, and so the most credits it can cost',
		displayOptions: { show: showFor('export', ['create']) },
	},
	{
		displayName: 'Options',
		name: 'exportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showFor('export', ['create']) },
		options: [
			{
				displayName: 'Email Me When Ready',
				name: 'emailWhenDone',
				type: 'boolean',
				default: false,
				description: 'Whether Argorant emails you when the file is ready',
			},
			{
				displayName: 'Include Phone Numbers',
				name: 'includePhones',
				type: 'boolean',
				default: false,
				description: 'Whether to add phone numbers, 10 credits each (Pro plan and higher)',
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
	{
		displayName: 'Export ID',
		name: 'exportId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 84213',
		description: 'The job_id of the export',
		displayOptions: { show: showFor('export', ['get', 'download']) },
	},
	{
		displayName: 'Rows to Include',
		name: 'grades',
		type: 'options',
		options: [
			{ name: 'Valid Emails Only', value: 'valid' },
			{ name: 'Valid and Catch-All', value: 'valid,catch_all' },
			{ name: 'All Rows', value: 'all' },
		],
		default: 'valid',
		description: 'Which rows the CSV holds',
		displayOptions: { show: showFor('export', ['download']) },
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		hint: 'The name of the output binary field to put the file in',
		displayOptions: { show: showFor('export', ['download']) },
	},
	...returnAllAndLimit(showFor('export', ['getMany'])),
	simplifyField(showFor('export', ['get', 'getMany'])),
];

