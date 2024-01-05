import React, { useState, useEffect } from 'react';

function App() {
  const [stocks, setStocks] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const n = parseInt(prompt('Enter the number of stocks (not more than 20):'), 10);

    if (isNaN(n) || n <= 0 || n > 20) {
      alert('Please enter a valid number between 1 and 20.');
      return;
    }

    const newSocket = new WebSocket('ws://localhost:8081');

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
      newSocket.send(JSON.stringify({ numberOfStocks: n }));
    };

    newSocket.onmessage = (event) => {
      const updatedStocks = JSON.parse(event.data);
      console.log(updatedStocks);

      // Extract data for the first n stocks
      const extractedStocks = Object.values(updatedStocks).slice(0, n);
      setStocks(extractedStocks);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const renderTableData = () => {
    return stocks.map((stock, index) => {
      const { ticker, openPrice, refreshInterval } = stock;
      return (
        <tr key={index}>
          <td>{ticker}</td>
          <td>{openPrice}</td>
          <td>{refreshInterval}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <h1>Stocks Live Updates</h1>
      <table id='stocks'>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Open Price</th>
            <th>Refresh Interval</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
}

export default App;
