import type { INodeProperties } from 'n8n-workflow';
import { campaignLocator, listLocator } from '../shared/locators';
import { confirmField, notice, returnAllAndLimit, showFor, simplifyField } from './common';

const WITH_CAMPAIGN = [
	'addLeads',
	'delete',
	'duplicate',
	'get',
	'getLeads',
	'getStats',
	'launch',
	'pause',
	'removeLeads',
	'resume',
	'sendTestEmail',
	'setSenders',
	'setSteps',
	'setUpPersonalLines',
	'stop',
	'update',
	'writePersonalLines',
];

const stepsField = (operation: string[]): INodeProperties => ({
	displayName: 'Emails',
	name: 'steps',
	type: 'fixedCollection',
	placeholder: 'Add Email',
	typeOptions: { multipleValues: true, sortable: true },
	default: {},
	description:
		'The emails in order. Use {{first_name}}, {{company}}, {{title}} and any column you added, with a default for people without a value: {{company|your team}}.',
	displayOptions: { show: showFor('campaign', operation) },
	options: [
		{
			displayName: 'Email',
			name: 'step',
			values: [
				{
					displayName: 'Subject',
					name: 'subject',
					type: 'string',
					default: '',
					placeholder: 'e.g. Quick question, {{first_name}}',
					description: 'Needed for the first email. Follow-ups without a subject stay in the same thread.',
				},
				{
					displayName: 'Body',
					name: 'body',
					type: 'string',
					typeOptions: { rows: 6 },
					default: '',
					placeholder: 'e.g. Hi {{first_name}}, ...',
					description: 'Plain text. Write the copy yourself or with your own AI model in an earlier node.',
				},
				{
					displayName: 'Wait Days',
					name: 'delayDays',
					type: 'number',
					typeOptions: { minValue: 0 },
					default: 3,
					description: 'Days after the previous email. The first email ignores it.',
				},
			],
		},
	],
});

const settingsOptions: INodeProperties[] = [
	{
		displayName: 'Auto Pause',
		name: 'autoPause',
		type: 'boolean',
		default: true,
		description: 'Whether the campaign pauses by itself when bounces are high or the mailboxes are offline',
	},
	{
		displayName: 'Auto Pause Bounce Rate (%)',
		name: 'autoPauseBounceRatePct',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 50 },
		default: 10,
		description: 'Bounce share in percent that pauses the campaign',
	},
	{
		displayName: 'Daily Limit',
		name: 'dailyLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 100,
		description: 'Emails a day for the whole campaign',
	},
	{
		displayName: 'Include Unsubscribe Link',
		name: 'includeUnsubscribe',
		type: 'boolean',
		default: false,
		description: 'Whether to add an unsubscribe link at the end of every email. A reply always works as an opt-out.',
	},
	{
		displayName: 'Max Pause Between Emails (Minutes)',
		name: 'gapMinutesMax',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 120,
		description: 'Longest pause between two emails from one mailbox',
	},
	{
		displayName: 'Min Pause Between Emails (Minutes)',
		name: 'gapMinutesMin',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 60,
		description: 'Shortest pause between two emails from one mailbox',
	},
	{
		displayName: 'Per Mailbox Daily Limit',
		name: 'perMailboxDailyLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 30,
		description: 'Most emails a day from one mailbox',
	},
	{
		displayName: 'Planned Start Date',
		name: 'plannedStartDate',
		type: 'dateTime',
		default: '',
		description: 'A launch before this date waits until then',
	},
	{
		displayName: 'Send in Lead Time Zone',
		name: 'leadTimezone',
		type: 'boolean',
		default: false,
		description: "Whether to send in each person's local time instead of the campaign time zone",
	},
	{
		displayName: 'Sending Window End',
		name: 'windowEnd',
		type: 'string',
		default: '17:00',
		placeholder: 'HH:MM',
		description: 'Sending stops at this time each day',
	},
	{
		displayName: 'Sending Window Start',
		name: 'windowStart',
		type: 'string',
		default: '08:00',
		placeholder: 'HH:MM',
		description: 'Sending starts at this time each day',
	},
	{
		displayName: 'Skip Shared Bounces',
		name: 'skipSharedBounces',
		type: 'boolean',
		default: true,
		description: 'Whether to also leave out addresses that bounced for other Argorant users (recommended)',
	},
	{
		displayName: 'Skip Weekends',
		name: 'skipWeekends',
		type: 'boolean',
		default: true,
		description: 'Whether to send no emails on Saturday and Sunday',
	},
	{
		displayName: 'Stop on Reply',
		name: 'stopOnReply',
		type: 'boolean',
		default: true,
		description: "Whether a reply ends that person's emails",
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		placeholder: 'e.g. q4, operations',
		description: 'Your own tags, separated by commas',
	},
	{
		displayName: 'Time Zone',
		name: 'timezone',
		type: 'string',
		default: 'America/New_York',
		placeholder: 'e.g. Europe/Berlin',
		description: 'Time zone name for the sending window',
	},
];

