"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgorantTrigger = void 0;
const API_BASE = 'https://argorant.com/api';
class ArgorantTrigger {
    constructor() {
        this.description = {
            displayName: 'Argorant Trigger',
            name: 'argorantTrigger',
            icon: 'file:argorant.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["events"].join(", ")}}',
            description: 'Fires on Argorant account events: export ready, verification completed, new segment matches',
            defaults: { name: 'Argorant Trigger' },
            inputs: [],
            outputs: ['main'],
            credentials: [{ name: 'argorantApi', required: true }],
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
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    default: ['export.ready'],
                    options: [
                        {
                            name: 'Export Ready',
                            value: 'export.ready',
                            description: 'A verified export finished building and is downloadable',
                        },
                        {
                            name: 'Verification Completed',
                            value: 'verification.completed',
                            description: 'A single-email verification finished',
                        },
                        {
                            name: 'Segment New Matches',
                            value: 'segment.new_matches',
                            description: 'A saved filtered list gained new matching records',
                        },
                    ],
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (!webhookData.webhookId)
                        return false;
                    try {
                        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'argorantApi', { method: 'GET', url: `${API_BASE}/mcp/webhooks`, json: true }));
                        const hooks = response.webhooks || [];
                        return hooks.some((h) => String(h.id) === String(webhookData.webhookId));
                    }
                    catch {
                        return false;
                    }
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const events = this.getNodeParameter('events');
                    const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'argorantApi', {
                        method: 'POST',
                        url: `${API_BASE}/mcp/webhooks`,
                        body: { url: webhookUrl, events },
                        json: true,
                    }));
                    const webhookData = this.getWorkflowStaticData('node');
                    webhookData.webhookId = response.id;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId) {
                        try {
                            await this.helpers.httpRequestWithAuthentication.call(this, 'argorantApi', {
                                method: 'DELETE',
                                url: `${API_BASE}/mcp/webhooks/${webhookData.webhookId}`,
                                json: true,
                            });
                        }
                        catch {
                            // Subscription already removed server-side; clear local state regardless.
                        }
                        delete webhookData.webhookId;
                    }
                    return true;
                },
            },
        };
    }
    async webhook() {
        const body = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(body)],
        };
    }
}
exports.ArgorantTrigger = ArgorantTrigger;
