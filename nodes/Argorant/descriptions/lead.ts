import type { INodeProperties } from 'n8n-workflow';
import { companyFilterOptions, peopleFilterOptions } from '../shared/filters';
import { listLocator } from '../shared/locators';
import { notice, returnAllAndLimit, showFor, simplifyField } from './common';

// ---------------------------------------------------------------- account

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get account credits and limits',
				description:
					'Get the plan, the credits available now, the campaign emails left this month, the daily limits and the scopes of this key. Free. Call it before an operation that spends credits.',
			},
		],
		default: 'get',
	},
];

// ---------------------------------------------------------------- lead

const leadFilterSource = (operation: string[]): INodeProperties[] => [
	{
		displayName: 'Filters From',
		name: 'filterSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Fields Below', value: 'fields', description: 'Set the filters in this node' },
			{
				name: 'Saved Search',
				value: 'savedSearch',
				description: 'Use the filters of a list saved from a search',
			},
		],
		default: 'fields',
		displayOptions: { show: showFor('lead', operation) },
	},
	{
		...listLocator('savedSearch', 'Saved Search', 'A list saved from a search in Argorant; its filters are used', 'searchSavedSearches'),
		displayOptions: { show: { ...showFor('lead', operation), filterSource: ['savedSearch'] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...showFor('lead', operation), filterSource: ['fields'] } },
		options: peopleFilterOptions(),
	},
];

export const leadDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['lead'] } },
		options: [
			{
				name: 'Count',
				value: 'count',
				action: 'Count leads',
				description:
					'Count the people who match filters such as job title, seniority, industry, company size and country. Free. Use it first to size a market before you spend credits.',
			},
			{
				name: 'Enrich',
				value: 'enrich',
				action: 'Enrich a lead',
				description:
					'Get the person behind an email address, or find a person by name at a company domain, with their checked work email. 1 credit per person found whose email passes the check; the same person again and misses are free.',
			},
			{
				name: 'Get Phone Numbers',
				value: 'getPhones',
				action: 'Get phone numbers of leads',
				description:
					'Get the direct or mobile number of people by record ID. 10 credits per number returned; no number, no charge; numbers you already have are free. Pro plan and higher.',
			},
			{
				name: 'Reveal',
				value: 'reveal',
				action: 'Reveal leads',
				description:
					'Get full contact details with a checked work email, by record ID or for the next people who match filters. 1 credit per contact whose email passes the check; contacts that fail are left out and cost nothing; people you revealed before are free.',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search leads',
				description:
					'Preview the people who match filters: title, seniority, company and place, with names masked and no contact details. Free. Each row has a record_id to reveal, save to a list or add to a campaign.',
			},
		],
		default: 'search',
	},

	notice(
		'revealNotice',
		'Costs 1 credit per contact whose email passes the check. Contacts that fail cost nothing. People you revealed before are free. A key can reveal 100 people a day during the trial.',
		showFor('lead', ['reveal']),
	),
	notice(
		'enrichNotice',
		'Costs 1 credit per person found whose email passes the check. Misses and people you already have are free.',
		showFor('lead', ['enrich']),
	),
	notice(
		'phonesNotice',
		'Costs 10 credits per phone number returned. People without a number cost nothing. Pro plan and higher.',
		showFor('lead', ['getPhones']),
	),

	// count + search
	...leadFilterSource(['count', 'search']),
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 500 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: showFor('lead', ['search']) },
	},
	notice(
		'searchNotice',
		'Previews are free. During the trial an account can preview 500 rows a day. For more people, save a list or export.',
		showFor('lead', ['search']),
	),
	simplifyField(showFor('lead', ['search', 'reveal', 'enrich'])),
	{
		displayName: 'Options',
		name: 'searchOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showFor('lead', ['search']) },
		options: [
			{
				displayName: 'Start After Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'The next_cursor of an earlier search, to continue where it stopped',
			},
		],
	},

	// reveal
	{
		displayName: 'Reveal By',
		name: 'revealBy',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Record IDs', value: 'recordIds', description: 'People from Lead > Search or a list' },
			{ name: 'Filters', value: 'filters', description: 'The next people who match a search' },
		],
		default: 'recordIds',
		displayOptions: { show: showFor('lead', ['reveal']) },
	},
	{
		displayName: 'Record IDs',
		name: 'recordIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
		description:
			'Record IDs from a search, separated by commas. IDs from all input items are combined and sent 25 at a time.',
		displayOptions: { show: { ...showFor('lead', ['reveal']), revealBy: ['recordIds'] } },
	},
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
		displayOptions: { show: { ...showFor('lead', ['reveal']), revealBy: ['filters'] } },
	},
	{
		...listLocator('savedSearch', 'Saved Search', 'A list saved from a search in Argorant; its filters are used', 'searchSavedSearches'),
		displayOptions: {
			show: { ...showFor('lead', ['reveal']), revealBy: ['filters'], filterSource: ['savedSearch'] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { ...showFor('lead', ['reveal']), revealBy: ['filters'], filterSource: ['fields'] },
		},
		options: peopleFilterOptions(),
	},
	{
		displayName: 'Number of People',
		name: 'revealCount',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		description: 'How many people to reveal, at most 1 credit each',
		displayOptions: { show: { ...showFor('lead', ['reveal']), revealBy: ['filters'] } },
	},

	// enrich
	{
		displayName: 'Enrich By',
		name: 'enrichBy',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Email', value: 'email', description: 'The person behind an email address' },
			{
				name: 'Name and Company Domain',
				value: 'name',
				description: 'Find a person at a company and get their checked work email',
			},
		],
		default: 'email',
		displayOptions: { show: showFor('lead', ['enrich']) },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'e.g. maya.chen@linfield.example',
		required: true,
		default: '',
		displayOptions: { show: { ...showFor('lead', ['enrich']), enrichBy: ['email'] } },
	},
	{
		displayName: 'Full Name',
		name: 'name',
		type: 'string',
		placeholder: 'e.g. Maya Chen',
		required: true,
		default: '',
		displayOptions: { show: { ...showFor('lead', ['enrich']), enrichBy: ['name'] } },
	},
	{
		displayName: 'Company Domain',
		name: 'domain',
		type: 'string',
		placeholder: 'e.g. linfield.example',
		required: true,
		default: '',
		displayOptions: { show: { ...showFor('lead', ['enrich']), enrichBy: ['name'] } },
	},

	// phones
	{
		displayName: 'Record IDs',
		name: 'recordIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
		description:
			'Record IDs of people you found, separated by commas. IDs from all input items are combined and sent 100 at a time.',
		displayOptions: { show: showFor('lead', ['getPhones']) },
	},
];

