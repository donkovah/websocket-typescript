import type { APIResponse, FlattenedCandlestick } from "../types/CandleData";

export const flattenCandlestickData = (apiResponse: APIResponse): FlattenedCandlestick[] =>{
    const result: FlattenedCandlestick[] = [];

    Object.values(apiResponse).forEach((cityData) => {
        cityData.forEach(({ timestamp, candlestick }) => {
            result.push({
                date: new Date(timestamp),
                open: candlestick.open,
                high: candlestick.high,
                low: candlestick.low,
                close: candlestick.close,
            });
        });
    });

    return result.sort((a, b) => a.date.getTime() - b.date.getTime());;
}
