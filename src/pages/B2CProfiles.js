import React, { useEffect, useState } from 'react';
import './B2CProfiles.css';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');

const B2CProfiles = () => {
  const [b2cCustomers, setB2cCustomers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/b2c-customers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setB2cCustomers(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="b2c-container">
      <h2 className="b2c-title">B2C Customer Profiles</h2>
      <table className="b2c-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {b2cCustomers.map(customer => (
            <tr key={customer.id}>
              <td><strong>{customer.name}</strong></td>
              <td><strong>{customer.email}</strong></td>
              <td><strong>{customer.mobile}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default B2CProfiles;
