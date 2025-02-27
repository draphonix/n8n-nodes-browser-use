import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BrowserUseCloudApi implements ICredentialType {
	name = 'browserUseCloudApi';
	displayName = 'Browser Use Cloud API';
	documentationUrl = 'https://docs.browser-use.com/cloud/quickstart';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from Browser Use Cloud',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{`Bearer ${$credentials.apiKey}`}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.browser-use.com/api/v1',
			url: '/ping',
			method: 'GET',
		},
	};
} 