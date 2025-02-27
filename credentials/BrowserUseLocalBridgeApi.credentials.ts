import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BrowserUseLocalBridgeApi implements ICredentialType {
	name = 'browserUseLocalBridgeApi';
	displayName = 'Browser Use Local Bridge API';
	documentationUrl = 'https://github.com/yourusername/n8n-nodes-browser-use';
	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: 'http://localhost:8000',
			required: true,
			description: 'URL of the local Bridge service',
		},
		{
			displayName: 'Authentication Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'Token for authenticating with the local Bridge service (if enabled)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.token ? `Bearer ${$credentials.token}` : undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v1/ping',
			method: 'GET',
		},
	};
} 