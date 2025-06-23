FROM node:20-alpine

WORKDIR /app

# Copy package.json and lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app
COPY . .

# Expose Vite's default port
EXPOSE 4000

# Start Vite in dev mode
CMD ["yarn", "dev", "--host"]
