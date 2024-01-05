const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Function to update stock data based on refresh intervals.
function updateStockData() {
  const filePath = path.join(__dirname, 'stock_data.json');
  let stocks = require(filePath);
  let originalRefreshIntervals = {};

  // Calculate the main loop interval as the shortest refresh interval among all stocks.
  const mainLoopInterval = Math.min(...Object.values(stocks).map(stock => stock.refreshInterval)) * 1000;

    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws) => {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify(stocks));
    });

  // Store the original values rendered from polygon api.
  for (const symbol in stocks) {
    originalRefreshIntervals[symbol] = stocks[symbol].refreshInterval;
  }

  setInterval(() => {
    for (const symbol in stocks) {
      const stock = stocks[symbol];

      if (stock.refreshInterval === 0) {
        // Update the openPrice with a random value.
        stock.openPrice = Math.random() * (200 - 100) + 100;

        // Update the lastUpdated timestamp.
        stock.lastUpdated = Math.floor(Date.now() / 1000);

        // Update symbol of ticker.
        stock.ticker = symbol;

        // Reset refreshInterval to the original value.
        stock.refreshInterval = originalRefreshIntervals[symbol];

        console.log(`Updated data for ${symbol}: ${JSON.stringify(stock)}`);
      } else if (stock.refreshInterval > 0) {
        // Decrement the refreshInterval for stocks that haven't reached zero yet.
        stock.refreshInterval--;
      }
    }

        // Send updated stock data to all connected clients.
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(stocks));
          }
        });

    // Save the updated stock data back to the file.
    fs.writeFileSync(filePath, JSON.stringify(stocks, null, 2));

    console.log('Stock data updated successfully!');
  }, mainLoopInterval);
}

updateStockData();
