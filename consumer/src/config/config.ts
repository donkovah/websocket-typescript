import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
  websocket: {
    url: process.env.WS_URL || 'ws://simulator:8765',
  },
  candleStickInterval: Number(process.env.CANDLESTICK_INTERVAL) || 5,
};
