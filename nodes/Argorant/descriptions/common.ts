import type { INodeProperties } from 'n8n-workflow';

export type Show = Record<string, string[]>;

export const showFor = (resource: string, operation: string[]): Show => ({
	resource: [resource],
	operation,
});

/** A grey note above the fields: what the operation costs or sends. */
export function notice(name: string, text: string, show: Show): INodeProperties {
	return { displayName: text, name, type: 'notice', default: '', displayOptions: { show } };
}

export function returnAllAndLimit(show: Show, maxLimit = 500): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: { show },
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			typeOptions: { minValue: 1, maxValue: maxLimit },
			default: 50,
			description: 'Max number of results to return',
			displayOptions: { show: { ...show, returnAll: [false] } },
		},
	];
}

export function simplifyField(show: Show): INodeProperties {
	return {
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description:
			'Whether to return a flat version of each result with the most used fields instead of the raw answer',
		displayOptions: { show },
	};
}

export function confirmField(name: string, displayName: string, description: string, show: Show): INodeProperties {
	return {
		displayName,
		name,
		type: 'boolean',
		default: false,
		description,
		displayOptions: { show },
	};
}
