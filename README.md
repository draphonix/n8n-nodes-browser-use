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
[Nodes-as-Tools](#nodes-as-tools)  
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
- **Limit**: Max number of results to return (1-50, default 50).
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

This node has been tested with n8n version 1.80.4.

The Nodes-as-Tools feature requires n8n version 1.62.1 or newer.

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

## Nodes-as-Tools

Starting with version 0.1.4, Browser Use node supports the n8n Nodes-as-Tools feature, allowing it to be used directly by AI agents in your workflows.

### Requirements

- n8n version 1.62.1 or newer
- AI Agent node in your workflow

### Using Browser Use as an AI Tool

1. Add the Browser Use node to your workflow
2. Configure the node with your credentials
3. Connect it to an AI Agent node
4. The AI Agent can now use Browser Use operations based on natural language instructions

### Configuration for Community Nodes

Since Browser Use is a community node, you'll need to enable community packages as tools:

1. Set the environment variable `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` when running n8n
2. Restart your n8n instance

Example for a Docker-based installation:
```bash
docker run -e N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true -p 5678:5678 n8nio/n8n
```

### Example Prompts for AI Agents

Here are some examples of how to instruct an AI agent to use Browser Use:

- "Go to amazon.com and extract the prices and ratings of the top 5 bestsellers in electronics"
- "Navigate to my company's website, log in with my credentials, and download the latest financial report"
- "Search for recent news about artificial intelligence and summarize the top 3 articles"
- "Fill out a contact form on example.com with my information"

### Tool Operations Available to AI

The AI agent can use all of the Browser Use operations:

- **Run Task**: Execute browser automation with natural language instructions
- **Get Task Status**: Check if a task is completed or still running
- **Get Task**: Retrieve detailed information about a task
- **Get Task Media**: Obtain screenshots, videos, or PDFs from a task
- **Pause/Resume/Stop Task**: Control running tasks
- **List Tasks**: View all browser automation tasks

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Browser Use Documentation](https://docs.browser-use.com)
* [Browser Use Cloud API Documentation](https://docs.browser-use.com/cloud/quickstart)
* [n8n Nodes-as-Tools Documentation](https://docs.n8n.io/ai/nodes-as-tools/)

## License

[MIT](LICENSE.md)
