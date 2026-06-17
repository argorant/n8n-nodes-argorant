import type { INodeType, INodeTypeDescription, INodeProperties } from 'n8n-workflow';

const FILTER_FIELDS: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Job title, e.g. CFO',
	},
	{
		displayName: 'Seniority',
		name: 'seniority',
		type: 'string',
		default: '',
		description: 'e.g. vp, director, c_suite',
	},
	{
		displayName: 'Department',
		name: 'departments',
		type: 'string',
		default: '',
		description: 'e.g. finance, engineering',
	},
	{
		displayName: 'Industry',
		name: 'industry',
		type: 'string',
		default: '',
		description: 'Plain-English industry, e.g. logistics',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: '',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Company Name',
		name: 'company_name',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Company Domain',
		name: 'company_domain',
		type: 'string',
		default: '',
		description: 'Company website domain, e.g. acme.com',
	},
	{
		displayName: 'Has Phone',
		name: 'has_phone',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Has LinkedIn',
		name: 'has_linkedin',
		type: 'boolean',
		default: false,
	},
];

function queryFilters(): INodeProperties {
	return {
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['people'] },
		},
		options: FILTER_FIELDS.map((f) => ({
			...f,
			routing: { send: { type: 'query' as const, property: f.name } },
		})),
	};
}

