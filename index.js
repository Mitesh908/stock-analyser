const express = require('express');
const app = express();
const PORT = 8080;


const { WebSocketServer } = require('ws');
const axios = require('axios');
const Stock = require('./schema/stock_schema');

const cors = require('cors');

// connecting to db
const connectDB = require('./db/db_config');
connectDB;

app.use(express.json());
app.use(cors());



app.get('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const data = await Stock.find({ name })
      .sort({ createDate: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
});


const server = app.listen(PORT, () => {
  console.log(`App is up and running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}


async function fetchDataFromApi(url, body, headers = {}) {
  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
    throw new Error('Failed to fetch data from the API');
  }
}

// Function to save stock data to the database
async function saveStockData(stocks) {
  try {
    for (const stock of stocks) {
      const savedStock = new Stock({
        name: stock.name,
        symbol: stock.symbol,
        rank: stock.rank,
        age: stock.age,
        color: stock.color,
        exchanges: stock.exchanges,
        markets: stock.markets,
        pairs: stock.pairs,
        png32: stock.png32 || "",
        png64: stock.png64 || "",
        webp32: stock.webp32 || "",
        webp64: stock.webp64 || "",
        categories: stock.categories || [],
        allTimeHighUSD: stock.allTimeHighUSD || 0,
        circulatingSupply: stock.circulatingSupply || 0,
        totalSupply: stock.totalSupply || 0,
        maxSupply: stock.maxSupply || 0,
        code: stock.code || "",
        rate: stock.rate || 0,
        volume: stock.volume || 0,
        cap: stock.cap || 0
      });

      await savedStock.save();
    }
    console.log('Stocks saved successfully');
  } catch (error) {
    console.error('Error saving stock data:', error.message);
  }
}

// WebSocket connection handling
wss.on('connection', (connection) => {
  console.log('Received a new connection.');

  connection.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  connection.on('close', () => {
    console.log('Client disconnected.');
  });

  connection.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  connection.send('Welcome to WebSocket server!');
});

// API details
const apiUrl = 'https://api.livecoinwatch.com/coins/list';
const requestBody = {
  "currency": "USD",
  "sort": "rank",
  "order": "ascending",
  "offset": 0,
  "limit": 5,
  "meta": true
};
const requestHeaders = { 'x-api-key': '9f63680a-0cff-4fba-a891-d67d2adc851d', 'Content-Type': 'application/json' };

// Fetch and broadcast API data every 5 seconds
setInterval(async () => {
  try {
    const data = await fetchDataFromApi(apiUrl, requestBody, requestHeaders);
    const message = JSON.stringify(data);
    broadcast(message);
    await saveStockData(data);
  } catch (error) {
    console.error('Failed to fetch and broadcast data:', error.message);
  }
}, 5000);
