/**
 * This is a simple test script for the Browser Use node.
 * It demonstrates how to configure the node in your n8n workflow.
 * 
 * To use in n8n:
 * 1. Install the n8n-nodes-browser-use package
 * 2. Set up credentials for either Cloud API or Local Bridge
 * 3. Configure a workflow similar to the example below
 */

// Example n8n workflow JSON:
const exampleWorkflow = {
  "nodes": [
    {
      "parameters": {},
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "connectionType": "cloud", // or "local"
        "operation": "runTask",
        "aiProvider": "default",
        "instructions": "Go to google.com and search for 'n8n automation'"
      },
      "name": "Browser Use",
      "type": "n8n-nodes-browser-use.browserUse",
      "typeVersion": 1,
      "position": [
        450,
        300
      ],
      "credentials": {
        "browserUseCloudApi": {
          "id": "1",
          "name": "Browser Use Cloud account"
        }
        // OR for local bridge:
        // "browserUseLocalBridgeApi": {
        //   "id": "2", 
        //   "name": "Browser Use Local Bridge"
        // }
      }
    }
  ],
  "connections": {
    "Start": {
      "main": [
        [
          {
            "node": "Browser Use",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
};

console.log("To test the Browser Use node:");
console.log("1. Install the node with: npm install n8n-nodes-browser-use");
console.log("2. Start n8n: npx n8n start");
console.log("3. Create a new workflow and add the Browser Use node");
console.log("4. Configure credentials for either Cloud API or Local Bridge");
console.log("5. Set the operation and parameters as needed");
console.log("6. Run the workflow and check the results!"); 