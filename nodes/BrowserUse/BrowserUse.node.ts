import type { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class BrowserUse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Browser Use',
		name: 'browserUse',
		icon: 'file:browseruse.svg',
		group: ['transform'],
		version: 1,
		description: 'Automate browser interactions using AI',
		defaults: {
			name: 'Browser Use',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'browserUseCloudApi',
				required: true,
				displayOptions: {
					show: {
						connectionType: ['cloud'],
					},
				},
			},
			{
				name: 'browserUseLocalBridgeApi',
				required: true,
				displayOptions: {
					show: {
						connectionType: ['local'],
					},
				},
			},
		],
		properties: [
			// Connection Type selector
			{
				displayName: 'Connection Type',
				name: 'connectionType',
				type: 'options',
				options: [
					{
						name: 'Cloud API',
						value: 'cloud',
						description: 'Connect to Browser Use Cloud API (simplest setup)',
					},
					{
						name: 'Local Bridge',
						value: 'local',
						description: 'Connect to locally running Browser Use bridge (requires additional setup)',
					},
				],
				default: 'cloud',
				description: 'Choose how to connect to Browser Use',
			},
			
			// Local Bridge Notice
			{
				displayName: 'Local Bridge Setup Required',
				name: 'localBridgeNotice',
				type: 'notice',
				default: 'The Local Bridge option requires setting up a Python service separately. Please refer to the documentation for installation instructions.',
				displayOptions: {
					show: {
						connectionType: ['local'],
					},
				},
			},
			
			// Operation selector
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Run Task',
						value: 'runTask',
					},
					{
						name: 'Get Task Status',
						value: 'getTaskStatus',
					},
					{
						name: 'Stop Task',
						value: 'stopTask',
					},
					{
						name: 'Get Task Media',
						value: 'getTaskMedia',
					},
				],
				default: 'runTask',
			},
			
			// AI Provider selection (for runTask)
			{
				displayName: 'AI Provider',
				name: 'aiProvider',
				type: 'options',
				options: [
					{ name: 'OpenAI', value: 'openai' },
					{ name: 'Anthropic', value: 'anthropic' },
					{ name: 'Default', value: 'default' },
				],
				default: 'default',
				displayOptions: {
					show: {
						operation: ['runTask'],
					},
				},
			},
			
			// Task instruction (for runTask)
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				placeholder: 'e.g., Go to google.com and search for "n8n automation"',
				displayOptions: {
					show: {
						operation: ['runTask'],
					},
				},
				description: 'Natural language instructions for the browser automation',
				required: true,
			},
			
			// Task ID (for getTaskStatus, stopTask, and getTaskMedia)
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getTaskStatus', 'stopTask', 'getTaskMedia'],
					},
				},
				description: 'ID of the task to check, stop, or get media from',
				required: true,
			},
			
			// Media Type (for getTaskMedia)
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'Screenshot', value: 'screenshot' },
					{ name: 'Video', value: 'video' },
					{ name: 'PDF', value: 'pdf' },
				],
				default: 'screenshot',
				displayOptions: {
					show: {
						operation: ['getTaskMedia'],
					},
				},
				description: 'Type of media to retrieve from the task',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const connectionType = this.getNodeParameter('connectionType', 0) as string;
		
		// Get the appropriate credentials based on connection type
		let credentials;
		let baseUrl;
		
		if (connectionType === 'cloud') {
			credentials = await this.getCredentials('browserUseCloudApi');
			baseUrl = 'https://api.browser-use.com/api/v1';
		} else {
			credentials = await this.getCredentials('browserUseLocalBridgeApi');
			baseUrl = credentials.url as string;
			if (!baseUrl.endsWith('/api/v1')) {
				baseUrl = `${baseUrl}/api/v1`.replace(/\/+/g, '/');
			}
		}

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'runTask') {
					const instructions = this.getNodeParameter('instructions', i) as string;
					const aiProvider = this.getNodeParameter('aiProvider', i) as string;

					// Make API call to Browser Use (Cloud or Local)
					const response = await this.helpers.request({
						method: 'POST',
						url: `${baseUrl}/run-task`,
						headers: {
							'Authorization': connectionType === 'cloud' 
								? `Bearer ${credentials.apiKey}` 
								: credentials.token ? `Bearer ${credentials.token}` : undefined,
							'Content-Type': 'application/json',
						},
						body: {
							task: instructions,
							ai_provider: aiProvider !== 'default' ? aiProvider : undefined,
						},
						json: true,
					});

					returnData.push({
						json: response,
					});
				} else if (operation === 'getTaskStatus') {
					const taskId = this.getNodeParameter('taskId', i) as string;
					
					const response = await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/task/${taskId}/status`,
						headers: {
							'Authorization': connectionType === 'cloud' 
								? `Bearer ${credentials.apiKey}` 
								: credentials.token ? `Bearer ${credentials.token}` : undefined,
						},
						json: true,
					});
					
					returnData.push({
						json: response,
					});
				} else if (operation === 'stopTask') {
					const taskId = this.getNodeParameter('taskId', i) as string;
					
					const response = await this.helpers.request({
						method: 'PUT',
						url: `${baseUrl}/stop-task/${taskId}`,
						headers: {
							'Authorization': connectionType === 'cloud' 
								? `Bearer ${credentials.apiKey}` 
								: credentials.token ? `Bearer ${credentials.token}` : undefined,
						},
						json: true,
					});
					
					returnData.push({
						json: response,
					});
				} else if (operation === 'getTaskMedia') {
					const taskId = this.getNodeParameter('taskId', i) as string;
					const mediaType = this.getNodeParameter('mediaType', i) as string;
					
					const response = await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/task/${taskId}/media?type=${mediaType}`,
						headers: {
							'Authorization': connectionType === 'cloud' 
								? `Bearer ${credentials.apiKey}` 
								: credentials.token ? `Bearer ${credentials.token}` : undefined,
						},
						json: true,
					});
					
					returnData.push({
						json: response,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 