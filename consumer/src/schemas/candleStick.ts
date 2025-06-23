export type Candlestick = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export type CityCandlesticks = {
  [hour: string]: Candlestick; // ISO Hour => Candlestick
};

export interface CandlestickEntry {
    timestamp: string;
    candlestick: Candlestick;
  }