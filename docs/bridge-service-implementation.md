# Browser Use Local Bridge Implementation Plan

This document outlines the implementation plan for the Browser Use Local Bridge service, which acts as an intermediary between n8n and the local Browser Use Python library.

## Overview

The Browser Use Local Bridge service will be a standalone Python FastAPI application that mimics the Browser Use Cloud API endpoints but uses the local Browser Use Python library to execute tasks. This allows users to run Browser Use without using the cloud service.

## Technology Stack

- **FastAPI**: Modern, high-performance web framework for building APIs with Python
- **Pydantic**: Data validation and settings management
- **Browser Use Python Library**: The core library for browser automation
- **ASGI Server**: Uvicorn or Hypercorn for serving the API
- **Docker**: For containerization (optional)

## API Endpoints

The Local Bridge service will implement the following endpoints, mirroring the Browser Use Cloud API:

### 1. POST /api/v1/run-task

Create and run a new browser automation task.

**Request:**
```json
{
  "task": "Go to google.com and search for 'n8n'",
  "ai_provider": "openai"  // Optional
}
```

**Response:**
```json
{
  "task_id": "f7a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c",
  "status": "running",
  "live_url": "http://localhost:8000/live/f7a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c"
}
```

### 2. GET /api/v1/task/{task_id}/status

Check the status of a task.

**Response:**
```json
{
  "task_id": "f7a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c",
  "status": "running",
  "progress": 65,
  "error": null
}
```

### 3. PUT /api/v1/stop-task/{task_id}

Stop a running task.

**Response:**
```json
{
  "task_id": "f7a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c",
  "status": "stopped"
}
```

### 4. GET /api/v1/task/{task_id}/media

Get media (screenshot, video, PDF) from a task.

**Query Parameters:**
- `type`: The type of media to retrieve (screenshot, video, pdf)

**Response:**
```json
{
  "task_id": "f7a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c",
  "media_type": "screenshot",
  "url": "http://localhost:8000/media/f7a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c/screenshot.png"
}
```

### 5. GET /api/v1/ping

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Implementation Details

### 1. Task Management

The bridge service will maintain an in-memory dictionary of running tasks, with the following structure:

```python
{
    "task_id": {
        "browser_use_instance": browser_use_instance,
        "status": "running",
        "start_time": datetime.now(),
        "progress": 0,
        "error": None,
        "result": None,
        "media": {
            "screenshots": [],
            "video": None,
            "pdf": None
        }
    }
}
```

Each task will run in a separate thread to prevent blocking the API.

### 2. Browser Use Integration

The bridge service will create Browser Use instances as needed:

```python
def create_browser_use_instance(task_instructions, ai_provider=None):
    from browser_use import BrowserUse
    
    browser_use = BrowserUse(ai_provider=ai_provider)
    # Start the task in a separate thread
    thread = threading.Thread(
        target=run_task_thread,
        args=(browser_use, task_instructions, task_id)
    )
    thread.daemon = True
    thread.start()
    
    return browser_use, task_id
```

### 3. Live Preview

The bridge service will include a WebSocket endpoint for live previews:

```
GET /live/{task_id}
```

This will serve an HTML page with a live view of the browser automation.

### 4. Media Storage

Screenshots, videos, and PDFs will be stored in a temporary directory and served via:

```
GET /media/{task_id}/{filename}
```

## Authentication

Basic authentication can be enabled via environment variables:

```
BROWSER_USE_BRIDGE_AUTH_ENABLED=true
BROWSER_USE_BRIDGE_AUTH_TOKEN=your_secure_token
```

When enabled, all API requests must include the Authorization header:

```
Authorization: Bearer your_secure_token
```

## Deployment

### Docker Deployment

A Dockerfile will be provided for easy deployment:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "bridge_service:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Local Deployment

For local deployment:

```bash
pip install -r requirements.txt
uvicorn bridge_service:app --host 0.0.0.0 --port 8000
```

## Error Handling

The service will implement robust error handling:

1. Browser Use errors will be captured and returned in the task status
2. API errors will return appropriate HTTP status codes
3. A logging system will record all errors for troubleshooting

## Security Considerations

1. Authentication token should be strong and randomly generated
2. All sensitive data should be transmitted over HTTPS in production
3. The service should only bind to localhost by default for security
4. Rate limiting should be implemented to prevent abuse

## Future Enhancements

1. Support for persistent storage of task results
2. User management for multi-user environments
3. Advanced configuration options for Browser Use
4. Integration with monitoring tools

## Implementation Timeline

1. **Week 1**: Set up FastAPI project and implement basic API structure
2. **Week 2**: Integrate with Browser Use Python library and implement task management
3. **Week 3**: Implement media handling and live preview
4. **Week 4**: Add authentication, error handling, and testing
5. **Week 5**: Create documentation, Dockerfile, and release

## Conclusion

This implementation plan provides a roadmap for creating a compatible local alternative to the Browser Use Cloud API. By following this plan, we can provide n8n users with a choice between cloud-based and local browser automation. 