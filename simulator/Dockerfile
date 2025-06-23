FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY simulator.js ./

EXPOSE 8765

CMD ["node", "simulator.js"]
