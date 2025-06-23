# Climate Data Frontend

## Overview

The Climate Data Frontend is a React-based web application built with TypeScript and Vite. It visualizes candlestick data aggregated from weather events in real-time. The application integrates with the backend consumer API and provides an interactive and responsive user interface.

---

## Features

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
- **Yarn**: Package manager for JavaScript.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/climate-data-frontend.git
   cd climate-data-frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

---

## Scripts

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
- **Run Tests**:
  ```bash
  yarn test
  ```
- **Lint Code**:
  ```bash
  yarn lint
  ```

---

## File Structure

```
src/
├── components/         # React components
├── hooks/              # Custom React hooks
│   ├── useCandlestickData.ts  # Hook for fetching candlestick data
├── util/               # Utility functions
│   ├── flattenCandleStick.ts  # Function to format candlestick data
├── App.tsx             # Main React application
├── index.tsx           # Application entry point
```

---

## API Integration

The frontend fetches candlestick data from the backend consumer API. The API endpoint used is:

- **GET** `/candlesticks`: Fetch aggregated candlestick data.

---

## Docker Usage

### Build and Run Container
1. Build the Docker image:
   ```bash
   docker build -t climate-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 4000:4000 climate-frontend
   ```

---

## Development Notes

### ESLint Configuration
The project uses ESLint with type-aware rules for TypeScript. To expand the configuration, you can enable stricter rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

### Testing
The project uses Jest for unit testing. Example test files include:
- `useCandlestickData.spec.ts`: Tests for the `useCandlestickData` hook.

Run tests using:
```bash
yarn test
```

---

## License

This project is licensed under the MIT License.