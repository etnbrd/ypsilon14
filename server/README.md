# Phosphor Server

Backend server for the Phosphor application providing centralized state management.

## Setup

Install dependencies:

```bash
cd server
npm install
```

## Development

Run the server in development mode with hot-reload:

```bash
npm run dev
```

Run both client and server concurrently from the root directory:

```bash
cd ..
npm run dev
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status and timestamp

### Get State
- **GET** `/api/state`
- Returns the current global state object

### Update State
- **POST** `/api/state`
- Body: JSON object with state updates
- Merges updates into global state
- Broadcasts changes to all connected WebSocket clients

## WebSocket Events

### Server → Client

- `state-sync`: Sent to newly connected clients with current state
- `state-update`: Broadcast to all clients when state changes

### Client → Server

- `update-state`: Send state updates from client to server

## Configuration

- Default port: `3001`
- Override with `PORT` environment variable
- CORS enabled for `http://localhost:3000`
