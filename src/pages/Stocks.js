import React, { useEffect, useState } from 'react';
import './Stocks.css';
import Navbar from './NavbarAdmin';

const Stocks = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stocks');
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="stocks-page">
      <Navbar />

      <div className="section-header">
        <h2>Stock Management</h2>
        <button className="refresh-button" onClick={fetchStocks}>🔄 Refresh</button>
      </div>

      <div className="section-table">
        <h3>Live Stock Overview</h3>
        {loading ? (
          <p>Loading stocks...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Brand</th>
                <th>Product Name</th>
                <th>Color</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((stock, index) => (
                <tr key={stock.id}>
                  <td>{index + 1}</td>
                  <td>{stock.brand}</td>
                  <td>{stock.productName}</td>
                  <td>{stock.color}</td>
                  <td>{stock.size}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.supplier || 'N/A'}</td>
                  <td>
                    <img src={stock.imageUrl} alt={stock.productName} className="stock-image" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Stocks;
