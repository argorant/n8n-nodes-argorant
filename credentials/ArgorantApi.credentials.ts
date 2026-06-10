import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ArgorantApi implements ICredentialType {
	name = 'argorantApi';

	displayName = 'Argorant API';

	documentationUrl = 'https://argorant.com/docs/integrations/n8n';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Create a key at app.argorant.com/profile → API keys. Keys start with ag_live_.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://argorant.com/api',
			url: '/mcp/account',
		},
	};
}
