import { AppConfig } from './config/config';
import { WeatherStreamClient } from './websocket/websocket';
import { CandlestickAggregator } from './agregator/aggregator';
import { buildServer } from './server';

async function start() {
  const aggregator = new CandlestickAggregator();
  const fastify = buildServer(aggregator);

  const wsClient = new WeatherStreamClient(AppConfig.websocket.url, aggregator);

  try {
    await fastify.listen({ port: AppConfig.server.port });
    fastify.log.info(
      `Server listening on http://localhost:${AppConfig.server.port}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // handle graceful shutdown
  process.on('SIGINT', () => {
    fastify.close().then(() => {
      wsClient.close();
      process.exit(0);
    });
  });
}

start();
