import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { APIResponse, FlattenedCandlestick } from "../types/CandleData";
import { flattenCandlestickData } from "../util/flattenCandleStick";

const useCandlestickData = () => {
  const [data, setData] = useState<FlattenedCandlestick[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandlesticks = useCallback(async () => {
    try {
      const response = await axios.get<APIResponse>(`http://localhost:3000/candlesticks`);
      const apiData = response.data;
      if (!apiData) {
        throw new Error("No data found for API response");
      }
      const formattedData = flattenCandlestickData(apiData);
      setData(formattedData);
    } catch (err) {
      setError("Failed to fetch candlestick data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandlesticks();
  }, [fetchCandlesticks]);

  return { data, loading, error, refetch: fetchCandlesticks };
};

export default useCandlestickData;
