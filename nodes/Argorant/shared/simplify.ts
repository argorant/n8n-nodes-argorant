import type { IDataObject } from 'n8n-workflow';

/** Keeps the named keys that have a value, in that order. */
function pick(source: IDataObject | undefined, keys: string[]): IDataObject {
	const out: IDataObject = {};
	if (!source) return out;
	for (const key of keys) {
		const value = source[key];
		if (value !== undefined) out[key] = value;
	}
	return out;
}

const join = (value: unknown): string => (Array.isArray(value) ? value.join(', ') : String(value ?? ''));

export function simplifyPerson(p: IDataObject): IDataObject {
	const out = pick(p, [
		'record_id',
		'full_name',
		'first_name',
		'last_name',
		'preview',
		'email',
		'email_status',
		'title',
		'seniority',
		'company',
		'company_domain',
		'industry',
		'city',
		'state',
		'country',
		'linkedin_url',
		'phone',
		'email_unlocked',
	]);
	if (p.departments !== undefined) out.departments = join(p.departments);
	return out;
}

export function simplifyCompany(c: IDataObject): IDataObject {
	return pick(c, [
		'record_id',
		'company_name',
		'display_name',
		'company_domain',
		'industry',
		'employee_range',
		'employee_count',
		'company_revenue',
		'year_founded',
		'city',
		'state',
		'country',
		'description',
		'linkedin_url',
		'full_profile',
	]);
}

export function simplifyList(l: IDataObject): IDataObject {
	const out = pick(l, ['list_id', 'name', 'selection_mode', 'item_count', 'snapshot_total', 'created_at', 'updated_at']);
	out.url = `https://app.argorant.com/lists/${l.list_id}`;
	return out;
}

export function simplifyCampaign(c: IDataObject): IDataObject {
	return pick(c, [
		'id',
		'name',
		'status',
		'lead_count',
		'sent_count',
		'replied_count',
		'positive_reply_count',
		'bounced_count',
		'reply_rate',
		'step_count',
		'inbox_count',
		'daily_limit',
		'default_timezone',
		'tags',
		'created_at',
		'url',
	]);
}

export function simplifyCampaignLead(l: IDataObject): IDataObject {
	return pick(l, [
		'id',
		'email',
		'first_name',
		'last_name',
		'company',
		'title',
		'status',
		'email_grade',
		'current_step',
		'next_send_at',
		'last_sent_at',
		'replied_at',
		'added_at',
	]);
}

export function simplifyReply(r: IDataObject): IDataObject {
	return pick(r, [
		'id',
		'event_type',
		'classification',
		'campaign_id',
		'campaign_name',
		'from_email',
		'lead_name',
		'company',
		'inbox_email',
		'subject',
		'body',
		'created_at',
	]);
}

export function simplifyMailbox(m: IDataObject): IDataObject {
	const out = pick(m, [
		'email',
		'name',
		'provider',
		'domain',
		'status',
		'status_label',
		'daily_limit',
		'sent_today',
		'needs_attention',
	]);
	if (m.tags !== undefined) out.tags = join(m.tags);
	const warmup = m.warmup as IDataObject | boolean | undefined;
	if (warmup !== undefined) out.warmup = typeof warmup === 'object' ? Boolean(warmup?.on) : warmup;
	return out;
}

export function simplifyExport(e: IDataObject): IDataObject {
	return pick(e, [
		'job_id',
		'name',
		'status',
		'progress_pct',
		'total_rows',
		'verified_rows',
		'credits_charged',
		'downloadable',
		'download_url',
		'created_at',
		'completed_at',
	]);
}
