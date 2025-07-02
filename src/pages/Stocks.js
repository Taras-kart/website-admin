import React, { useState } from 'react';
import './Stocks.css';
import Navbar from './NavbarAdmin';

const Stocks = () => {
  const [stockData, setStockData] = useState([
    { id: 1, name: 'Nike', quantity: 100, price: 2000, supplier: 'Nike Inc.', image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Adidas', quantity: 50, price: 1500, supplier: 'Adidas Group', image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Puma', quantity: 80, price: 1200, supplier: 'Puma SE', image: 'https://via.placeholder.com/80' }
  ]);

  const handleInputChange = (index, field, value) => {
    const updated = [...stockData];
    updated[index][field] = field === 'quantity' || field === 'price' ? parseInt(value) : value;
    setStockData(updated);
  };

  const handleAddStock = () => {
    const newStock = {
      id: stockData.length + 1,
      name: '',
      quantity: 0,
      price: 0,
      supplier: '',
      image: 'https://via.placeholder.com/80'
    };
    setStockData([...stockData, newStock]);
  };

  return (
    <div className="stocks-page">
        <Navbar />
      <div className="section-header">
        <h2>Stock Management</h2>
      </div>

      <div className="section-table">
        <h3>Stock List</h3>
        <table>
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, idx) => (
              <tr key={stock.id}>
                <td>{idx + 1}</td>
                <td>
                  <input
                    type="text"
                    value={stock.name}
                    onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={stock.quantity}
                    onChange={(e) => handleInputChange(idx, 'quantity', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={stock.price}
                    onChange={(e) => handleInputChange(idx, 'price', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={stock.supplier}
                    onChange={(e) => handleInputChange(idx, 'supplier', e.target.value)}
                  />
                </td>
                <td>
                  <img src={stock.image} alt="Stock" className="stock-image" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="add-stock-button">
        <button onClick={handleAddStock}>Add New Stock</button>
      </div>
    </div>
  );
};

export default Stocks;
