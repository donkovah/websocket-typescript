# Climate Data Aggregation System

## Overview

The Climate Data Aggregation System is a multi-component project designed to process, aggregate, and visualize weather data. It consists of three main components:

1. **Consumer**: A backend service that consumes weather events via WebSocket, aggregates them into candlestick data, and exposes them via an HTTP API.
2. **Simulator**: A WebSocket server that simulates weather events for testing and development purposes.
3. **Frontend**: A React-based web application that visualizes candlestick data in real-time.

The project uses Docker for containerization and includes an in-memory store for efficient handling of WebSocket events.

---

## Features

### Consumer
- **WebSocket Integration**: Connects to a weather data stream and processes incoming events.
- **Candlestick Aggregation**: Aggregates weather data into candlestick format for easy analysis.
- **HTTP API**: Exposes candlestick data via REST endpoints.
- **Graceful Shutdown**: Handles cleanup during application termination.
- **In-Memory Storage**: Stores aggregated candlestick data for fast retrieval.

### Simulator
- **WebSocket Server**: Simulates weather events such as temperature, wind speed, and direction.
- **Real-Time Weather Data**: Fetches live weather data from Open-Meteo API.
- **Fallback to Fake Events**: Generates fake weather events when API calls fail.
- **Customizable Event Frequency**: Allows configuration of event generation intervals.
- **Dockerized**: Easily deployable using Docker.

### Frontend
- **Real-Time Visualization**: Displays candlestick data in charts.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **React + TypeScript**: Built with modern React and TypeScript for type safety.
- **Integration with Consumer API**: Fetches and visualizes data from the backend.
- **Custom Hooks**: Includes reusable hooks like `useCandlestickData` for fetching and managing data.
- **Dockerized**: Easily deployable using Docker.

---

## Installation

### Prerequisites
- **Node.js**: Version 18 or higher.
- **Docker**: Installed and running.
- **Yarn**: Package manager for JavaScript.

### Clone the Repository
```bash
git clone https://github.com/your-repo/climate-data-aggregation-system.git
cd climate-data-aggregation-system
```

---

## Components

### Consumer
#### Installation
1. Navigate to the `consumer` directory:
   ```bash
   cd consumer
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set environment variables in a `.env` file:
   ```env
   WEBSOCKET_URL=ws://localhost:8080
   SERVER_PORT=3000
   ```

#### Scripts
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

#### API Endpoints
- **GET** `/health`: Health check endpoint.
- **GET** `/candlesticks`: Fetch aggregated candlestick data.

---

### Simulator
#### Installation
1. Navigate to the `simulator` directory:
   ```bash
   cd simulator
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

#### Scripts
- **Start Simulator**:
  ```bash
  yarn start
  ```

#### Configuration
Set environment variables in a `.env` file:
```env
SIMULATOR_PORT=8080
EVENT_INTERVAL_MS=1000
```

---

### Frontend
#### Installation
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

#### Scripts
- **Start Development Server**:
  ```bash
  yarn dev
  ```
- **Build Project**:
  ```bash
  yarn build
  ```
- **Preview Production Build**:
  ```bash
  yarn preview
  ```

---

## Docker Usage

### Build and Run Containers
1. Build Docker images for all components:
   ```bash
   docker-compose build
   ```

2. Start all services:
   ```bash
   docker-compose up
   ```

### Docker Compose Configuration
The `docker-compose.yml` file defines services for the **consumer**, **simulator**, and **frontend**. Example:
```yaml
version: '3.8'
services:
  simulator:
    build:
      context: ./simulator
    ports:
      - "8765:8765"
    networks:
      - app-network

  consumer:
    build:
      context: ./consumer
    ports:
      - "3000:3000"
    env_file:
      - ./consumer/.env
    depends_on:
      - simulator
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
    ports:
      - "4000:4000"
    env_file:
      - ./frontend/.env
    depends_on:
      - consumer
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```


---

## Development

### File Structure
```
consumer/
├── src/
│   ├── agregator/          # Aggregator logic for candlestick data
│   ├── config/             # Application configuration
│   ├── routes/             # API route handlers
│   ├── websocket/          # WebSocket client implementation
│   ├── index.ts            # Application entry point

simulator/
├── src/
│   ├── client.js/          # WebSocket POC implementation
│   ├── simulator.js        # Application entry point

frontend/
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── util/               # Utility functions
│   ├── App.tsx             # Main React application
│   ├── index.tsx           # Application entry point
```

---

## Testing

### Consumer
Run unit tests:
```bash
cd consumer
yarn test
```

### Frontend
Run unit tests:
```bash
cd frontend
yarn test
```

---

## License

This project is licensed under the MIT License.