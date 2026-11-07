import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { campaign, campaignBulk } from './campaigns';
import type { BulkHandler, ItemHandler } from './helpers';
import { isExecutionData } from './helpers';
import { blocklist, mailbox, reply } from './inbox';
import { exportJob, list, listBulk } from './lists';
import { account, company, email, lead, leadBulk } from './prospecting';

const HANDLERS: Record<string, Record<string, ItemHandler>> = {
	account,
	blocklist,
	campaign,
	company,
	email,
	export: exportJob,
	lead,
	list,
	mailbox,
	reply,
};

/** Operations that combine all input items and send them in batches. */
const BULK: Record<string, Record<string, BulkHandler>> = {
	campaign: campaignBulk,
	lead: leadBulk,
	list: listBulk,
};

export async function route(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	const bulk = BULK[resource]?.[operation];
	if (bulk) {
		try {
			return [await bulk.call(this, items)];
		} catch (caught) {
			const error = asNodeError(this, caught);
			if (this.continueOnFail()) {
				return [
					items.map((_, item) => ({
						json: { error: error.message },
						pairedItem: { item },
					})),
				];
			}
			throw error;
		}
	}

	const handler = HANDLERS[resource]?.[operation];
	if (!handler) {
		throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known for "${resource}"`);
	}
	const out: INodeExecutionData[] = [];
	for (let i = 0; i < items.length; i++) {
		try {
			const result = await handler.call(this, i);
			if (isExecutionData(result)) {
				for (const entry of result) out.push({ ...entry, pairedItem: { item: i } });
				continue;
			}
			const rows = Array.isArray(result) ? result : [result];
			for (const json of rows as IDataObject[]) out.push({ json, pairedItem: { item: i } });
		} catch (caught) {
			const error = asNodeError(this, caught, i);
			if (this.continueOnFail()) {
				out.push({ json: { error: error.message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
	}
	return [out];
}

/** API errors keep their message and fix; anything else becomes a NodeOperationError. Adds the failing item. */
function asNodeError(
	ctx: IExecuteFunctions,
	caught: unknown,
	itemIndex?: number,
): NodeApiError | NodeOperationError {
	if (caught instanceof NodeApiError || caught instanceof NodeOperationError) {
		if (itemIndex !== undefined) {
			caught.context = { ...(caught.context ?? {}), itemIndex } as IDataObject;
		}
		return caught;
	}
	return new NodeOperationError(ctx.getNode(), caught as Error, itemIndex !== undefined ? { itemIndex } : {});
}
