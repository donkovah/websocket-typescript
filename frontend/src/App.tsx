import React from 'react';
import CandlestickChart from './components/Candlestick';

const App: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center">Candlestick Chart Example (API Data)</h2>
      <CandlestickChart />
    </div>
  );
};

export default App;
