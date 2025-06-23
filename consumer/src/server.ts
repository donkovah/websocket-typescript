import Fastify, { FastifyInstance } from 'fastify';
import { candlesticksRoute } from './routes/candlestick';
import { CandlestickAggregator } from './agregator/aggregator';
import cors from '@fastify/cors';

export const buildServer = (
  aggregator: CandlestickAggregator
): FastifyInstance => {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS before other routes
  fastify.register(cors, {
    origin: '*', 
    methods: ['GET'],
  });

  // Register routes with the aggregator passed as option
  fastify.register(candlesticksRoute, { aggregator });

  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  // TODO: Add authentication/authorization hooks here
  fastify.addHook('onRequest', async (request, reply) => {
    // TODO: Validate auth headers, tokens, etc.
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    reply.status(error.statusCode ?? 500).send({ error: error.message });
  });

  return fastify;
};
