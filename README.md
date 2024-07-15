# stock-analyser

This is a stock analyzing application that fetches stock data from an external API, saves it to a database, and broadcasts the data to a frontend application using WebSocket.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Backend](#backend)
- [Frontend](#frontend)
- [Technologies Used](#technologies-used)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/abhinav3254/stock_analyzer.git
    ```

2. Navigate to the project directory:

    ```bash
    cd stock_analyzer
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Ensure you have MongoDB running on your local machine or update the database configuration in `db/db_config.js` to point to your MongoDB instance.

## Usage

1. Start the backend server:

    ```bash
    npm start
    ```

    The backend server will start running on `http://localhost:8080`.

2. The frontend part of the application should be served separately. Ensure your React application is running and is correctly configured to connect to the WebSocket server on `ws://localhost:8080`.

## Backend

### Endpoints

- The backend server does not expose any REST API endpoints as it primarily functions through WebSocket for real-time data broadcasting.

### WebSocket

- The WebSocket server runs on the same port as the Express server (`http://localhost:8080`).
- It broadcasts stock data every 5 seconds to all connected clients.

### Database

- MongoDB is used to store the fetched stock data.
- Ensure the `stock_schema.js` is correctly defined and connected to your MongoDB instance.

### Configuration

- API details for fetching stock data are hardcoded. You might want to move them to a configuration file or environment variables for better management.

## Frontend

### React Component

The frontend part involves a React component (`ChangeStockModal`) that connects to the WebSocket server to receive real-time stock updates and dispatches actions to update the Redux store.

#### Sample Code

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setStocks } from '../redux/stockSlice';

const ChangeStockModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [newStock, setNewStock] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket('ws://localhost:8080');

    // Handle incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(setStocks(data));
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [dispatch]);

  const handleChangeStock = () => {
    fetch(`https://api.livecoinwatch.com/coins/list`, {
      method: 'POST',
      headers: {
        'x-api-key': '9f63680a-0cff-4fba-a891-d67d2adc851d',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "currency": "USD",
        "sort": "rank",
        "order": "ascending",
        "offset": 0,
        "limit": 5,
        "meta": true
      })
    })
      .then(response => response.json())
      .then(data => {
        dispatch(setStocks(data));
        closeModal();
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="modal">
      <h2>Change Stock/Crypto</h2>
      <input
        type="text"
        value={newStock}
        onChange={(e) => setNewStock(e.target.value)}
      />
      <button onClick={handleChangeStock}>Change</button>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default ChangeStockModal;
