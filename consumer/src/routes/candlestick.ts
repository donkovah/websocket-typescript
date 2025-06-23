import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CandlestickAggregator } from '../agregator/aggregator';
import { Candlestick, CityCandlesticks } from '../schemas/candleStick';

interface RouteOptions {
  aggregator: CandlestickAggregator;
}
interface CandlestickQuery {
  city?: string;
  interval?: string;
}

export async function candlesticksRoute(
  fastify: FastifyInstance,
  options: RouteOptions
) {
  fastify.get(
    '/candlesticks',
    async (
      request: FastifyRequest<{ Querystring: CandlestickQuery }>,
      reply: FastifyReply
    ) => {
      const { aggregator } = options;

      if (!aggregator) {
        return reply.status(500).send({ error: 'Aggregator not initialized' });
      }

      const { city } = request.query;

      if (city) {
        // Get candlesticks for a specific city
        const data = aggregator.getCandlesticksForCity(city);

        if (!data) {
          return reply
            .status(404)
            .send({ error: `No data found for city ${city}` });
        }

        return reply.send({ [city]: data });
      }
      // Get all candlesticks for all cities
      return reply.send(aggregator.getAllCandlesticks());
    }
  );
}
