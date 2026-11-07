import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export const ARGORANT_BASE_URL = 'https://app.argorant.com';

export async function argorantApiRequest(
	this: ILoadOptionsFunctions | IExecuteSingleFunctions,
	method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
) {
	const options: IHttpRequestOptions = {
		method,
		url: `${ARGORANT_BASE_URL}${path}`,
		qs,
		body,
		json: true,
	};
	return this.helpers.httpRequestWithAuthentication.call(this, 'argorantApi', options);
}
