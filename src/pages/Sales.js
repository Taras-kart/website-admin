import React, { useState } from 'react';
import './Sales.css';
import Navbar from './NavbarAdmin';

const Sales = () => {
  const [selectedCategory, setSelectedCategory] = useState('Men');
  const [salesData, setSalesData] = useState([
    { id: 1, productName: 'Men Urban Style', salesPrice: 2500, unitsSold: 100 },
    { id: 2, productName: 'Casual Shirt', salesPrice: 1800, unitsSold: 50 },
    { id: 3, productName: 'Women Casual Wear', salesPrice: 1500, unitsSold: 75 },
  ]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupConfirm, setPopupConfirm] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleUpdateSaleData = (id, field, value) => {
    const updatedSalesData = salesData.map((sale) => {
      if (sale.id === id) {
        return { ...sale, [field]: field === 'salesPrice' || field === 'unitsSold' ? parseFloat(value) : value };
      }
      return sale;
    });
    setSalesData(updatedSalesData);
  };

  const handleUpdateClick = () => {
    const isValid = salesData.every(
      (sale) => sale.productName && sale.salesPrice && sale.unitsSold
    );
    if (!isValid) {
      setPopupMessage('Please fill all the fields.');
    } else {
      setPopupConfirm(true);
    }
  };

  const confirmUpdate = (confirmed) => {
    setPopupConfirm(false);
    if (confirmed) {
      setPopupMessage('Sales data updated successfully.');
    }
  };

  return (
    <div className="sales-page">
      <Navbar />
      <div className="sales-section1">
        <h2>Select Category</h2>
        <div className="category-buttons">
          {['Men', 'Women', 'Kids'].map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="sales-section2">
        <h2>Sales Data</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Sales Price</th>
              <th>Units Sold</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id}>
                <td>
                  <input type="text" value={sale.productName} onChange={(e) => handleUpdateSaleData(sale.id, 'productName', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={sale.salesPrice} onChange={(e) => handleUpdateSaleData(sale.id, 'salesPrice', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={sale.unitsSold} onChange={(e) => handleUpdateSaleData(sale.id, 'unitsSold', e.target.value)} />
                </td>
                <td>{(sale.salesPrice * sale.unitsSold).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sales-section3">
        <button className="update-sales-btn" onClick={handleUpdateClick}>
          Update Sales Data
        </button>
      </div>

      {popupMessage && (
        <div className="popup-card">
          {popupMessage}
        </div>
      )}

      {popupConfirm && (
        <div className="popup-confirm-box">
          <p>Are you sure to update the sales data?</p>
          <div className="popup-actions">
            <button onClick={() => confirmUpdate(true)}>Yes</button>
            <button onClick={() => confirmUpdate(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
