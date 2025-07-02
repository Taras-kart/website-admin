import React, { useState } from 'react';
import './Transaction.css';

import Navbar from './NavbarAdmin';

const Transaction = () => {
  const [transactionData, setTransactionData] = useState([
    {
      id: 1,
      transactionId: 'TRX123',
      productName: 'Men Urban Style',
      date: '2023-06-15',
      status: 'Completed',
      amount: 2000,
    },
    {
      id: 2,
      transactionId: 'TRX124',
      productName: 'Casual Shirt',
      date: '2023-06-16',
      status: 'Pending',
      amount: 1500,
    },
  ]);
  const [popupMessage, setPopupMessage] = useState('');

  const handleDeleteTransaction = (id) => {
    setTransactionData(transactionData.filter(item => item.id !== id));
    setPopupMessage('Transaction deleted successfully.');
    setTimeout(() => setPopupMessage(''), 2000);
  };

  return (
    <div className='transactions'>
        <Navbar />
    <div className="transaction-page">
      {/* Section 1: Header */}
      <div className="transaction-header">
        <h2>Transaction History</h2>
        <p>Manage and track all transactions</p>
      </div>

      {/* Section 2: Filter */}
      <div className="transaction-filter">
        <h3>Filter Transactions</h3>
        <div className="filter-options">
          <input type="text" placeholder="Search by Product Name" />
          <select>
            <option>Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <button>Apply Filters</button>
        </div>
      </div>

      {/* Section 3: Transaction Table */}
      <div className="transaction-table">
        <h3>Transaction Details</h3>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Product Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.transactionId}</td>
                <td>{transaction.productName}</td>
                <td>{transaction.date}</td>
                <td>{transaction.status}</td>
                <td>{transaction.amount}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteTransaction(transaction.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4: Popup Message */}
      {popupMessage && (
        <div className="popup-card">
          {popupMessage}
        </div>
      )}
    </div>
    </div>
  );
};

export default Transaction;
