import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

const UUID = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

export function listLocator(
	name: string,
	displayName: string,
	description: string,
	searchListMethod: 'searchLists' | 'searchSavedSearches' = 'searchLists',
): INodeProperties {
	return {
		displayName,
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a list...',
				typeOptions: { searchListMethod, searchable: true },
			},
			{
				displayName: 'By URL',
				name: 'url',
				type: 'string',
				placeholder: 'e.g. https://app.argorant.com/lists/312',
				extractValue: { type: 'regex', regex: 'argorant\\.com\\/lists\\/(\\d+)' },
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '.*argorant\\.com\\/lists\\/\\d+.*',
							errorMessage: 'Not an Argorant list URL',
						},
					},
				],
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 312',
				validation: [
					{ type: 'regex', properties: { regex: '^[0-9]+$', errorMessage: 'A list ID is a number' } },
				],
			},
		],
	};
}

export function campaignLocator(name = 'campaignId', description = 'The campaign'): INodeProperties {
	return {
		displayName: 'Campaign',
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a campaign...',
				typeOptions: { searchListMethod: 'searchCampaigns', searchable: true },
			},
			{
				displayName: 'By URL',
				name: 'url',
				type: 'string',
				placeholder: 'e.g. https://app.argorant.com/campaigns/7f3a2c1e-9b4d-4e8a-a1c2-5d6e7f8a9b0c',
				extractValue: { type: 'regex', regex: `argorant\\.com\\/campaigns\\/(${UUID})` },
				validation: [
					{
						type: 'regex',
						properties: {
							regex: `.*argorant\\.com\\/campaigns\\/${UUID}.*`,
							errorMessage: 'Not an Argorant campaign URL',
						},
					},
				],
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 7f3a2c1e-9b4d-4e8a-a1c2-5d6e7f8a9b0c',
			},
		],
	};
}

export function mailboxLocator(name = 'mailbox'): INodeProperties {
	return {
		displayName: 'Mailbox',
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'A sending mailbox connected to Argorant',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a mailbox...',
				typeOptions: { searchListMethod: 'searchMailboxes', searchable: true },
			},
			{
				displayName: 'By Address',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. alex.rivera@yourcompany.example',
				validation: [
					{ type: 'regex', properties: { regex: '^[^@\\s]+@[^@\\s]+$', errorMessage: 'Not an email address' } },
				],
			},
		],
	};
}

/** The plain value of a resource locator parameter (n8n already applied the URL regex). */
export function locatorValue(this: IExecuteFunctions, name: string, itemIndex: number): string {
	const value = this.getNodeParameter(name, itemIndex, '', { extractValue: true }) as string | IDataObject;
	if (value && typeof value === 'object') return String((value as IDataObject).value ?? '').trim();
	return String(value ?? '').trim();
}