// ---------------------------------------------------------------- company

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['company'] } },
		options: [
			{
				name: 'Count',
				value: 'count',
				action: 'Count companies',
				description: 'Count the companies that match filters such as industry, size, revenue and country. Free.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a company',
				description:
					'Get a company by its website domain: profile, how many people Argorant has there and how many of them have a work email, plus a short masked preview of those people. Free.',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search companies',
				description:
					'Find companies that match filters, with name, domain, industry, size and place. Free. Results stop at 10,000; narrow the filters for more.',
			},
		],
		default: 'search',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. linfield.example',
		description: "The company's website domain",
		displayOptions: { show: showFor('company', ['get']) },
	},
	{
		displayName: 'People Preview',
		name: 'previewLimit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 25 },
		default: 5,
		description: 'How many masked people to show as a preview, 1 to 25',
		displayOptions: { show: showFor('company', ['get']) },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showFor('company', ['count', 'search']) },
		options: companyFilterOptions(),
	},
	...returnAllAndLimit(showFor('company', ['search']), 10000),
	simplifyField(showFor('company', ['search', 'get'])),
];

// ---------------------------------------------------------------- email

export const emailDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['email'] } },
		options: [
			{
				name: 'Check',
				value: 'check',
				action: 'Check an email address',
				description:
					'Check whether an email address can receive mail: valid, invalid, catch_all, risky or unknown. Half a credit per fresh check (the first of every two single checks takes 1 credit, the next one 0). An address checked recently is free.',
			},
			{
				name: 'Find',
				value: 'find',
				action: 'Find a work email',
				description:
					"Find a person's work email from their name and company domain. 1 credit when an address is found, 0.25 when nothing is found; bad input and domains without email are free.",
			},
		],
		default: 'find',
	},
	notice(
		'checkNotice',
		'Half a credit per fresh check: the first of every two single checks takes 1 credit, the next one 0. Addresses checked recently are free.',
		showFor('email', ['check']),
	),
	notice(
		'findNotice',
		'Costs 1 credit when an address is found and 0.25 when nothing is found. Bad input and domains without email are free.',
		showFor('email', ['find']),
	),
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'e.g. maya.chen@linfield.example',
		required: true,
		default: '',
		description: 'The email address to check',
		displayOptions: { show: showFor('email', ['check']) },
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Maya',
		displayOptions: { show: showFor('email', ['find']) },
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Chen',
		displayOptions: { show: showFor('email', ['find']) },
	},
	{
		displayName: 'Company Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. linfield.example',
		description: 'The company domain. A website URL also works.',
		displayOptions: { show: showFor('email', ['find']) },
	},
];
