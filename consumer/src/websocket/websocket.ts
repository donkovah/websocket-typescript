import WebSocket from 'ws';
import { weatherEventSchema } from '../schemas/weatherEventSchema';
import { CandlestickAggregator } from '../agregator/aggregator';

export class WeatherStreamClient {
  private ws!: WebSocket;
  private reconnectTimeout?: NodeJS.Timeout;

  constructor(
    private url: string,
    private aggregator: CandlestickAggregator
  ) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.on('open', () => {
      console.log('✅ Connected to Weather Stream');
      // Clear any previous reconnect attempts on successful connection
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = undefined;
      }
    });

    this.ws.on('message', (data) => {
      try {
        const json = JSON.parse(data.toString());
        const result = weatherEventSchema.safeParse(json);
        if (!result.success) {
          console.error('Invalid message:', result.error.errors);
          return;
        }

        const weatherEvent = result.data;

        // Aggregate the weather event
        this.aggregator.addEvent(weatherEvent);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.ws.on('close', () => {
      console.warn(
        'WebSocket connection closed, attempting to reconnect in 3 seconds...'
      );
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    });

    this.ws.on('error', (err) => {
      console.error('WebSocket error:', err);
      this.ws.close();
    });
  }

  public close() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.ws.close();
  }
}
