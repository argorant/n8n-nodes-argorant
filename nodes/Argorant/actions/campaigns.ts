import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { locatorValue } from '../shared/locators';
import { simplifyCampaign, simplifyCampaignLead } from '../shared/simplify';
import { argorantPaginate, argorantRequest, chunk, splitList } from '../shared/transport';
import type { BulkHandler, ItemHandler } from './helpers';
import { collectAcrossItems, enc, pairedFrom, SCOPE } from './helpers';

const simplifyOn = (ctx: IExecuteFunctions, i: number) => ctx.getNodeParameter('simplify', i, true) as boolean;
const campaignId = (ctx: IExecuteFunctions, i: number) => locatorValue.call(ctx, 'campaignId', i);
const campaignPath = (ctx: IExecuteFunctions, i: number) => `/api/v1/campaigns/${enc(campaignId(ctx, i))}`;

/** The grades a campaign accepts from the node: valid only, as the platform recommends. */
const VALID_ONLY = ['valid'];

export function settingsBody(values: IDataObject): IDataObject {
	const map: Record<string, string> = {
		autoPause: 'auto_pause',
		autoPauseBounceRatePct: 'auto_pause_bounce_rate_pct',
		dailyLimit: 'daily_limit',
		gapMinutesMax: 'gap_minutes_max',
		gapMinutesMin: 'gap_minutes_min',
		includeUnsubscribe: 'include_unsubscribe',
		name: 'name',
		perMailboxDailyLimit: 'per_mailbox_daily_limit',
		skipSharedBounces: 'skip_shared_bounces',
		skipWeekends: 'skip_weekends',
		stopOnReply: 'stop_on_reply',
		timezone: 'timezone',
		windowEnd: 'window_end',
		windowStart: 'window_start',
	};
	const body: IDataObject = {};
	for (const [key, value] of Object.entries(values)) {
		if (value === undefined || value === null || value === '') continue;
		if (key === 'leadTimezone') body.timezone_mode = value ? 'lead' : 'fixed';
		else if (key === 'plannedStartDate') body.planned_start_date = String(value).slice(0, 10);
		else if (key === 'tags') body.tags = splitList(value);
		else if (map[key]) body[map[key]] = typeof value === 'string' ? value.trim() : value;
	}
	return body;
}

export function stepsBody(values: IDataObject): IDataObject[] {
	const steps = ((values.step as IDataObject[] | undefined) ?? []).filter((s) => String(s.body ?? '').trim());
	return steps.map((s, index) => {
		const email: IDataObject = { body: String(s.body) };
		if (String(s.subject ?? '').trim()) email.subject = String(s.subject).trim();
		if (index > 0) email.delay_days = Number(s.delayDays ?? 3);
		return email;
	});
}

function blockerText(blocker: unknown): string {
	if (typeof blocker === 'string') return blocker.replace(/[.\s]+$/, '');
	if (blocker && typeof blocker === 'object') {
		const b = blocker as IDataObject;
		return String(b.message ?? b.summary ?? b.reason ?? b.code ?? JSON.stringify(b)).replace(/[.\s]+$/, '');
	}
	return String(blocker).replace(/[.\s]+$/, '');
}

async function senders(this: IExecuteFunctions, i: number, id: string): Promise<IDataObject | undefined> {
	const mode = this.getNodeParameter('senderMode', i, 'none') as string;
	if (mode === 'none') return undefined;
	const body: IDataObject =
		mode === 'all' ? { all_connected: true } : { emails: this.getNodeParameter('senders', i, []) as string[] };
	if (mode === 'choose' && !(body.emails as string[]).length) {
		throw new NodeOperationError(this.getNode(), 'Choose at least one mailbox', { itemIndex: i });
	}
	return (await argorantRequest.call(this, 'POST', `/api/v1/campaigns/${enc(id)}/senders`, {
		body,
		scope: SCOPE.lists,
	})) as IDataObject;
}