const mailboxPicker = (operation: string[]): INodeProperties => ({
	displayName: 'Mailbox Names or IDs',
	name: 'senders',
	type: 'multiOptions',
	typeOptions: { loadOptionsMethod: 'getMailboxes' },
	default: [],
	description:
		'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	displayOptions: { show: { ...showFor('campaign', operation), senderMode: ['choose'] } },
});

const senderFields: INodeProperties[] = [
	{
		displayName: 'Sending Mailboxes',
		name: 'senderMode',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Add Later', value: 'none' },
			{ name: 'All Connected Mailboxes', value: 'all' },
			{ name: 'Choose Mailboxes', value: 'choose' },
		],
		default: 'none',
		description: 'The mailboxes this campaign sends from. Emails are spread across them within their daily limits.',
		displayOptions: { show: showFor('campaign', ['create']) },
	},
	{
		displayName: 'Sending Mailboxes',
		name: 'senderMode',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'All Connected Mailboxes', value: 'all' },
			{ name: 'Choose Mailboxes', value: 'choose' },
		],
		default: 'choose',
		description: 'The mailboxes this campaign sends from. Emails are spread across them within their daily limits.',
		displayOptions: { show: showFor('campaign', ['setSenders']) },
	},
	mailboxPicker(['create', 'setSenders']),
];

