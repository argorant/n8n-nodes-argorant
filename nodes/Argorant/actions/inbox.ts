import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { locatorValue } from '../shared/locators';
import { simplifyMailbox, simplifyReply } from '../shared/simplify';
import { argorantPaginate, argorantRequest, splitList } from '../shared/transport';
import type { ItemHandler } from './helpers';
import { enc, SCOPE } from './helpers';

const simplifyOn = (ctx: IExecuteFunctions, i: number) => ctx.getNodeParameter('simplify', i, true) as boolean;
const conversation = (ctx: IExecuteFunctions, i: number) =>
	`/api/v1/inbox/${enc(String(ctx.getNodeParameter('conversationId', i)).trim())}`;

export const reply: Record<string, ItemHandler> = {
	async getMany(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const filters = this.getNodeParameter('replyFilters', i, {}) as IDataObject;
		const qs: IDataObject = { folder: this.getNodeParameter('folder', i, 'replies') };
		const campaign = filters.campaign as IDataObject | string | undefined;
		const campaignValue = campaign && typeof campaign === 'object' ? String(campaign.value ?? '') : String(campaign ?? '');
		if (campaignValue.trim()) {
			const match = /[0-9a-fA-F-]{36}/.exec(campaignValue);
			qs.campaign_id = match ? match[0] : campaignValue.trim();
		}
		if (filters.q) qs.q = filters.q;
		if (filters.classification) qs.classification = filters.classification;
		const rows = await argorantPaginate.call(this, '/api/v1/inbox', 'events', qs, max, 500, 'cursor', SCOPE.read);
		return simplifyOn(this, i) ? rows.map(simplifyReply) : rows;
	},

	async get(i) {
		const answer = (await argorantRequest.call(this, 'GET', conversation(this, i), { scope: SCOPE.read })) as IDataObject;
		const event = (answer.event as IDataObject) ?? answer;
		return simplifyOn(this, i) ? { ...simplifyReply(event), thread: event.thread } : answer;
	},

	async getStatuses() {
		const answer = (await argorantRequest.call(this, 'GET', '/api/v1/reply-statuses', {
			qs: { limit: 500 },
			scope: SCOPE.read,
		})) as IDataObject;
		return (answer.statuses as IDataObject[]) ?? [];
	},

	async setStatus(i) {
		return (await argorantRequest.call(this, 'POST', `${conversation(this, i)}/classify`, {
			body: { classification: this.getNodeParameter('classification', i) },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async reply(i) {
		const body = String(this.getNodeParameter('body', i)).trim();
		if (!body) throw new NodeOperationError(this.getNode(), 'The message is empty', { itemIndex: i });
		return (await argorantRequest.call(this, 'POST', `${conversation(this, i)}/reply`, {
			body: { body },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async forward(i) {
		const to = splitList(this.getNodeParameter('forwardTo', i));
		if (!to.length || to.length > 10) {
			throw new NodeOperationError(this.getNode(), 'Give 1 to 10 addresses to forward to', { itemIndex: i });
		}
		const note = String(this.getNodeParameter('note', i, '')).trim();
		return (await argorantRequest.call(this, 'POST', `${conversation(this, i)}/forward`, {
			body: note ? { to, note } : { to },
			scope: SCOPE.lists,
		})) as IDataObject;
	},
};

export const mailbox: Record<string, ItemHandler> = {
	async getMany(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const filters = this.getNodeParameter('mailboxFilters', i, {}) as IDataObject;
		const qs: IDataObject = { summary: false };
		for (const key of ['domain', 'provider', 'q', 'tag']) if (filters[key]) qs[key] = filters[key];
		const status = (filters.status as string[] | undefined) ?? [];
		if (status.length) qs.status = status.join(',');
		const rows = await argorantPaginate.call(this, '/api/v1/inboxes', 'inboxes', qs, max, 500, 'cursor', SCOPE.read);
		return simplifyOn(this, i) ? rows.map(simplifyMailbox) : rows;
	},

	async update(i) {
		const address = locatorValue.call(this, 'mailbox', i);
		const fields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		if (!Object.keys(fields).length) {
			throw new NodeOperationError(this.getNode(), 'Add at least one field to update', { itemIndex: i });
		}
		const answer = (await argorantRequest.call(this, 'PATCH', `/api/v1/inboxes/${enc(address)}`, {
			body: fields,
			scope: SCOPE.lists,
		})) as IDataObject;
		const inbox = (answer.inbox as IDataObject) ?? answer;
		return simplifyOn(this, i) ? { ...simplifyMailbox(inbox), changed: answer.changed } : answer;
	},
};

export const blocklist: Record<string, ItemHandler> = {
	async add(i) {
		const value = String(this.getNodeParameter('value', i)).trim();
		const reason = String(this.getNodeParameter('reason', i, '')).trim();
		return (await argorantRequest.call(this, 'POST', '/api/v1/blocklist', {
			body: reason ? { value, reason } : { value },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async getMany(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const q = String(this.getNodeParameter('q', i, '')).trim();
		return await argorantPaginate.call(this, '/api/v1/blocklist', 'entries', q ? { q } : {}, max, 1000, 'cursor', SCOPE.read);
	},

	async remove(i) {
		const id = String(this.getNodeParameter('entryId', i)).trim();
		return (await argorantRequest.call(this, 'DELETE', `/api/v1/blocklist/${enc(id)}`, { scope: SCOPE.lists })) as IDataObject;
	},
};
