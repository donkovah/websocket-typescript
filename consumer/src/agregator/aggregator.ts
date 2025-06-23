import { AppConfig } from '../config/config';
import {
  Candlestick,
  CityCandlesticks,
  CandlestickEntry,
} from '../schemas/candleStick';
import { WeatherEvent } from '../schemas/weatherEventSchema';

export class CandlestickAggregator {
  // store is city -> hourKey (ISO string rounded to hour) -> Candlestick
  private store: Record<string, CityCandlesticks> = {};

  private getHourKey(timestamp: string): string {
    const date = new Date(timestamp);
    date.setMinutes(0, 0, 0); // round down to the hour
    return date.toISOString();
  }

  // Using minute key instead of hour key for more granularity
  private getMinuteKey(timestamp: string): string {
    const roundingMinutes = AppConfig.candleStickInterval || 1; // fallback to 1 if not set

    const date = new Date(timestamp);
    const minutes = date.getMinutes();

    // Calculate the "floor" based on rounding interval
    const roundedMinutes =
      Math.floor(minutes / roundingMinutes) * roundingMinutes;

    date.setMinutes(roundedMinutes);
    date.setSeconds(0, 0);

    return date.toISOString();
  }

  public addEvent(event: WeatherEvent): void {
    const { city, timestamp, temperature } = event;
    const hourKey = this.getHourKey(timestamp);
    // const MinuteKey to add more granularity = this.roundingMinutes(timestamp); 

    if (!this.store[city]) {
      this.store[city] = {};
    }

    const cityCandlesticks = this.store[city];

    if (!cityCandlesticks[hourKey]) {
      // first event for city/hour
      cityCandlesticks[hourKey] = {
        open: temperature,
        high: temperature,
        low: temperature,
        close: temperature,
      };
    } else {
      const c = cityCandlesticks[hourKey];
      c.high = Math.max(c.high, temperature);
      c.low = Math.min(c.low, temperature);
      c.close = temperature;
    }
  }

  public getCandlesticksForCity(city: string): CandlestickEntry[] | undefined {
    const cityCandlesticks = this.store[city];
    if (!cityCandlesticks) return undefined;

    return this.sortAndMapToArray(this.store[city]);
  }

  // Return candlesticks for all cities grouped
  public getAllCandlesticks(): Record<string, CandlestickEntry[]> {
    const result: Record<string, CandlestickEntry[]> = {};

    for (const city in this.store) {
      result[city] = this.sortAndMapToArray(this.store[city]);
    }
    return result;
  }

  // Sort the transformed candlesticks by timestamp and map to array with proper keys
  private sortAndMapToArray(
    candlesticks: CityCandlesticks
  ): CandlestickEntry[] {
    return Object.entries(candlesticks)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([timestamp, candlestick]) => ({
        timestamp,
        candlestick,
      }));
  }
}
