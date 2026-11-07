import type { INodeProperties } from 'n8n-workflow';

const showForReply = { resource: ['reply'] };
const showForGetAll = { resource: ['reply'], operation: ['getAll'] };

export const replyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForReply },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many replies',
				description:
					'Get replies across your campaigns, newest first, each with its status. Free.',
				routing: {
					request: { method: 'GET', url: '/api/v1/inbox' },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'events' } }],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Folder',
		name: 'folder',
		type: 'options',
		options: [
			{ name: 'All', value: 'all', description: 'Replies, bounces and unsubscribes' },
			{ name: 'Bounces', value: 'bounces' },
			{ name: 'Interested', value: 'interested' },
			{ name: 'Not Interested', value: 'not_interested' },
			{ name: 'Out of Office', value: 'out_of_office' },
			{ name: 'Replies', value: 'replies', description: 'Every reply, out of office included' },
			{ name: 'Unsubscribes', value: 'unsubscribes' },
		],
		default: 'replies',
		description: 'Which conversations to get',
		displayOptions: { show: showForGetAll },
		routing: { send: { type: 'query', property: 'folder' } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: showForGetAll },
		routing: {
			send: { paginate: '={{ $value }}', type: 'query', property: 'limit', value: '500' },
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue: '={{ !!$response.body?.has_more && !!$response.body?.next_cursor }}',
						request: {
							qs: { cursor: '={{ $response.body?.next_cursor }}' },
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 500 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { ...showForGetAll, returnAll: [false] } },
		routing: {
			send: { type: 'query', property: 'limit' },
			output: { maxResults: '={{$value}}' },
		},
	},
	{
		displayName: 'Filters',
		name: 'replyFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForGetAll },
		options: [
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				placeholder: 'e.g. 7f3a2c1e-9b4d-4e8a-a1c2-5d6e7f8a9b0c',
				description: 'Only replies to this campaign',
				routing: { send: { type: 'query', property: 'campaign_id' } },
			},
			{
				displayName: 'Search Text',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search subject, text, sender and company',
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'Status',
				name: 'classification',
				type: 'string',
				default: '',
				placeholder: 'e.g. positive',
				description: 'Only replies with this status',
				routing: { send: { type: 'query', property: 'classification' } },
			},
		],
	},
];
