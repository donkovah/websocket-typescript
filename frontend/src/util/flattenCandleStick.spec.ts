import { flattenCandlestickData } from './flattenCandleStick';
import type { APIResponse, FlattenedCandlestick } from '../types/CandleData';

describe('flattenCandlestickData', () => {
  it('should flatten and sort candlestick data from API response', () => {
    const mockApiResponse: APIResponse = {
      Berlin: [
        {
          timestamp: '2024-06-21T10:00:00Z',
          candlestick: { open: 100, high: 110, low: 90, close: 105 },
        },
        {
          timestamp: '2024-06-21T12:00:00Z',
          candlestick: { open: 106, high: 115, low: 95, close: 108 },
        },
      ],
      Munich: [
        {
          timestamp: '2024-06-21T11:00:00Z',
          candlestick: { open: 200, high: 210, low: 190, close: 205 },
        },
      ],
    };

    const expected: FlattenedCandlestick[] = [
      {
        date: new Date('2024-06-21T10:00:00Z'),
        open: 100,
        high: 110,
        low: 90,
        close: 105,
      },
      {
        date: new Date('2024-06-21T11:00:00Z'),
        open: 200,
        high: 210,
        low: 190,
        close: 205,
      },
      {
        date: new Date('2024-06-21T12:00:00Z'),
        open: 106,
        high: 115,
        low: 95,
        close: 108,
      },
    ];

    const result = flattenCandlestickData(mockApiResponse);

    expect(result).toEqual(expected);
  });

  it('should return an empty array when API response is empty', () => {
    const mockApiResponse: APIResponse = {};
    const result = flattenCandlestickData(mockApiResponse);
    expect(result).toEqual([]);
  });
});