export const campaignDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['campaign'] } },
		options: [
			{
				name: 'Add Leads',
				value: 'addLeads',
				action: 'Add leads to a campaign',
				description:
					'Add people from a saved list, by record ID, or from your own rows (one person per input item, batched). Every address is checked before it joins and only valid emails join. 1 credit per new person from Argorant data; your own rows, repeats and people you already have are free.',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a campaign',
				description:
					'Create a campaign as a draft with its name, emails, sending schedule and mailboxes. Free; nothing sends until you launch it.',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a campaign',
				description: 'Delete a draft, paused or stopped campaign with its emails, people and results. Free.',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				action: 'Duplicate a campaign',
				description:
					'Copy a campaign as a new draft with its settings and emails, without people, mailboxes or results. Free.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a campaign',
				description:
					'Get a campaign with its emails, mailboxes and launch_blockers: what still has to happen before it can launch. Free.',
			},
			{
				name: 'Get Leads',
				value: 'getLeads',
				action: 'Get leads in a campaign',
				description:
					'Get the people in a campaign with their status: pending, queued, active, replied, bounced, completed or suppressed. Free.',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many campaigns',
				description: 'Get your campaigns with status and counts: people, sent, replies, bounces. Free.',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				action: 'Get campaign stats',
				description:
					'Get totals and a daily series of sent emails, replies, positive replies, bounces and unsubscribes, with rates. Free.',
			},
			{
				name: 'Launch',
				value: 'launch',
				action: 'Launch a campaign',
				description:
					'Start sending a campaign. Sends real email to every valid person in it; emails count against the monthly campaign emails of your plan (no credits). Needs Confirm Launch; without it the node only checks whether the campaign is ready and sends nothing.',
			},
			{
				name: 'Pause',
				value: 'pause',
				action: 'Pause a campaign',
				description: 'Hold sending and keep the schedule. Free. Resume to continue.',
			},
			{
				name: 'Remove Leads',
				value: 'removeLeads',
				action: 'Remove leads from a campaign',
				description:
					'Take people out of a campaign by email address, status, tag or saved list, so nothing more is sent to them. Free.',
			},
			{
				name: 'Resume',
				value: 'resume',
				action: 'Resume a campaign',
				description:
					'Continue sending a paused campaign. Sends real email. Needs Confirm Launch; without it the node only checks whether the campaign is ready.',
			},
			{
				name: 'Send Test Email',
				value: 'sendTestEmail',
				action: 'Send a test email',
				description:
					'Send one test of a campaign email to yourself or a member of your workspace, filled with a sample person. Adds nobody and changes nothing. Free; a few tests an hour.',
			},
			{
				name: 'Set Mailboxes',
				value: 'setSenders',
				action: 'Set the sending mailboxes',
				description: 'Attach connected mailboxes to a campaign. Free; nothing is sent.',
			},
			{
				name: 'Set Up Personal Lines',
				value: 'setUpPersonalLines',
				action: 'Set up personal lines',
				description:
					'Define personal-line variables such as {{custom_opener}}, each with a fallback for people without their own line. Free. Write the lines with your own AI model, then use Write Personal Lines.',
			},
			{
				name: 'Stop',
				value: 'stop',
				action: 'Stop a campaign',
				description: 'End a campaign for good. Nothing more is sent. Free.',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a campaign',
				description: 'Change the name, sending schedule, limits and other settings. Free.',
			},
			{
				name: 'Write Emails',
				value: 'setSteps',
				action: 'Write the campaign emails',
				description:
					'Replace the email sequence of a campaign with subjects, bodies and waiting days. Write the copy yourself or with your own AI model. Free; nothing is sent.',
			},
			{
				name: 'Write Personal Lines',
				value: 'writePersonalLines',
				action: 'Write personal lines',
				description:
					'Save a personal line per person, for example one your own AI model wrote, by email address (one person per input item, batched). Free.',
			},
		],
		default: 'create',
	},

	{
		...campaignLocator(),
		displayOptions: { show: showFor('campaign', WITH_CAMPAIGN) },
	},

	notice(
		'addLeadsNotice',
		'Costs 1 credit per new person from Argorant data. Your own rows, repeats and people you already have are free. Only people with a valid email join.',
		showFor('campaign', ['addLeads']),
	),
	notice(
		'launchNotice',
		'Sends real email. With Confirm Launch off the node only checks whether the campaign is ready and sends nothing.',
		showFor('campaign', ['launch', 'resume']),
	),
	notice(
		'testNotice',
		'Sends one test email to you or a member of your workspace. Nobody else gets an email.',
		showFor('campaign', ['sendTestEmail']),
	),
	notice('stopNotice', 'Stopping is final: the campaign cannot send again.', showFor('campaign', ['stop'])),
	confirmField(
		'confirmLaunch',
		'Confirm Launch',
		'Whether to really start sending. Off: the node only checks that the campaign is ready and sends nothing.',
		showFor('campaign', ['launch', 'resume']),
	),

	// create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Operations leaders, Q4',
		description: 'The name of the campaign',
		displayOptions: { show: showFor('campaign', ['create']) },
	},
	stepsField(['create', 'setSteps']),
	...senderFields,
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: { show: showFor('campaign', ['create']) },
		options: settingsOptions,
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showFor('campaign', ['update']) },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name of the campaign',
			},
			...settingsOptions,
		],
	},
	{
		displayName: 'Send Placeholders as Written',
		name: 'allowPlaceholders',
		type: 'boolean',
		default: false,
		description:
			'Whether text such as [link] or TBD may stay in the emails. Off (recommended): such text is flagged and a launch waits until it is gone.',
		displayOptions: { show: showFor('campaign', ['setSteps', 'launch', 'resume']) },
	},

	// add leads
	{
		displayName: 'Leads From',
		name: 'leadSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Input Items',
				value: 'items',
				description: 'One person per input item, with their email and any extra columns',
			},
			{ name: 'Record IDs', value: 'recordIds', description: 'People from a search, by record ID' },
			{ name: 'Saved List', value: 'list', description: 'Every person in a saved list' },
		],
		default: 'items',
		displayOptions: { show: showFor('campaign', ['addLeads']) },
	},
	{
		...listLocator('leadListId', 'List', 'The saved list to add'),
		displayOptions: { show: { ...showFor('campaign', ['addLeads']), leadSource: ['list'] } },
	},
	{
		displayName: 'Record IDs',
		name: 'recordIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
		description: 'Record IDs from a search, separated by commas. IDs from all input items are combined.',
		displayOptions: { show: { ...showFor('campaign', ['addLeads']), leadSource: ['recordIds'] } },
	},
	{
		displayName: 'Email',
		name: 'leadEmail',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. maya.chen@linfield.example',
		description: "The person's email address. Drag the email field of the input here, so each item adds one person.",
		displayOptions: { show: { ...showFor('campaign', ['addLeads']), leadSource: ['items'] } },
	},
	{
		displayName: 'Lead Fields',
		name: 'leadFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showFor('campaign', ['addLeads']), leadSource: ['items'] } },
		options: [
			{ displayName: 'Company', name: 'company', type: 'string', default: '', placeholder: 'e.g. Linfield' },
			{ displayName: 'First Name', name: 'first_name', type: 'string', default: '', placeholder: 'e.g. Maya' },
			{ displayName: 'Job Title', name: 'title', type: 'string', default: '', placeholder: 'e.g. Head of Operations' },
			{ displayName: 'Last Name', name: 'last_name', type: 'string', default: '', placeholder: 'e.g. Chen' },
		],
	},
	{
		displayName: 'Extra Columns',
		name: 'extraColumns',
		type: 'fixedCollection',
		placeholder: 'Add Column',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Any column you add becomes a variable in the emails, for example plan becomes {{plan}}',
		displayOptions: { show: { ...showFor('campaign', ['addLeads']), leadSource: ['items'] } },
		options: [
			{
				displayName: 'Column',
				name: 'column',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g. city',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'e.g. Austin',
					},
				],
			},
		],
	},
	{
		displayName: 'Batch Size',
		name: 'batchSize',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 5000 },
		default: 500,
		description: 'People per request when many are sent',
		displayOptions: { show: { ...showFor('campaign', ['addLeads']), leadSource: ['items', 'recordIds'] } },
	},
	{
		displayName: 'Options',
		name: 'addLeadsOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showFor('campaign', ['addLeads']) },
		options: [
			{
				displayName: 'Business Emails Only',
				name: 'excludePrivateEmails',
				type: 'boolean',
				default: false,
				description: 'Whether to leave out free mail and home internet addresses',
			},
			{
				displayName: 'Keep Given Address',
				name: 'keepGivenAddress',
				type: 'boolean',
				default: false,
				description:
					'Whether to add the addresses exactly as given, with no swap to a better address of the same person',
			},
			{
				displayName: 'Bring Back Removed People',
				name: 'restoreRemoved',
				type: 'boolean',
				default: true,
				description:
					'Whether people taken out of this campaign earlier, and never emailed, come back when they are added again',
			},
		],
	},

	// get leads
	{
		displayName: 'Filters',
		name: 'leadFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showFor('campaign', ['getLeads']) },
		options: [
			{
				displayName: 'Search Text',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search name, email, company or your own columns',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Bounced', value: 'bounced' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Held (Missing Variable)', value: 'held' },
					{ name: 'Pending (Being Checked)', value: 'pending' },
					{ name: 'Queued', value: 'queued' },
					{ name: 'Replied', value: 'replied' },
					{ name: 'Suppressed', value: 'suppressed' },
				],
				default: 'active',
				description: 'Only people with this status',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Only people with this tag',
			},
		],
	},

	// remove leads
	{
		displayName: 'Remove By',
		name: 'removeBy',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Email Addresses', value: 'emails', description: 'Addresses from all input items are combined' },
			{ name: 'Saved List', value: 'list', description: 'Everyone in a saved list' },
			{ name: 'Status', value: 'status' },
			{ name: 'Tag', value: 'tag' },
		],
		default: 'emails',
		displayOptions: { show: showFor('campaign', ['removeLeads']) },
	},
	{
		displayName: 'Email Addresses',
		name: 'removeEmails',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. maya.chen@linfield.example',
		description: 'Email addresses, separated by commas',
		displayOptions: { show: { ...showFor('campaign', ['removeLeads']), removeBy: ['emails'] } },
	},
	{
		...listLocator('removeListId', 'List', 'Everyone in this saved list is taken out'),
		displayOptions: { show: { ...showFor('campaign', ['removeLeads']), removeBy: ['list'] } },
	},
	{
		displayName: 'Statuses',
		name: 'removeStatus',
		type: 'multiOptions',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Bounced', value: 'bounced' },
			{ name: 'Completed', value: 'completed' },
			{ name: 'Failed', value: 'failed' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'Queued', value: 'queued' },
			{ name: 'Replied', value: 'replied' },
			{ name: 'Sent', value: 'sent' },
			{ name: 'Unsubscribed', value: 'unsubscribed' },
		],
		default: [],
		displayOptions: { show: { ...showFor('campaign', ['removeLeads']), removeBy: ['status'] } },
	},
	{
		displayName: 'Tag',
		name: 'removeTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...showFor('campaign', ['removeLeads']), removeBy: ['tag'] } },
	},
	{
		displayName: 'Include People Already Emailed',
		name: 'includeContacted',
		type: 'boolean',
		default: true,
		description:
			'Whether to also stop people who already got an email and wait for a follow-up. Their sent emails and replies stay in the numbers.',
		displayOptions: { show: showFor('campaign', ['removeLeads']) },
	},
	{
		displayName: 'Preview Only',
		name: 'preview',
		type: 'boolean',
		default: false,
		description: 'Whether to only count who would be taken out, without changing the campaign',
		displayOptions: { show: showFor('campaign', ['removeLeads']) },
	},

	// personal lines
	{
		displayName: 'Variables',
		name: 'variables',
		type: 'fixedCollection',
		placeholder: 'Add Variable',
		typeOptions: { multipleValues: true },
		default: {},
		description: 'Up to 5 variables. Put {{custom_name}} into the emails where the line goes.',
		displayOptions: { show: showFor('campaign', ['setUpPersonalLines']) },
		options: [
			{
				displayName: 'Variable',
				name: 'variable',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g. opener',
						description: 'Saved with custom_ in front: 2 to 40 lowercase letters, digits or underscores',
					},
					{
						displayName: 'Fallback',
						name: 'fallback',
						type: 'string',
						default: '',
						placeholder: 'e.g. Hope the quarter is going well.',
						description: 'The line for everyone without their own line',
					},
					{
						displayName: 'Instruction',
						name: 'instruction',
						type: 'string',
						typeOptions: { rows: 3 },
						default: '',
						description: 'What the line says, for whoever writes it',
					},
					{
						displayName: 'Max Length',
						name: 'maxLength',
						type: 'number',
						typeOptions: { minValue: 20, maxValue: 300 },
						default: 150,
						description: 'Characters per line',
					},
				],
			},
		],
	},
	{
		displayName: 'Email',
		name: 'lineEmail',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. maya.chen@linfield.example',
		description: 'The email address of the person in the campaign, usually an expression',
		displayOptions: { show: showFor('campaign', ['writePersonalLines']) },
	},
	{
		displayName: 'Lines',
		name: 'lines',
		type: 'fixedCollection',
		placeholder: 'Add Line',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: showFor('campaign', ['writePersonalLines']) },
		options: [
			{
				displayName: 'Line',
				name: 'line',
				values: [
					{
						displayName: 'Variable',
						name: 'variable',
						type: 'string',
						default: '',
						placeholder: 'e.g. custom_opener',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						placeholder: 'e.g. Congrats on the new Austin office.',
					},
				],
			},
		],
	},
	{
		displayName: 'Replace Existing Lines',
		name: 'overwrite',
		type: 'boolean',
		default: false,
		description: 'Whether to replace a line a person already has. Off: saved lines are kept and listed.',
		displayOptions: { show: showFor('campaign', ['writePersonalLines']) },
	},

	// stats
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 365 },
		default: 30,
		description: 'The window in days',
		displayOptions: { show: showFor('campaign', ['getStats']) },
	},

	// test email
	{
		displayName: 'Options',
		name: 'testOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showFor('campaign', ['sendTestEmail']) },
		options: [
			{
				displayName: 'Email Number',
				name: 'step',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Which email of the campaign, 1 for the first',
			},
			{
				displayName: 'From Mailbox',
				name: 'sender',
				type: 'string',
				default: '',
				description: "A mailbox of your workspace. Empty: one of the campaign's mailboxes.",
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				default: '',
				description: 'Empty sends it to you. Otherwise a member of your workspace.',
			},
		],
	},

	// duplicate
	{
		displayName: 'New Name',
		name: 'newName',
		type: 'string',
		default: '',
		description: 'Name of the copy. Empty: the original name plus (copy).',
		displayOptions: { show: showFor('campaign', ['duplicate']) },
	},

	// get many
	{
		displayName: 'Filters',
		name: 'campaignFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showFor('campaign', ['getMany']) },
		options: [
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getCampaignTags' },
				default: [],
				description:
					'Only campaigns with every one of these tags. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Draft', value: 'draft' },
					{ name: 'Paused', value: 'paused' },
				],
				default: 'active',
				description: 'Only campaigns with this status',
			},
		],
	},
	...returnAllAndLimit(showFor('campaign', ['getMany', 'getLeads'])),
	simplifyField(showFor('campaign', ['create', 'get', 'getMany', 'getLeads', 'update', 'launch', 'pause', 'resume', 'stop', 'duplicate'])),
];
