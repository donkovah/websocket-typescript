import { CandlestickAggregator } from './aggregator';
import { WeatherEvent } from '../schemas/weatherEventSchema';

describe('CandlestickAggregator', () => {
  let aggregator: CandlestickAggregator;

  beforeEach(() => {
    aggregator = new CandlestickAggregator();
  });

  const createEvent = (
    city: string,
    timestamp: string,
    temperature: number
  ): WeatherEvent => ({
    city,
    timestamp,
    temperature,
    windspeed: 0,
    winddirection: 0,
  });

  test('should add a single event and create a candlestick', () => {
    const event = createEvent('Berlin', '2025-06-23T15:23:45.000Z', 20);
    aggregator.addEvent(event);

    const candlesticks = aggregator.getCandlesticksForCity('Berlin');
    expect(candlesticks).toBeDefined();

    const hourKey = new Date('2025-06-23T15:00:00.000Z').toISOString();
    expect(candlesticks![0].timestamp).toEqual(hourKey);

    expect(candlesticks![0].candlestick).toEqual({
      open: 20,
      high: 20,
      low: 20,
      close: 20,
    });
  });

  test('should aggregate multiple events within the same hour correctly', () => {
    const events = [
      createEvent('Berlin', '2025-06-23T15:05:00.000Z', 18),
      createEvent('Berlin', '2025-06-23T15:30:00.000Z', 22),
      createEvent('Berlin', '2025-06-23T15:59:59.999Z', 19),
    ];

    events.forEach((event) => aggregator.addEvent(event));

    const candlesticks = aggregator.getCandlesticksForCity('Berlin');
    console.log(candlesticks);
    const hourKey = new Date('2025-06-23T15:00:00.000Z').toISOString();
    expect(candlesticks![0].timestamp).toEqual(hourKey);

    const hourCandlesticks = candlesticks!.reduce((acc, c) => {
      acc[c.timestamp] = c.candlestick;
      return acc;
    }, {} as Record<string, any>);

    expect(hourCandlesticks[hourKey]).toEqual({
      open: 18,
      high: 22,
      low: 18,
      close: 19,
    });
  });

  test('should separate candlesticks by hour', () => {
    const events = [
      createEvent('Berlin', '2025-06-23T15:05:00.000Z', 18),
      createEvent('Berlin', '2025-06-23T16:10:00.000Z', 21),
    ];

    events.forEach((event) => aggregator.addEvent(event));

    const candlesticks = aggregator.getCandlesticksForCity('Berlin');

    const hourKey1 = new Date('2025-06-23T15:00:00.000Z').toISOString();
    const hourKey2 = new Date('2025-06-23T16:00:00.000Z').toISOString();

    const hourKeys = candlesticks!.map((c) => c.timestamp);
    expect(hourKeys).toContain(hourKey1);
    expect(hourKeys).toContain(hourKey2);

    const hourCandlesticks = candlesticks!.reduce((acc, c) => {
      acc[c.timestamp] = c.candlestick;
      return acc;
    }, {} as Record<string, any>);

    expect(hourCandlesticks[hourKey1]).toEqual({
      open: 18,
      high: 18,
      low: 18,
      close: 18,
    });
    expect(hourCandlesticks[hourKey2]).toEqual({
      open: 21,
      high: 21,
      low: 21,
      close: 21,
    });
  });

  test('should return undefined for unknown city', () => {
    expect(aggregator.getCandlesticksForCity('UnknownCity')).toBeUndefined();
  });

  test('should return sorted candlesticks for city', () => {
    const events = [
      createEvent('Berlin', '2025-06-23T16:05:00.000Z', 20),
      createEvent('Berlin', '2025-06-23T15:10:00.000Z', 18),
    ];

    events.forEach((event) => aggregator.addEvent(event));

    const sorted = aggregator.getCandlesticksForCity('Berlin');
    expect(sorted).toHaveLength(2);
    expect(sorted).toBeDefined();
    expect(sorted![0].candlestick.open).toBe(18); // 15:00 hour comes first
    expect(sorted![1].candlestick.open).toBe(20); // 16:00 hour comes second
  });

  test('should return empty object for all candlesticks if no events added', () => {
    expect(aggregator.getAllCandlesticks()).toEqual({});
  });

  test('should handle invalid events gracefully', () => {
    const invalidEvent = {
      city: 'Berlin',
      timestamp: 'InvalidTimestamp',
      temperature: NaN,
    } as WeatherEvent;

    expect(() => aggregator.addEvent(invalidEvent)).toThrow();
  });
});