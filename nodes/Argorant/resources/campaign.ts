import type { INodeProperties } from 'n8n-workflow';
import { SPLIT_IDS } from '../shared/filters';
import { campaignLocator, listLocator } from '../shared/locators';

const showForCampaign = { resource: ['campaign'] };
const showForCreate = { resource: ['campaign'], operation: ['createDraft'] };
const showForAddLeads = { resource: ['campaign'], operation: ['addLeads'] };

const rowValue = (
	displayName: string,
	name: string,
	key: string,
	placeholder: string,
	required = false,
): INodeProperties => ({
	displayName,
	name,
	type: 'string',
	default: '',
	required,
	placeholder,
	routing: { send: { type: 'body', property: `=rows[{{$index}}].${key}` } },
});

export const campaignDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForCampaign },
		options: [
			{
				name: 'Add Leads',
				value: 'addLeads',
				action: 'Add leads to a campaign',
				description:
					'Add people to a campaign from a saved list, from search record IDs or from your own rows. 1 credit per new person from Argorant data; your own rows are free.',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v1/campaigns/{{$parameter.campaignId}}/leads',
					},
				},
			},
			{
				name: 'Create Draft',
				value: 'createDraft',
				action: 'Create a campaign draft',
				description: 'Create a campaign as a draft. Nothing sends until you launch it in Argorant.',
				routing: {
					request: { method: 'POST', url: '/api/v1/campaigns' },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'campaign' } }],
					},
				},
			},
		],
		default: 'createDraft',
	},

	// ------------------------------------------------------------------ create draft
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Q4 CFO outreach',
		description: 'The name of the campaign',
		displayOptions: { show: showForCreate },
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForCreate },
		options: [
			{
				displayName: 'Daily Limit',
				name: 'dailyLimit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 100,
				description: 'Emails a day for the whole campaign',
				routing: { send: { type: 'body', property: 'daily_limit' } },
			},
			{
				displayName: 'Sending Window End',
				name: 'windowEnd',
				type: 'string',
				default: '17:00',
				placeholder: 'HH:MM',
				description: 'Sending stops at this time each day',
				routing: { send: { type: 'body', property: 'window_end' } },
			},
			{
				displayName: 'Sending Window Start',
				name: 'windowStart',
				type: 'string',
				default: '08:00',
				placeholder: 'HH:MM',
				description: 'Sending starts at this time each day',
				routing: { send: { type: 'body', property: 'window_start' } },
			},
			{
				displayName: 'Skip Weekends',
				name: 'skipWeekends',
				type: 'boolean',
				default: true,
				description: 'Whether to send no emails on Saturday and Sunday',
				routing: { send: { type: 'body', property: 'skip_weekends' } },
			},
			{
				displayName: 'Stop on Reply',
				name: 'stopOnReply',
				type: 'boolean',
				default: true,
				description: "Whether a reply ends that person's emails",
				routing: { send: { type: 'body', property: 'stop_on_reply' } },
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				placeholder: 'e.g. q4, finance',
				description: 'Your own tags, separated by commas',
				routing: { send: { type: 'body', property: 'tags', value: SPLIT_IDS } },
			},
			{
				displayName: 'Time Zone',
				name: 'timezone',
				type: 'string',
				default: 'America/New_York',
				placeholder: 'e.g. Europe/Berlin',
				description: 'Time zone name for the sending window',
				routing: { send: { type: 'body', property: 'timezone' } },
			},
		],
	},

	// ------------------------------------------------------------------ add leads
	{
		...campaignLocator,
		displayOptions: { show: showForAddLeads },
	},
	{
		displayName: 'Leads From',
		name: 'leadSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Record IDs',
				value: 'recordIds',
				description: 'People from Lead > Search, by record ID',
			},
			{
				name: 'Saved List',
				value: 'list',
				description: 'Every person in a saved list',
			},
			{
				name: 'Your Own Rows',
				value: 'rows',
				description: 'People you already have, with their email address',
			},
		],
		default: 'list',
		displayOptions: { show: showForAddLeads },
	},
	{
		...listLocator,
		name: 'leadListId',
		displayOptions: { show: { ...showForAddLeads, leadSource: ['list'] } },
		routing: { send: { type: 'body', property: 'list_id', value: '={{ Number($value) }}' } },
	},
	{
		displayName: 'Record IDs',
		name: 'leadRecordIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed, 6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
		description: 'Record IDs from Lead > Search, separated by commas',
		displayOptions: { show: { ...showForAddLeads, leadSource: ['recordIds'] } },
		routing: { send: { type: 'body', property: 'record_ids', value: SPLIT_IDS } },
	},
	{
		displayName: 'Rows',
		name: 'rows',
		type: 'fixedCollection',
		placeholder: 'Add Person',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: { ...showForAddLeads, leadSource: ['rows'] } },
		options: [
			{
				displayName: 'Person',
				name: 'row',
				values: [
					rowValue('Email', 'email', 'email', 'e.g. name@example.com', true),
					rowValue('First Name', 'firstName', 'first_name', 'e.g. Maya'),
					rowValue('Last Name', 'lastName', 'last_name', 'e.g. Chen'),
					rowValue('Company', 'company', 'company', 'e.g. Linfield'),
					rowValue('Job Title', 'title', 'title', 'e.g. Head of Operations'),
				],
			},
		],
	},
	{
		displayName: 'Email Results to Accept',
		name: 'grades',
		type: 'multiOptions',
		options: [
			{
				name: 'Valid',
				value: 'valid',
				description: 'Confirmed addresses (recommended)',
			},
			{
				name: 'Catch-All',
				value: 'catch_all',
				description: 'Addresses at domains that accept every email, at a higher bounce risk',
			},
		],
		default: ['valid'],
		description: 'Which email results may join the campaign',
		displayOptions: { show: showForAddLeads },
		routing: { send: { type: 'body', property: 'grades' } },
	},
	{
		displayName: 'Options',
		name: 'addLeadsOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showForAddLeads },
		options: [
			{
				displayName: 'Business Emails Only',
				name: 'excludePrivateEmails',
				type: 'boolean',
				default: false,
				description: 'Whether to leave out free mail and home internet addresses',
				routing: { send: { type: 'body', property: 'exclude_private_emails' } },
			},
		],
	},
];
