# Stage 1: Build Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the Fastify server port
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/index.js"]
