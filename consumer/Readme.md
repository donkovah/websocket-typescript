# Climate Consumer Backend

## Description

The Climate Consumer Backend is a service that consumes weather events via WebSocket and exposes candlestick data through an HTTP API. It is built using Fastify for the server and TypeScript for type safety.

## Features

- **WebSocket Integration**: Connects to a weather data stream and processes incoming events.
- **Candlestick Aggregation**: Aggregates weather data into candlestick format for easy analysis.
- **HTTP API**: Exposes candlestick data via REST endpoints.
- **Graceful Shutdown**: Handles cleanup during application termination.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/climate-consumer-backend.git
   cd climate-consumer-backend
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set environment variables in a .env file (see Configuration section).

## Scripts

- **Start Development Server**: 

  ```bash
  yarn dev
  ```

- **Build Project**:

  ```bash
  yarn build
  ```

- **Start Production Server**:

  ```bash
  yarn start
  ```

- **Run Tests**:

  ```bash
  yarn test
  ```

- **Lint Code**:

  ```bash
  yarn lint
  ```

- **Format Code**:

  ```bash
  yarn format
  ```

## API Endpoints

### Health Check

- **GET** `/health`
  - Response: `{ "status": "ok" }`

### Candlesticks

- **GET** `/candlesticks`
  - Response: Aggregated candlestick data.

## Configuration

The application uses a configuration file located at `src/config/config.ts`. Update the following fields as needed:

- **WebSocket URL**: `AppConfig.websocket.url`
- **Server Port**: `AppConfig.server.port`

## Development

### File Structure

```
src/
├── agregator/          # Aggregator logic for candlestick data
├── config/             # Application configuration
├── routes/             # API route handlers
├── websocket/          # WebSocket client implementation
├── index.ts            # Application entry point
```

### Adding Routes

To add a new route, create a file in the `routes/` directory and register it in `server.ts`.

## License

This project is licensed under the MIT License.