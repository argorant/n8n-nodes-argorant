import type {
	IDataObject,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { argorantPaginate, argorantRequest } from '../Argorant/shared/transport';
import { verifySignature } from './signature';

export const TRIGGER_EVENTS: INodePropertyOptions[] = [
	{
		name: 'Campaign Paused',
		value: 'campaign.paused',
		description:
			'A campaign paused by itself: high bounces, mailboxes offline, or the monthly campaign emails used up',
	},
	{
		name: 'Campaign Resumed',
		value: 'campaign.resumed',
		description: 'A campaign paused for its monthly campaign emails sends again',
	},
	{
		name: 'Email Checked',
		value: 'verification.completed',
		description: 'A single email check finished, with its result',
	},
	{
		name: 'Export Ready',
		value: 'export.ready',
		description: 'An export finished; the data holds its ID and row counts',
	},
	{
		name: 'Lead Bounced',
		value: 'email.bounced',
		description: 'An email of a campaign bounced',
	},
	{
		name: 'Lead Unsubscribed',
		value: 'email.unsubscribed',
		description: 'A person asked to stop, by reply or by the unsubscribe link',
	},
	{
		name: 'List Ready',
		value: 'list.ready',
		description: 'A saved list finished filling',
	},
	{
		name: 'New Matches for a Saved Search',
		value: 'segment.new_matches',
		description: 'A saved search now finds more people than before',
	},
	{
		name: 'New Reply',
		value: 'reply.received',
		description: 'A person replied to a campaign. Out of office and other automatic replies are left out.',
	},
	{
		name: 'Reply Marked Interested',
		value: 'reply.positive',
		description: 'A reply was labeled Interested or Meeting request, by Argorant or by your team',
	},
];

/** Events about one person's reply: the node can add the conversation ID for Reply > Get, Set Status or Send Reply. */
const REPLY_EVENTS = new Set(['reply.received', 'reply.positive', 'email.unsubscribed']);

const CAMPAIGN_EVENTS = new Set([
	'campaign.paused',
	'campaign.resumed',
	'email.bounced',
	'email.unsubscribed',
	'reply.positive',
	'reply.received',
]);

interface HookState extends IDataObject {
	webhookId?: string;
	webhookSecret?: string;
	webhookUrl?: string;
}

/** The newest conversation of this person in this campaign: its ID and the mailbox that received it. */
async function findConversation(this: IWebhookFunctions, leadEmail: string, campaignId: string): Promise<IDataObject> {
	const qs: IDataObject = { folder: 'all', q: leadEmail, limit: 5 };
	if (campaignId) qs.campaign_id = campaignId;
	try {
		const page = (await argorantRequest.call(this, 'GET', '/api/v1/inbox', { qs, maxRetries: 2 })) as IDataObject;
		const events = (page.events as IDataObject[]) ?? [];
		const match =
			events.find((e) => String(e.from_email ?? '').toLowerCase() === leadEmail.toLowerCase()) ?? events[0];
		if (!match) return { conversation_id: null };
		return {
			conversation_id: match.id,
			inbox_email: match.inbox_email,
			lead_name: match.lead_name,
			company: match.company,
			campaign_name: match.campaign_name,
		};
	} catch (error) {
		// The event still starts the workflow; the lookup is a convenience.
		return { conversation_id: null, conversation_lookup_error: (error as Error).message };
	}
}

export class ArgorantTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Argorant Trigger',
		name: 'argorantTrigger',
		icon: { light: 'file:../../icons/argorant.svg', dark: 'file:../../icons/argorant.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description:
			'Starts the workflow when something happens in Argorant: a new or interested reply, a bounce, an unsubscribe, a paused campaign, a ready export or list',
		defaults: {
			name: 'Argorant Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'argorantApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'Argorant calls this workflow over the internet, so your n8n needs a public HTTPS address. Each call is signed and checked here.',
				name: 'httpsNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: ['reply.positive'],
				description: 'The events that start the workflow',
				options: TRIGGER_EVENTS,
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Add Conversation ID',
						name: 'addConversation',
						type: 'boolean',
						default: true,
						description:
							'Whether to look up the conversation of a reply, so later nodes can read, label or answer it. One free API call per reply.',
					},
					{
						displayName: 'Campaign Names or IDs',
						name: 'campaigns',
						type: 'multiOptions',
						typeOptions: { loadOptionsMethod: 'getCampaigns' },
						default: [],
						description:
							'Only events of these campaigns. Empty: every campaign. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Ignore Test Events',
						name: 'ignoreTests',
						type: 'boolean',
						default: false,
						description: 'Whether to skip the test events Argorant sends from its webhook settings',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const rows = await argorantPaginate.call(this, '/api/v1/campaigns', 'campaigns', {}, 500, 500);
				return rows.map((c) => ({ name: `${c.name} (${c.status})`, value: String(c.id) }));
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const state = this.getWorkflowStaticData('node') as HookState;
				const url = this.getNodeWebhookUrl('default');
				if (!state.webhookId) return false;
				const hooks = await argorantPaginate.call(this, '/api/v1/webhooks', 'webhooks', {}, undefined, 100);
				const events = [...(this.getNodeParameter('events', []) as string[])].sort().join(' ');
				const hook = hooks.find((h) => String(h.id) === String(state.webhookId));
				const same =
					hook &&
					hook.url === url &&
					hook.active !== false &&
					[...((hook.events as string[]) ?? [])].sort().join(' ') === events;
				if (same && state.webhookSecret) return true;
				if (hook) {
					await argorantRequest.call(this, 'DELETE', `/api/v1/webhooks/${encodeURIComponent(String(hook.id))}`);
				}
				delete state.webhookId;
				delete state.webhookSecret;
				delete state.webhookUrl;
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const url = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events', []) as string[];
				const answer = (await argorantRequest.call(this, 'POST', '/api/v1/webhooks', {
					body: { url, events },
					scope: 'argorant:manage_lists',
				})) as IDataObject;
				const state = this.getWorkflowStaticData('node') as HookState;
				state.webhookId = String(answer.id);
				state.webhookSecret = String(answer.secret ?? '');
				state.webhookUrl = url;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const state = this.getWorkflowStaticData('node') as HookState;
				if (state.webhookId) {
					const hooks = await argorantPaginate.call(this, '/api/v1/webhooks', 'webhooks', {}, undefined, 100);
					if (hooks.some((h) => String(h.id) === String(state.webhookId))) {
						await argorantRequest.call(this, 'DELETE', `/api/v1/webhooks/${encodeURIComponent(String(state.webhookId))}`);
					}
				}
				delete state.webhookId;
				delete state.webhookSecret;
				delete state.webhookUrl;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const state = this.getWorkflowStaticData('node') as HookState;
		const request = this.getRequestObject() as unknown as { rawBody?: Buffer };
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		const raw = request.rawBody ?? Buffer.from(JSON.stringify(body));
		if (!verifySignature(raw, String(headers['x-argorant-signature'] ?? ''), state.webhookSecret)) {
			const response = this.getResponseObject();
			response.status(401).json({ error: 'The Argorant signature is missing or wrong.' });
			return { noWebhookResponse: true };
		}

		const event = String(body.event ?? headers['x-argorant-event'] ?? '');
		const data = (body.data && typeof body.data === 'object' ? body.data : {}) as IDataObject;
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const isTest = data.test === true;
		if (isTest && options.ignoreTests) return {};

		const campaigns = (options.campaigns as string[] | undefined) ?? [];
		if (!isTest && campaigns.length && CAMPAIGN_EVENTS.has(event) && !campaigns.includes(String(data.campaign_id ?? ''))) {
			return {};
		}

		const item: IDataObject = {
			event,
			delivery_id: body.delivery_id ?? headers['x-argorant-delivery'],
			created_at: body.created_at,
			...data,
		};
		if (!isTest && options.addConversation !== false && REPLY_EVENTS.has(event) && data.lead_email) {
			Object.assign(item, await findConversation.call(this, String(data.lead_email), String(data.campaign_id ?? '')));
		}
		return { workflowData: [this.helpers.returnJsonArray([item])] };
	}
}
