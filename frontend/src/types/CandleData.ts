export type CandleData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
  }

export type APIResponse = Record<string, CityDataItem[]>;

export type Candlestick ={
    open: number;
    high: number;
    low: number;
    close: number;
}

export type CityDataItem = {
    timestamp: string;
    candlestick: Candlestick;
}

export type FlattenedCandlestick = {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
}
