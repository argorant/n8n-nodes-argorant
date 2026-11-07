import type { INodeProperties } from 'n8n-workflow';

const showForEmail = { resource: ['email'] };
const showForFind = { resource: ['email'], operation: ['find'] };

export const emailDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForEmail },
		options: [
			{
				name: 'Check',
				value: 'check',
				action: 'Check an email address',
				description:
					'Check whether an email address can receive mail: valid, invalid, catch_all, risky or unknown. Half a credit per fresh check.',
				routing: {
					request: { method: 'POST', url: '/api/mcp/email/verify' },
				},
			},
			{
				name: 'Find',
				value: 'find',
				action: 'Find a work email',
				description:
					"Find a person's work email from their name and company domain. 1 credit when found, 0.25 when nothing is found.",
				routing: {
					request: { method: 'POST', url: '/api/v1/email-finder/find' },
				},
			},
		],
		default: 'find',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'e.g. name@example.com',
		required: true,
		default: '',
		description: 'The email address to check',
		displayOptions: { show: { resource: ['email'], operation: ['check'] } },
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Maya',
		displayOptions: { show: showForFind },
		routing: { send: { type: 'body', property: 'first_name' } },
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Chen',
		displayOptions: { show: showForFind },
		routing: { send: { type: 'body', property: 'last_name' } },
	},
	{
		displayName: 'Company Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. example.com',
		description: 'The company domain. A website URL also works.',
		displayOptions: { show: showForFind },
		routing: { send: { type: 'body', property: 'domain' } },
	},
];
