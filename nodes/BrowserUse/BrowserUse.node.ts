import type { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeApiError, NodeOperationError } from 'n8n-workflow';

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
						name: 'Get Task',
						value: 'getTask',
					},
					{
						name: 'Get Task Media',
						value: 'getTaskMedia',
					},
					{
						name: 'Get Task Status',
						value: 'getTaskStatus',
					},
					{
						name: 'List Tasks',
						value: 'listTasks',
					},
					{
						name: 'Pause Task',
						value: 'pauseTask',
					},
					{
						name: 'Resume Task',
						value: 'resumeTask',
					},
					{
						name: 'Run Task',
						value: 'runTask',
					},
					{
						name: 'Stop Task',
						value: 'stopTask',
					},
				],
				default: 'runTask',
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
			
			// Save Browser Data (for runTask)
			{
				displayName: 'Save Browser Data',
				name: 'saveBrowserData',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['runTask'],
					},
				},
				description: 'Whether to save browser cookies and other data. Cookies are safely encrypted before storing in the database.',
			},
			
			// Task ID (for getTaskStatus, stopTask, and getTaskMedia)
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getTaskStatus', 'stopTask', 'getTaskMedia', 'getTask', 'pauseTask', 'resumeTask'],
					},
				},
				description: 'ID of the task to interact with',
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
			
			// List Tasks Limit
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						operation: ['listTasks'],
					},
				},
				description: 'Max number of results to return',
			}
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
		
		try {
			if (connectionType === 'cloud') {
				credentials = await this.getCredentials('browserUseCloudApi');
				
				if (!credentials.apiKey) {
					throw new NodeOperationError(this.getNode(), 'API Key is required for Browser Use Cloud API');
				}
				
				baseUrl = 'https://api.browser-use.com/api/v1';
				
				// Validate credentials by making a test ping request
				try {
					await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/ping`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					});
				} catch (error) {
					throw new NodeApiError(this.getNode(), error, { message: `Failed to connect to Browser Use Cloud API: ${error.message}` });
				}
			} else {
				credentials = await this.getCredentials('browserUseLocalBridgeApi');
				
				if (!credentials.url) {
					throw new NodeOperationError(this.getNode(), 'URL is required for Browser Use Local Bridge');
				}
				
				baseUrl = credentials.url as string;
				if (!baseUrl.endsWith('/api/v1')) {
					baseUrl = `${baseUrl}/api/v1`.replace(/\/+/g, '/');
				}
				
				// Validate credentials by making a test ping request
				try {
					await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/ping`,
						headers: {
							'Authorization': credentials.token ? `Bearer ${credentials.token}` : undefined,
						},
						json: true,
					});
				} catch (error) {
					throw new NodeApiError(this.getNode(), error, { message: `Failed to connect to Browser Use Local Bridge at ${baseUrl}: ${error.message}` });
				}
			}
			
			for (let i = 0; i < items.length; i++) {
				try {
					if (operation === 'runTask') {
						const instructions = this.getNodeParameter('instructions', i) as string;
						const saveBrowserData = this.getNodeParameter('saveBrowserData', i) as boolean;

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
								save_browser_data: saveBrowserData,
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
					} else if (operation === 'getTask') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						
						const response = await this.helpers.request({
							method: 'GET',
							url: `${baseUrl}/task/${taskId}`,
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
					} else if (operation === 'pauseTask') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						
						const response = await this.helpers.request({
							method: 'PUT',
							url: `${baseUrl}/pause-task/${taskId}`,
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
					} else if (operation === 'resumeTask') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						
						const response = await this.helpers.request({
							method: 'PUT',
							url: `${baseUrl}/resume-task/${taskId}`,
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
					} else if (operation === 'listTasks') {
						const limit = this.getNodeParameter('limit', i) as number;
						
						// Build query parameters
						let queryString = `limit=${limit}`;
						
						const response = await this.helpers.request({
							method: 'GET',
							url: `${baseUrl}/tasks?${queryString}`,
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
		} catch (error) {
			if (this.continueOnFail()) {
				return [[{ json: { error: error.message } }]];
			}
			throw error;
		}

		return [returnData];
	}
} 