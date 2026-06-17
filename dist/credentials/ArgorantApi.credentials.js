"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgorantApi = void 0;
class ArgorantApi {
    constructor() {
        this.name = 'argorantApi';
        this.displayName = 'Argorant API';
        this.documentationUrl = 'https://argorant.com/docs/integrations/n8n';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Create a key at app.argorant.com/profile → API keys. Keys start with ag_live_.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://argorant.com/api',
                url: '/mcp/account',
            },
        };
    }
}
exports.ArgorantApi = ArgorantApi;
