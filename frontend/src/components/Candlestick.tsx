import React from "react";
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  discontinuousTimeScaleProvider,
} from "react-financial-charts";
import type { CandleData } from "../types/CandleData";
import useCandlestickData from "../hooks/useCandlestickData";

const CandlestickChart: React.FC = () => {
  const { data, loading, error, refetch } = useCandlestickData();

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>{error}</div>;
  if (data.length === 0) return <div>No data available.</div>;

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: CandleData) => d.date);

  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider(data);

  const xExtents = [
    xAccessor(chartData[0]),
    xAccessor(chartData[chartData.length - 1]),
  ];

  return (
    <>
    <ChartCanvas
      height={400}
      width={800}
      ratio={1}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      seriesName="CandlestickSeries"
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
    >
      <Chart id={1} yExtents={(d: CandleData) => [d.high, d.low]}>
        <XAxis axisAt="bottom" orient="bottom" ticks={6} />
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
    <div className="text-center mt-3">
      <button className="btn btn-primary" onClick={refetch}>
        Refresh Data
      </button>
    </div>
    </>
  );
};

export default CandlestickChart;
