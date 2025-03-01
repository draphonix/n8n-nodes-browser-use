import type { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeApiError, NodeOperationError } from 'n8n-workflow';

export class BrowserUse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Browser Use',
		name: 'browserUse',
		icon: 'file:icons/browseruse.svg',
		group: ['transform'],
		version: 1,
		description: 'Automate browser interactions using AI',
		// @ts-ignore - Adding usableAsTool property for n8n versions that support Nodes-as-Tools
		usableAsTool: true,
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
						description: 'Retrieve detailed information about a specific browser automation task',
						action: 'Retrieve detailed information about a specific browser automation task',
					},
					{
						name: 'Get Task Media',
						value: 'getTaskMedia',
						description: 'Retrieve media (screenshot, video, or PDF) captured during a browser task',
						action: 'Retrieve media screenshot video or pdf captured during a browser task',
					},
					{
						name: 'Get Task Status',
						value: 'getTaskStatus',
						description: 'Check the current status of a running or completed browser task',
						action: 'Check the current status of a running or completed browser task',
					},
					{
						name: 'List Tasks',
						value: 'listTasks',
						description: 'List all browser automation tasks with pagination support',
						action: 'List all browser automation tasks with pagination support',
					},
					{
						name: 'Pause Task',
						value: 'pauseTask',
						description: 'Temporarily pause a running browser automation task',
						action: 'Temporarily pause a running browser automation task',
					},
					{
						name: 'Resume Task',
						value: 'resumeTask',
						description: 'Resume a previously paused browser automation task',
						action: 'Resume a previously paused browser automation task',
					},
					{
						name: 'Run Task',
						value: 'runTask',
						description: 'Execute a new browser automation task with natural language instructions',
						action: 'Execute a new browser automation task with natural language instructions',
					},
					{
						name: 'Stop Task',
						value: 'stopTask',
						description: 'Completely stop and terminate a browser automation task',
						action: 'Completely stop and terminate a browser automation task',
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
				description: 'Natural language instructions for the browser to follow. For example: "Go to amazon.com, search for wireless headphones, and extract the prices and ratings of the first 5 results". You can use $fromAI() to dynamically populate this field from AI Agent input.',
				required: true,
				hint: 'The browser will follow these instructions autonomously, performing actions like navigating, clicking, typing, and data extraction.',
			},
			
			// AI Provider (for Local Bridge runTask)
			{
				displayName: 'AI Provider',
				name: 'aiProvider',
				type: 'options',
				options: [
					{ name: 'Anthropic', value: 'anthropic', description: 'Use Anthropic models like Claude' },
					{ name: 'Azure OpenAI', value: 'azure', description: 'Use Azure-hosted OpenAI models' },
					{ name: 'Google', value: 'google', description: 'Use Google Gemini models' },
					{ name: 'Mistral', value: 'mistral', description: 'Use Mistral AI models' },
					{ name: 'Ollama', value: 'ollama', description: 'Use locally-hosted Ollama models' },
					{ name: 'OpenAI', value: 'openai', description: 'Use OpenAI models like GPT-4o' },
				],
				default: 'openai',
				description: 'The AI provider to use for processing browser instructions',
				displayOptions: {
					show: {
						operation: ['runTask'],
						connectionType: ['local'],
					},
				},
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
						connectionType: ['cloud'],
					},
				},
				description: 'Whether to save browser cookies and session data for future tasks. Useful for maintaining login sessions across multiple tasks.',
			},
			
			// Headful mode (for runTask)
			{
				displayName: 'Headful Mode',
				name: 'headful',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['runTask'],
						connectionType: ['local'],
					},
				},
				description: 'Whether to run the browser in visible (headful) mode. When enabled, you will see the browser window as it performs actions.',
			},
			
			// Use Custom Chrome (for runTask)
			{
				displayName: 'Use Custom Chrome',
				name: 'useCustomChrome',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['runTask'],
						connectionType: ['local'],
					},
				},
				description: 'Whether to use a custom Chrome installation specified in environment variables. Disable if you want to use the default system Chrome.',
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
				description: 'The unique identifier of the browser task to interact with',
				required: true,
			},
			
			// Media Type (for getTaskMedia)
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'Screenshot', value: 'screenshot', description: 'A static image of the current browser view' },
					{ name: 'Video', value: 'video', description: 'A video recording of the browser automation session' },
					{ name: 'PDF', value: 'pdf', description: 'A PDF export of the current page' },
				],
				default: 'screenshot',
				displayOptions: {
					show: {
						operation: ['getTaskMedia'],
					},
				},
				description: 'The type of media to retrieve from the browser task',
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
						
						// Handle save browser data based on connection type
						let saveBrowserData = false;
						if (connectionType === 'cloud') {
							saveBrowserData = this.getNodeParameter('saveBrowserData', i) as boolean;
						}
						
						// Create request body
						const body: {
							task: string;
							save_browser_data?: boolean;
							ai_provider?: string;
							headful?: boolean;
							use_custom_chrome?: boolean;
						} = {
							task: instructions,
						};
						
						// Add save_browser_data only for cloud API
						if (connectionType === 'cloud') {
							body.save_browser_data = saveBrowserData;
						} else {
							// For local bridge, add ai_provider and the new parameters
							const aiProvider = this.getNodeParameter('aiProvider', i) as string;
							body.ai_provider = aiProvider;
							
							// Add the new headful and use_custom_chrome parameters
							body.headful = this.getNodeParameter('headful', i) as boolean;
							body.use_custom_chrome = this.getNodeParameter('useCustomChrome', i) as boolean;
						}

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
							body,
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