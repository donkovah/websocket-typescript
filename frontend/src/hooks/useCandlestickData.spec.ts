import {renderHook, act, waitFor} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useCandlestickData from './useCandlestickData';
import { flattenCandlestickData } from '../util/flattenCandleStick';
import type { APIResponse } from '../types/CandleData';

jest.mock('../util/flattenCandleStick');

const mock = new MockAdapter(axios);

describe('useCandlestickData', () => {
  const mockApiResponse: APIResponse = {
    city1: [
      {
        timestamp: '2024-06-01T00:00:00Z',
        candlestick: { open: 100, high: 110, low: 90, close: 105 },
      },
    ],
  };

  const mockFlattenedData = [
    {
      date: new Date('2024-06-01T00:00:00Z'),
      open: 100,
      high: 110,
      low: 90,
      close: 105,
    },
  ];

  beforeEach(() => {
    mock.reset();
    (flattenCandlestickData as jest.Mock).mockReturnValue(mockFlattenedData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and set candlestick data correctly', async () => {
    mock.onGet('http://localhost:3000/candlesticks').reply(200, mockApiResponse);

    const { result } = renderHook(() => useCandlestickData());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Validate data
    expect(result.current.data).toEqual(mockFlattenedData);
    expect(result.current.error).toBe(null);
  });

  it('should handle API error correctly', async () => {
    mock.onGet('http://localhost:3000/candlesticks').networkError();

    const { result } = renderHook(() => useCandlestickData());

    // Wait for error state
    await waitFor(() => expect(result.current.error).toBe('Failed to fetch candlestick data.'));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('should allow manual refetching', async () => {
    mock.onGet('http://localhost:3000/candlesticks').reply(200, mockApiResponse);

    const { result } = renderHook(() => useCandlestickData());

    // Wait for initial fetch
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.refetch();
    });

    // Wait for refetch
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(flattenCandlestickData).toHaveBeenCalledTimes(2);
  });
});