async function readiness(this: IExecuteFunctions, i: number, action: 'launch' | 'resume'): Promise<IDataObject> {
	const answer = (await argorantRequest.call(this, 'GET', campaignPath(this, i), { scope: SCOPE.read })) as IDataObject;
	const campaign = (answer.campaign as IDataObject) ?? {};
	const blockers = ((answer.launch_blockers as unknown[]) ?? []).map(blockerText);
	const warnings = ((answer.copy_warnings as unknown[]) ?? []).map(blockerText);
	const ready = blockers.length === 0;
	return {
		launched: false,
		dry_run: true,
		ready,
		launch_blockers: blockers,
		copy_warnings: warnings,
		message: ready
			? `Ready to ${action}. Nothing was sent: turn on Confirm Launch to start sending.`
			: `Not ready to ${action}: ${blockers.join('; ')}. Nothing was sent.`,
		campaign: simplifyOn(this, i) ? simplifyCampaign(campaign) : campaign,
	};
}

async function launchOrResume(this: IExecuteFunctions, i: number, action: 'launch' | 'resume'): Promise<IDataObject> {
	if (!this.getNodeParameter('confirmLaunch', i, false)) return await readiness.call(this, i, action);
	const answer = (await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/launch`, {
		body: { allow_placeholders: this.getNodeParameter('allowPlaceholders', i, false) },
		scope: SCOPE.lists,
	})) as IDataObject;
	const campaign = (answer.campaign as IDataObject) ?? answer;
	return {
		launched: true,
		...(simplifyOn(this, i) ? simplifyCampaign(campaign) : { campaign }),
		...(answer.variable_coverage ? { variable_coverage: answer.variable_coverage } : {}),
	};
}

const campaignOut = (ctx: IExecuteFunctions, i: number, answer: IDataObject): IDataObject => {
	const campaign = (answer.campaign as IDataObject) ?? answer;
	return simplifyOn(ctx, i) ? simplifyCampaign(campaign) : answer;
};

export const campaign: Record<string, ItemHandler> = {
	async create(i) {
		const name = String(this.getNodeParameter('name', i)).trim();
		const body = { ...settingsBody(this.getNodeParameter('settings', i, {}) as IDataObject), name };
		const created = (await argorantRequest.call(this, 'POST', '/api/v1/campaigns', {
			body,
			scope: SCOPE.lists,
		})) as IDataObject;
		const id = String((created.campaign as IDataObject)?.id ?? '');
		const emails = stepsBody(this.getNodeParameter('steps', i, {}) as IDataObject);
		try {
			if (emails.length) {
				await argorantRequest.call(this, 'POST', `/api/v1/campaigns/${enc(id)}/emails`, {
					body: { emails },
					scope: SCOPE.lists,
				});
			}
			await senders.call(this, i, id);
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`The campaign was created as a draft (${id}), but setting it up failed: ${(error as Error).message}`,
				{ itemIndex: i, description: (error as { description?: string }).description ?? '' },
			);
		}
		const full = (await argorantRequest.call(this, 'GET', `/api/v1/campaigns/${enc(id)}`, {
			scope: SCOPE.read,
		})) as IDataObject;
		if (!simplifyOn(this, i)) return full;
		return {
			...simplifyCampaign((full.campaign as IDataObject) ?? {}),
			launch_blockers: ((full.launch_blockers as unknown[]) ?? []).map(blockerText),
			copy_warnings: ((full.copy_warnings as unknown[]) ?? []).map(blockerText),
		};
	},

	async get(i) {
		const answer = (await argorantRequest.call(this, 'GET', campaignPath(this, i), { scope: SCOPE.read })) as IDataObject;
		if (!simplifyOn(this, i)) return answer;
		return {
			...simplifyCampaign((answer.campaign as IDataObject) ?? {}),
			launch_blockers: ((answer.launch_blockers as unknown[]) ?? []).map(blockerText),
			copy_warnings: ((answer.copy_warnings as unknown[]) ?? []).map(blockerText),
			emails: answer.emails,
			senders: ((answer.senders as IDataObject[]) ?? []).map((s) => s.email),
		};
	},

	async getMany(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const filters = this.getNodeParameter('campaignFilters', i, {}) as IDataObject;
		const qs: IDataObject = {};
		const tags = (filters.tags as string[] | undefined) ?? [];
		if (tags.length) qs.tag = tags;
		const status = filters.status ? String(filters.status) : '';
		// The API has no status filter: read every page and keep the matches.
		let rows = await argorantPaginate.call(this, '/api/v1/campaigns', 'campaigns', qs, status ? undefined : max, 500, 'cursor', SCOPE.read);
		if (status) rows = rows.filter((c) => String(c.status) === status).slice(0, max ?? undefined);
		return simplifyOn(this, i) ? rows.map(simplifyCampaign) : rows;
	},

	async update(i) {
		const body = settingsBody(this.getNodeParameter('updateFields', i, {}) as IDataObject);
		if (!Object.keys(body).length) {
			throw new NodeOperationError(this.getNode(), 'Add at least one field to update', { itemIndex: i });
		}
		const answer = (await argorantRequest.call(this, 'PATCH', campaignPath(this, i), {
			body,
			scope: SCOPE.lists,
		})) as IDataObject;
		return { ...campaignOut(this, i, answer), changed: answer.changed };
	},

	async delete(i) {
		return (await argorantRequest.call(this, 'DELETE', campaignPath(this, i), { scope: SCOPE.lists })) as IDataObject;
	},

	async duplicate(i) {
		const name = String(this.getNodeParameter('newName', i, '')).trim();
		const answer = (await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/duplicate`, {
			body: name ? { name } : {},
			scope: SCOPE.lists,
		})) as IDataObject;
		return { ...campaignOut(this, i, answer), not_copied: answer.not_copied };
	},

	async setSteps(i) {
		const emails = stepsBody(this.getNodeParameter('steps', i, {}) as IDataObject);
		if (!emails.length) throw new NodeOperationError(this.getNode(), 'Add at least one email with a body', { itemIndex: i });
		if (!emails[0].subject) {
			throw new NodeOperationError(this.getNode(), 'The first email needs a subject', { itemIndex: i });
		}
		return (await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/emails`, {
			body: { emails, allow_placeholders: this.getNodeParameter('allowPlaceholders', i, false) },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async setSenders(i) {
		return (await senders.call(this, i, campaignId(this, i))) ?? {};
	},

	async addLeads(i) {
		// Input items and record IDs go through campaignBulk.addLeads; this path adds a saved list.
		const listId = locatorValue.call(this, 'leadListId', i);
		return (await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/leads`, {
			body: { list_id: Number(listId), grades: VALID_ONLY, ...leadOptions(this, i) },
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async getLeads(i) {
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		const max = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
		const filters = this.getNodeParameter('leadFilters', i, {}) as IDataObject;
		const qs: IDataObject = {};
		for (const key of ['q', 'status', 'tag']) if (filters[key]) qs[key] = filters[key];
		const rows = await argorantPaginate.call(this, `${campaignPath(this, i)}/leads`, 'leads', qs, max, 500, 'after', SCOPE.read);
		return simplifyOn(this, i) ? rows.map(simplifyCampaignLead) : rows;
	},

	async removeLeads(i) {
		const by = this.getNodeParameter('removeBy', i) as string;
		const body: IDataObject = {
			include_contacted: this.getNodeParameter('includeContacted', i, true),
			preview: this.getNodeParameter('preview', i, false),
		};
		if (by === 'list') body.list_id = Number(locatorValue.call(this, 'removeListId', i));
		else if (by === 'status') body.status = this.getNodeParameter('removeStatus', i, []) as string[];
		else if (by === 'tag') body.tag = String(this.getNodeParameter('removeTag', i)).trim();
		return (await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/leads/remove`, {
			body,
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async setUpPersonalLines(i) {
		const variables = ((this.getNodeParameter('variables', i, {}) as IDataObject).variable as IDataObject[]) ?? [];
		if (!variables.length) throw new NodeOperationError(this.getNode(), 'Add at least one variable', { itemIndex: i });
		return (await argorantRequest.call(this, 'PUT', `${campaignPath(this, i)}/personalization`, {
			body: {
				variables: variables.map((v) => ({
					name: String(v.name ?? '').trim(),
					fallback: String(v.fallback ?? ''),
					instruction: String(v.instruction ?? ''),
					max_length: Number(v.maxLength ?? 150),
				})),
			},
			scope: SCOPE.lists,
		})) as IDataObject;
	},

	async launch(i) {
		return await launchOrResume.call(this, i, 'launch');
	},

	async resume(i) {
		return await launchOrResume.call(this, i, 'resume');
	},

	async pause(i) {
		return campaignOut(
			this,
			i,
			(await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/pause`, { body: {}, scope: SCOPE.lists })) as IDataObject,
		);
	},

	async stop(i) {
		return campaignOut(
			this,
			i,
			(await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/stop`, { body: {}, scope: SCOPE.lists })) as IDataObject,
		);
	},

	async getStats(i) {
		return (await argorantRequest.call(this, 'GET', `${campaignPath(this, i)}/analytics`, {
			qs: { days: this.getNodeParameter('days', i, 30) },
			scope: SCOPE.read,
		})) as IDataObject;
	},

	async sendTestEmail(i) {
		const options = this.getNodeParameter('testOptions', i, {}) as IDataObject;
		const body: IDataObject = {};
		for (const key of ['to', 'sender']) if (String(options[key] ?? '').trim()) body[key] = String(options[key]).trim();
		if (options.step) body.step = Number(options.step);
		return (await argorantRequest.call(this, 'POST', `${campaignPath(this, i)}/test-email`, {
			body,
			scope: SCOPE.lists,
		})) as IDataObject;
	},
};

function leadOptions(ctx: IExecuteFunctions, i: number): IDataObject {
	const options = ctx.getNodeParameter('addLeadsOptions', i, {}) as IDataObject;
	const body: IDataObject = {};
	if (options.excludePrivateEmails !== undefined) body.exclude_private_emails = options.excludePrivateEmails;
	if (options.keepGivenAddress !== undefined) body.keep_given_address = options.keepGivenAddress;
	if (options.restoreRemoved !== undefined) body.restore_removed = options.restoreRemoved;
	return body;
}

/** One lead row from an input item: email, the standard fields and any extra columns. */
export function leadRow(ctx: IExecuteFunctions, i: number): IDataObject | undefined {
	const email = String(ctx.getNodeParameter('leadEmail', i, '')).trim();
	if (!email) return undefined;
	const row: IDataObject = { email };
	const fields = ctx.getNodeParameter('leadFields', i, {}) as IDataObject;
	for (const [key, value] of Object.entries(fields)) {
		if (String(value ?? '').trim()) row[key] = String(value).trim();
	}
	const extra = ((ctx.getNodeParameter('extraColumns', i, {}) as IDataObject).column as IDataObject[]) ?? [];
	for (const column of extra) {
		const key = String(column.name ?? '')
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9_]+/g, '_');
		if (key && column.value !== undefined && String(column.value).trim()) row[key] = String(column.value).trim();
	}
	return row;
}

export const campaignBulk: Record<string, BulkHandler> = {
	async addLeads(items) {
		const out: INodeExecutionData[] = [];
		const groups = new Map<string, number[]>();
		for (let i = 0; i < items.length; i++) {
			const source = this.getNodeParameter('leadSource', i) as string;
			if (source === 'list') {
				out.push({ json: (await campaign.addLeads.call(this, i)) as IDataObject, pairedItem: { item: i } });
				continue;
			}
			const key = `${source}|${campaignId(this, i)}`;
			groups.set(key, [...(groups.get(key) ?? []), i]);
		}
		for (const [key, members] of groups) {
			const [source, id] = key.split('|');
			const size = this.getNodeParameter('batchSize', members[0], 500) as number;
			const base = { grades: VALID_ONLY, ...leadOptions(this, members[0]) };
			const path = `/api/v1/campaigns/${enc(id)}/leads`;
			let payloads: Array<{ body: IDataObject; items: number[] }>;
			if (source === 'recordIds') {
				const ids = collectAcrossItems
					.call(this, items, 'recordIds', (v) => splitList(v))
					.filter((c) => members.includes(c.item));
				if (!ids.length) throw new NodeOperationError(this.getNode(), 'No record IDs given');
				payloads = chunk(ids, size).map((batch) => ({
					body: { ...base, record_ids: batch.map((b) => b.value) },
					items: batch.map((b) => b.item),
				}));
			} else {
				const rows: Array<{ row: IDataObject; item: number }> = [];
				const skipped: number[] = [];
				for (const i of members) {
					const row = leadRow(this, i);
					if (row) rows.push({ row, item: i });
					else skipped.push(i);
				}
				if (skipped.length) {
					out.push({
						json: { skipped: skipped.length, note: 'Items without an email address were left out.' },
						pairedItem: pairedFrom(skipped),
					});
				}
				payloads = chunk(rows, size).map((batch) => ({
					body: { ...base, rows: batch.map((b) => b.row) },
					items: batch.map((b) => b.item),
				}));
			}
			for (const payload of payloads) {
				const answer = (await argorantRequest.call(this, 'POST', path, {
					body: payload.body,
					scope: SCOPE.lists,
				})) as IDataObject;
				out.push({ json: { campaign_id: id, sent: payload.items.length, ...answer }, pairedItem: pairedFrom(payload.items) });
			}
		}
		return out;
	},

	async removeLeads(items) {
		const out: INodeExecutionData[] = [];
		const groups = new Map<string, number[]>();
		for (let i = 0; i < items.length; i++) {
			if ((this.getNodeParameter('removeBy', i) as string) !== 'emails') {
				out.push({ json: (await campaign.removeLeads.call(this, i)) as IDataObject, pairedItem: { item: i } });
				continue;
			}
			const id = campaignId(this, i);
			groups.set(id, [...(groups.get(id) ?? []), i]);
		}
		for (const [id, members] of groups) {
			const emails = collectAcrossItems
				.call(this, items, 'removeEmails', (v) => splitList(v).map((e) => e.toLowerCase()))
				.filter((c) => members.includes(c.item));
			if (!emails.length) throw new NodeOperationError(this.getNode(), 'No email addresses given');
			for (const batch of chunk(emails, 5000)) {
				const answer = (await argorantRequest.call(this, 'POST', `/api/v1/campaigns/${enc(id)}/leads/remove`, {
					body: {
						emails: batch.map((b) => b.value),
						include_contacted: this.getNodeParameter('includeContacted', members[0], true),
						preview: this.getNodeParameter('preview', members[0], false),
					},
					scope: SCOPE.lists,
				})) as IDataObject;
				out.push({ json: { campaign_id: id, ...answer }, pairedItem: pairedFrom(batch.map((b) => b.item)) });
			}
		}
		return out;
	},

	async writePersonalLines(items) {
		const out: INodeExecutionData[] = [];
		const groups = new Map<string, Array<{ lead: IDataObject; item: number }>>();
		for (let i = 0; i < items.length; i++) {
			const email = String(this.getNodeParameter('lineEmail', i, '')).trim();
			const lines = ((this.getNodeParameter('lines', i, {}) as IDataObject).line as IDataObject[]) ?? [];
			const values: IDataObject = {};
			for (const line of lines) {
				let name = String(line.variable ?? '')
					.trim()
					.replace(/^\{\{\s*|\s*\}\}$/g, '');
				if (!name) continue;
				if (!name.startsWith('custom_')) name = `custom_${name}`;
				values[name] = String(line.text ?? '');
			}
			if (!email || !Object.keys(values).length) continue;
			const id = campaignId(this, i);
			groups.set(id, [...(groups.get(id) ?? []), { lead: { email, values }, item: i }]);
		}
		if (!groups.size) {
			throw new NodeOperationError(this.getNode(), 'No lines to write', {
				description: 'Each item needs an email address and at least one line with a variable name.',
			});
		}
		for (const [id, leads] of groups) {
			const overwrite = this.getNodeParameter('overwrite', leads[0].item, false);
			for (const batch of chunk(leads, 1000)) {
				const answer = (await argorantRequest.call(this, 'PATCH', `/api/v1/campaigns/${enc(id)}/leads/custom-fields`, {
					body: { leads: batch.map((b) => b.lead), overwrite },
					scope: SCOPE.lists,
				})) as IDataObject;
				out.push({ json: { campaign_id: id, ...answer }, pairedItem: pairedFrom(batch.map((b) => b.item)) });
			}
		}
		return out;
	},
};
