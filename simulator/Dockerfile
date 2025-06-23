FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY weather_stream_simulator.js ./

EXPOSE 8765

CMD ["node", "weather_stream_simulator.js"]
