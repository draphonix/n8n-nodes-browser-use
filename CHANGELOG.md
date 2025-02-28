# Changelog

All notable changes to the Browser Use n8n integration will be documented in this file.

## [0.1.4] - 2023-10-25

### Added
- Support for n8n Nodes-as-Tools feature
- Each Browser Use operation is now available as a tool for AI Agents
- Added `usableAsTool` flag to node definition
- Enhanced operation descriptions for better AI comprehension
- Added support for `$fromAI()` expression in the instructions field
- Created example workflow for using Browser Use with AI Agent
- Added documentation for setting up and using the node as a tool

### Changed
- Updated README with Nodes-as-Tools usage instructions
- Enhanced parameter descriptions to be more AI-friendly
- Improved operation descriptions with more context for AI decision-making

### Requirements
- n8n version 1.62.1 or newer for Nodes-as-Tools functionality
- Environment variable `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` for community nodes

## [0.1.3] - 2023-10-10

### Added
- Initial release of the Browser Use node for n8n
- Support for both Cloud API and Local Bridge connections
- Basic browser automation operations: Run Task, Get Task, Get Task Status, etc.
- Credential handling for API key and local bridge authentication 