export class Argorant implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Argorant',
		name: 'argorant',
		icon: 'file:argorant.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Search, count, reveal, and export verified B2B contacts — 614M records, 184 countries, verified at export time',
		defaults: { name: 'Argorant' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'argorantApi', required: true }],
		requestDefaults: {
			baseURL: 'https://argorant.com/api',
			headers: { Accept: 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'People', value: 'people' },
					{ name: 'Company', value: 'company' },
					{ name: 'Email', value: 'email' },
					{ name: 'Export', value: 'export' },
				],
				default: 'people',
			},

			// ---------- People ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['people'] } },
				options: [
					{
						name: 'Count',
						value: 'count',
						action: 'Count matching contacts (free)',
						description: 'Count contacts matching the filters — never consumes credits',
						routing: { request: { method: 'GET', url: '/mcp/people/count' } },
					},
					{
						name: 'Search',
						value: 'search',
						action: 'Preview matching contacts (free, redacted)',
						description: 'Preview matches with contact details redacted — never consumes credits',
						routing: { request: { method: 'GET', url: '/mcp/people/preview' } },
					},
					{
						name: 'Reveal',
						value: 'reveal',
						action: 'Reveal full contact details (uses credits)',
						description: 'Full contact details incl. verified email — uses workspace quota/credits',
						routing: { request: { method: 'GET', url: '/mcp/people/reveal' } },
					},
				],
				default: 'count',
			},
			{
				displayName: 'Query',
				name: 'q',
				type: 'string',
				default: '',
				placeholder: 'e.g. fintech CFOs germany',
				description: 'Free-text query, combined with any structured filters',
				displayOptions: { show: { resource: ['people'] } },
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 10,
				typeOptions: { minValue: 1 },
				displayOptions: { show: { resource: ['people'], operation: ['search', 'reveal'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},
			queryFilters(),

				// ---------- Company ----------
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['company'] } },
					options: [
						{
							name: 'Count',
							value: 'countCompanies',
							action: 'Count matching companies (free)',
							routing: { request: { method: 'GET', url: '/mcp/companies/count' } },
						},
						{
							name: 'Search',
							value: 'searchCompanies',
							action: 'Search companies (free)',
							description: 'Firmographic company records: name, domain, industry, size, location',
							routing: { request: { method: 'GET', url: '/mcp/companies/search' } },
						},
					],
					default: 'searchCompanies',
				},
				{
					displayName: 'Query',
					name: 'companyQ',
					type: 'string',
					default: '',
					placeholder: 'e.g. logistics software',
					displayOptions: { show: { resource: ['company'] } },
					routing: { send: { type: 'query', property: 'q' } },
				},
				{
					displayName: 'Limit',
					name: 'companyLimit',
					type: 'number',
					default: 10,
					typeOptions: { minValue: 1 },
					displayOptions: { show: { resource: ['company'], operation: ['searchCompanies'] } },
					routing: { send: { type: 'query', property: 'limit' } },
				},
				{
					displayName: 'Filters',
					name: 'companyFilters',
					type: 'collection',
					placeholder: 'Add Filter',
					default: {},
					displayOptions: { show: { resource: ['company'] } },
					options: [
						{ displayName: 'Industry', name: 'industry', type: 'string', default: '' },
						{ displayName: 'Country', name: 'country', type: 'string', default: '' },
						{ displayName: 'State', name: 'state', type: 'string', default: '' },
						{ displayName: 'City', name: 'city', type: 'string', default: '' },
						{ displayName: 'Company Name', name: 'company_name', type: 'string', default: '' },
						{ displayName: 'Company Domain', name: 'company_domain', type: 'string', default: '' },
						{ displayName: 'Employee Range', name: 'employee_range', type: 'string', default: '', description: 'e.g. 11-50' },
						{ displayName: 'Keywords', name: 'keywords', type: 'string', default: '' },
						{ displayName: 'Technologies', name: 'technologies', type: 'string', default: '' },
					].map((f) => ({
						...(f as INodeProperties),
						routing: { send: { type: 'query' as const, property: f.name } },
					})),
				},

				// ---------- Email ----------
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['email'] } },
					options: [
						{
							name: 'Find Email',
							value: 'findEmail',
							action: 'Find a work email (uses credits)',
							description: 'Finds and verifies the best work email for a person at a domain',
							routing: { request: { method: 'POST', url: '/mcp/email/find' } },
						},
						{
							name: 'Verify Email',
							value: 'verifyEmail',
							action: 'Verify an email address (uses credits)',
							description: 'Live deliverability check: valid, catch_all, risky, invalid, unknown',
							routing: { request: { method: 'POST', url: '/mcp/email/verify' } },
						},
					],
					default: 'verifyEmail',
				},
				{
					displayName: 'First Name',
					name: 'firstName',
					type: 'string',
					default: '',
					required: true,
					displayOptions: { show: { resource: ['email'], operation: ['findEmail'] } },
					routing: { send: { type: 'body', property: 'first_name' } },
				},
				{
					displayName: 'Last Name',
					name: 'lastName',
					type: 'string',
					default: '',
					required: true,
					displayOptions: { show: { resource: ['email'], operation: ['findEmail'] } },
					routing: { send: { type: 'body', property: 'last_name' } },
				},
				{
					displayName: 'Company Domain',
					name: 'emailDomain',
					type: 'string',
					default: '',
					required: true,
					placeholder: 'acme.com',
					displayOptions: { show: { resource: ['email'], operation: ['findEmail'] } },
					routing: { send: { type: 'body', property: 'domain' } },
				},
				{
					displayName: 'Email Address',
					name: 'emailAddress',
					type: 'string',
					default: '',
					required: true,
					displayOptions: { show: { resource: ['email'], operation: ['verifyEmail'] } },
					routing: { send: { type: 'body', property: 'email' } },
				},

			// ---------- Export ----------
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
						action: 'Create a verified export job',
						description: 'Starts an async export; rows are verified at export time',
						routing: { request: { method: 'POST', url: '/mcp/exports/create' } },
					},
					{
						name: 'Get Status',
						value: 'status',
						action: 'Get export job status',
						routing: {
							request: { method: 'GET', url: '=/mcp/exports/{{$parameter.jobId}}' },
						},
					},
					{
						name: 'Download',
						value: 'download',
						action: 'Download the finished CSV',
						routing: {
							request: {
								method: 'GET',
								url: '=/mcp/exports/{{$parameter.jobId}}/download',
								encoding: 'text',
							},
						},
					},
				],
				default: 'create',
			},
			{
				displayName: 'Query',
				name: 'exportQ',
				type: 'string',
				default: '',
				placeholder: 'e.g. fintech CFOs germany',
				displayOptions: { show: { resource: ['export'], operation: ['create'] } },
				routing: { send: { type: 'body', property: 'filters.q' } },
			},
			{
				displayName: 'Rows',
				name: 'rows',
				type: 'number',
				default: 100,
				typeOptions: { minValue: 1 },
				description: 'Number of contacts to export',
				displayOptions: { show: { resource: ['export'], operation: ['create'] } },
				routing: { send: { type: 'body', property: 'limit' } },
			},
			{
				displayName: 'Filters',
				name: 'exportFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: { show: { resource: ['export'], operation: ['create'] } },
				options: FILTER_FIELDS.map((f) => ({
					...f,
					routing: { send: { type: 'body' as const, property: `filters.${f.name}` } },
				})),
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['export'], operation: ['status', 'download'] } },
			},
		],
	};
}
