![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-browser-use

This is an n8n community node that integrates with [Browser Use](https://browser-use.com), an AI-powered browser automation tool. This node allows you to create and manage browser automation tasks using natural language instructions.

## Features

- **Cloud API Integration**: Connect to the Browser Use Cloud API for the simplest setup.
- **Local Bridge Option**: Connect to a locally running Browser Use instance (requires additional setup).
- **Multiple AI Providers**: Choose between different AI models for browser automation.
- **Full Task Management**: Create, monitor, stop, and retrieve media from browser automation tasks.

## Installation

Follow these steps to install this node:

### In n8n Desktop or Cloud:

1. Go to **Settings > Community Nodes**
2. Click on **Install**
3. Enter `n8n-nodes-browser-use` in the **Name** field
4. Click **Install**

### In a self-hosted n8n instance:

```bash
npm install n8n-nodes-browser-use
```

### For local development:

1. Clone this repository
2. Install dependencies: `npm install` 
3. Build the code: `npm run build`
4. Link to your n8n installation: `npm link`
5. In your n8n installation directory: `npm link n8n-nodes-browser-use`

## Usage

### Cloud API Connection

1. Create credentials for the Browser Use Cloud API:
   - Get your API key from [Browser Use Cloud](https://cloud.browser-use.com/billing)
   - Create a new credential of type "Browser Use Cloud API"
   - Enter your API key

2. Add the Browser Use node to your workflow
3. Select "Cloud API" as the connection type
4. Choose your operation (Run Task, Get Task Status, etc.)
5. Configure the operation parameters (instructions, task ID, etc.)

### Local Bridge Connection

Before using the Local Bridge connection, you need to set up the Python bridge service:

1. Clone the repository for the bridge service (coming soon)
2. Install the required dependencies
3. Run the bridge service

Then, in n8n:

1. Create credentials for the Browser Use Local Bridge:
   - Enter the URL of your local bridge service (e.g., `http://localhost:8000`)
   - If authentication is enabled, enter your authentication token

2. Add the Browser Use node to your workflow
3. Select "Local Bridge" as the connection type
4. Follow the same steps as for the Cloud API connection

## Operations

### Run Task

Execute a new browser automation task with natural language instructions.

**Parameters:**
- **Instructions**: Natural language description of what you want the browser to do.
- **AI Provider**: Select the AI model to use for automation (OpenAI, Anthropic, or Default).

**Returns:** Task ID, status, and a live preview URL.

### Get Task Status

Check the status of a running task.

**Parameters:**
- **Task ID**: The ID of the task to check.

**Returns:** Current status, completion percentage, and any error messages.

### Stop Task

Stop a running task.

**Parameters:**
- **Task ID**: The ID of the task to stop.

**Returns:** Confirmation of task termination.

### Get Task Media

Retrieve media (screenshots, video, PDF) from a task.

**Parameters:**
- **Task ID**: The ID of the task.
- **Media Type**: Type of media to retrieve (Screenshot, Video, or PDF).

**Returns:** URL or binary data of the requested media.

## Credential Validation

The node implements automatic validation for credentials:

### Cloud API Credentials
- The node validates your API key by sending a ping request to the Browser Use Cloud API
- If the API key is invalid or the service is unavailable, you'll receive a clear error message

### Local Bridge Credentials
- The node verifies the connection to your local bridge service with a ping request
- It validates both the URL and authentication token (if provided)
- Errors during validation provide specific information about what went wrong

This validation happens automatically when:
1. You save your credentials in the n8n credentials manager
2. You run a workflow using the Browser Use node

## Example Workflows

### Web Scraping

1. Trigger (Manual, Schedule, etc.)
2. Browser Use node:
   - Operation: Run Task
   - Instructions: "Go to example.com, click on the 'Products' link, and extract all product names and prices"

3. Wait node (optional)
4. Browser Use node:
   - Operation: Get Task Status
   - Task ID: Output from Step 2

5. If node: Check if task is complete
6. Process the scraped data

### Form Automation

1. Trigger (HTTP, Webhook, etc.)
2. Browser Use node:
   - Operation: Run Task
   - Instructions: "Go to example.com/contact, fill out the form with Name: {{$json.name}}, Email: {{$json.email}}, Message: {{$json.message}}, and submit the form"

3. Wait node
4. Browser Use node:
   - Operation: Get Task Media
   - Task ID: Output from Step 2
   - Media Type: Screenshot

5. Send Email node with the screenshot attached

## Resources

- [Browser Use Documentation](https://docs.browser-use.com)
- [Browser Use Cloud API Documentation](https://docs.browser-use.com/cloud/quickstart)
- [n8n Documentation](https://docs.n8n.io)

## License

[MIT](LICENSE.md)
