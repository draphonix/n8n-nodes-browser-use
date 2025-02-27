![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-browser-use

This is an n8n community node. It lets you use [Browser Use](https://browser-use.com) in your n8n workflows.

Browser Use is an AI-powered browser automation tool that allows you to create and manage browser automation tasks using natural language instructions.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

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

## Operations

### Run Task

Execute a new browser automation task with natural language instructions.

**Parameters:**
- **Instructions**: Natural language description of what you want the browser to do.
- **Save Browser Data**: Whether to save browser cookies and other data (safely encrypted).

**Returns:** Task ID, status, and a live preview URL.

### Get Task

Retrieve full details of a specific task.

**Parameters:**
- **Task ID**: The ID of the task to retrieve.

**Returns:** Complete task information including status, instructions, and timestamps.

### Get Task Status

Check the status of a running task.

**Parameters:**
- **Task ID**: The ID of the task to check.

**Returns:** Current status, completion percentage, and any error messages.

### Pause Task

Temporarily pause a running task.

**Parameters:**
- **Task ID**: The ID of the task to pause.

**Returns:** Confirmation of task being paused.

### Resume Task

Resume a previously paused task.

**Parameters:**
- **Task ID**: The ID of the task to resume.

**Returns:** Confirmation of task resumption.

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

### List Tasks

Retrieve a list of tasks with optional filtering.

**Parameters:**
- **Limit**: Maximum number of tasks to return (1-100, default 20).
- **Status Filter**: Filter tasks by their status (optional).

**Returns:** Array of task records matching the criteria.

## Credentials

### Browser Use Cloud API

To use the Browser Use Cloud API, you need to obtain an API key:

1. Sign up for Browser Use at [Browser Use Cloud](https://cloud.browser-use.com)
2. Navigate to the billing section to find your API key
3. Create a new credential of type "Browser Use Cloud API" in n8n
4. Enter your API key in the credential configuration

The node automatically validates your API key by sending a ping request to the Browser Use Cloud API. If the API key is invalid or the service is unavailable, you'll receive a clear error message.

### Browser Use Local Bridge API (🚧 Work In Progress)

⚠️ **Note: The Local Bridge feature is currently under development and may not be fully functional.**

To use the Local Bridge connection:

1. Set up the Browser Use bridge service (documentation coming soon)
2. Create a new credential of type "Browser Use Local Bridge API" in n8n
3. Configure with:
   - URL of your local bridge service (e.g., `http://localhost:8000`)
   - Authentication token (if enabled)

## Compatibility

This node has been tested with n8n version 0.209.4 and later.

## Usage

### Cloud API Connection

1. Add the Browser Use node to your workflow
2. Select "Cloud API" as the connection type
3. Choose your credentials or create new ones
4. Select an operation (Run Task, Get Task Status, etc.)
5. Configure the operation parameters
6. Run your workflow

### Local Bridge Connection (🚧 Work In Progress)

The Local Bridge option allows you to connect to a locally running Browser Use instance, which can be useful for development, testing, or when you need to keep your automation entirely on-premise.

⚠️ **Setup Requirements (Coming Soon):**

1. Clone the repository for the bridge service (under development)
2. Install the required dependencies
3. Run the bridge service

Then in n8n:

1. Add the Browser Use node to your workflow
2. Select "Local Bridge" as the connection type
3. Choose your credentials or create new ones
4. Configure as you would with the Cloud API connection

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Browser Use Documentation](https://docs.browser-use.com)
* [Browser Use Cloud API Documentation](https://docs.browser-use.com/cloud/quickstart)

## License

[MIT](LICENSE.md)
