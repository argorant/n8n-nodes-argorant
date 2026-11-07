import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ArgorantApi implements ICredentialType {
	name = 'argorantApi';

	displayName = 'Argorant API';

	icon: Icon = { light: 'file:../icons/argorant.svg', dark: 'file:../icons/argorant.dark.svg' };

	documentationUrl = 'https://github.com/argorant/n8n-nodes-argorant?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'ag_live_...',
			description:
				'Your Argorant API key. Create one in the Argorant app under Profile, API keys.',
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
			baseURL: 'https://app.argorant.com',
			url: '/api/v1/me',
			method: 'GET',
		},
	};
}
