import type { INodeProperties } from 'n8n-workflow';
import { campaignLocator, mailboxLocator } from '../shared/locators';
import { notice, returnAllAndLimit, showFor, simplifyField } from './common';

const conversationId = (operation: string[]): INodeProperties => ({
	displayName: 'Conversation ID',
	name: 'conversationId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g. native-conversation:lead:7f3a2c1e-...',
	description: 'The ID of a conversation from Reply > Get Many or the Argorant Trigger',
	displayOptions: { show: showFor('reply', operation) },
});

export const replyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['reply'] } },
		options: [
			{
				name: 'Forward',
				value: 'forward',
				action: 'Forward a conversation',
				description:
					'Forward a conversation with its history to up to 10 addresses, from the mailbox that received it. Sends email at once. Free.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a conversation',
				description: 'Get one conversation with the full text and the whole thread, oldest first. Free.',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many replies',
				description:
					'Get replies, bounces and unsubscribes across your campaigns, newest first, each with its status. Free.',
			},
			{
				name: 'Get Statuses',
				value: 'getStatuses',
				action: 'Get reply statuses',
				description:
					'Get the statuses a conversation can have, such as positive (Interested), meeting_request and your own pipeline stages. Free.',
			},
			{
				name: 'Send Reply',
				value: 'reply',
				action: 'Reply in a conversation',
				description:
					'Send a plain text answer in the same thread, from the mailbox that received the reply. Sends email at once. Free.',
			},
			{
				name: 'Set Status',
				value: 'setStatus',
				action: 'Set the status of a conversation',
				description:
					'Set the status of a conversation, for example Interested or Meeting booked. Free. Setting Interested also fires the Reply Marked Interested trigger.',
			},
		],
		default: 'getMany',
	},
	notice(
		'replyNotice',
		'Sends email at once from the mailbox that received the reply. Send only text you approved.',
		showFor('reply', ['reply', 'forward']),
	),

	conversationId(['get', 'setStatus', 'reply', 'forward']),

	{
		displayName: 'Status Name or ID',
		name: 'classification',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getReplyStatuses' },
		required: true,
		default: '',
		description:
			'The new status. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show: showFor('reply', ['setStatus']) },
	},
	{
		displayName: 'Message',
		name: 'body',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		placeholder: 'e.g. Thanks, Maya. Does Thursday at 10:00 work?',
		description: 'The answer, plain text',
		displayOptions: { show: showFor('reply', ['reply']) },
	},
	{
		displayName: 'To',
		name: 'forwardTo',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. sales@yourcompany.example',
		description: 'Up to 10 addresses, separated by commas',
		displayOptions: { show: showFor('reply', ['forward']) },
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		description: 'A note above the forwarded text',
		displayOptions: { show: showFor('reply', ['forward']) },
	},

	// get many
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
		displayOptions: { show: showFor('reply', ['getMany']) },
	},
	{
		displayName: 'Filters',
		name: 'replyFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showFor('reply', ['getMany']) },
		options: [
			{
				...campaignLocator('campaign', 'Only replies to this campaign'),
				required: false,
			},
			{
				displayName: 'Search Text',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search subject, text, sender and company',
			},
			{
				displayName: 'Status Name or ID',
				name: 'classification',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getReplyStatuses' },
				default: '',
				description:
					'Only replies with this status. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	...returnAllAndLimit(showFor('reply', ['getMany'])),
	simplifyField(showFor('reply', ['getMany', 'get'])),
];

export const mailboxDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['mailbox'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many mailboxes',
				description:
					"Get the sending mailboxes connected to your workspace with status, today's sends against the daily limit, warm-up and what needs fixing. Free.",
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a mailbox',
				description: 'Change the daily limit, warm-up, whether it may send, or the display name. Free.',
			},
		],
		default: 'getMany',
	},
	{
		...mailboxLocator(),
		displayOptions: { show: showFor('mailbox', ['update']) },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showFor('mailbox', ['update']) },
		options: [
			{
				displayName: 'Daily Limit',
				name: 'daily_limit',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 30,
				description: 'Cold emails a day from this mailbox',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				placeholder: 'e.g. Alex Rivera',
				description: 'The sender name people see',
			},
			{
				displayName: 'May Send',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the mailbox may send',
			},
			{
				displayName: 'Warm-Up Emails per Day',
				name: 'warmup_per_day',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 10 },
				default: 0,
				description: 'Warm-up emails a day, 0 (off) to 10',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'mailboxFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showFor('mailbox', ['getMany']) },
		options: [
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				description: 'One domain, or several separated by commas',
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				options: [
					{ name: 'Google', value: 'google' },
					{ name: 'Microsoft 365', value: 'ms365' },
					{ name: 'Other (SMTP)', value: 'smtp' },
				],
				default: 'google',
			},
			{
				displayName: 'Search Text',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Text in the address or the name',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				options: [
					{ name: 'Needs Attention', value: 'needs_attention' },
					{ name: 'Not Connected', value: 'not_connected' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Ready to Send', value: 'sendable' },
					{ name: 'Warming', value: 'warming' },
				],
				default: [],
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Mailboxes that carry this tag',
			},
		],
	},
	...returnAllAndLimit(showFor('mailbox', ['getMany'])),
	simplifyField(showFor('mailbox', ['getMany', 'update'])),
];

export const blocklistDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['blocklist'] } },
		options: [
			{
				name: 'Add',
				value: 'add',
				action: 'Block an address or domain',
				description:
					'Block an email address or a whole domain so no campaign of your workspace emails it again. Free.',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many blocked entries',
				description: 'Get the blocked addresses and domains. Free.',
			},
			{
				name: 'Remove',
				value: 'remove',
				action: 'Unblock an address or domain',
				description: 'Unblock an address or domain by its entry ID. Free.',
			},
		],
		default: 'add',
	},
	{
		displayName: 'Address or Domain',
		name: 'value',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. maya.chen@linfield.example or linfield.example',
		displayOptions: { show: showFor('blocklist', ['add']) },
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		placeholder: 'e.g. customer since October',
		description: 'Why, for your own records',
		displayOptions: { show: showFor('blocklist', ['add']) },
	},
	{
		displayName: 'Entry ID',
		name: 'entryId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the blocked entry from Blocklist > Get Many',
		displayOptions: { show: showFor('blocklist', ['remove']) },
	},
	{
		displayName: 'Search Text',
		name: 'q',
		type: 'string',
		default: '',
		description: 'Only entries that contain this text',
		displayOptions: { show: showFor('blocklist', ['getMany']) },
	},
	...returnAllAndLimit(showFor('blocklist', ['getMany'])),
];
