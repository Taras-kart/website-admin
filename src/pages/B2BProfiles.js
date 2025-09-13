import React, { useState, useEffect, useRef } from 'react';
import './B2BProfiles.css';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');

const B2BProfiles = () => {
  const [b2bCustomers, setB2bCustomers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/b2b-customers`)
      .then(res => res.json())
      .then(data => setB2bCustomers(data))
      .catch(() => {});
  }, []);

  const handleAddCustomer = async () => {
    if (!name || !email || !mobile || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setPopupMessage('Passwords do not match');
      setTimeout(() => setPopupMessage(''), 2000);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/b2b-customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, password })
      });
      const data = await res.json();
      if (res.ok) {
        setB2bCustomers(prev => [...prev, data.user]);
        setPopupMessage('Successfully added the new customer');
        setShowPopup(false);
        setName('');
        setEmail('');
        setMobile('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setPopupMessage(''), 2000);
      } else {
        setPopupMessage(data.message || 'Error adding customer');
        setTimeout(() => setPopupMessage(''), 2000);
      }
    } catch {
      setPopupMessage('Server error');
      setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) setShowPopup(false);
  };

  useEffect(() => {
    if (showPopup) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  return (
    <div className="b2b-container-b2b">
      <div className="b2b-header-b2b">
        <h2 className="heading-b2b">B2B Customers List</h2>
        <button className="add-btn-b2b" onClick={() => setShowPopup(true)}>Add New Customer</button>
      </div>

      <table className="customers-table-b2b">
        <thead>
          <tr>
            <th className="table-th-b2b">Name</th>
            <th className="table-th-b2b">Email</th>
            <th className="table-th-b2b">Mobile</th>
            <th className="table-th-b2b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {b2bCustomers.map(customer => (
            <tr key={customer.id}>
              <td className="table-td-b2b">{customer.name}</td>
              <td className="table-td-b2b">{customer.email}</td>
              <td className="table-td-b2b">{customer.mobile}</td>
              <td className="table-td-b2b">
                <button className="action-btn-b2b">Change Password</button>
                <button className="delete-btn-b2b">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay-b2b">
          <div className="popup-box-b2b" ref={popupRef}>
            <div className="popup-close-b2b" onClick={() => setShowPopup(false)}>×</div>
            <h3 className="popup-title-b2b">Add New User</h3>
            <input className="popup-input-b2b" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="popup-input-b2b" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="popup-input-b2b" type="tel" placeholder="Mobile Number" maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <input className="popup-input-b2b" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="popup-input-b2b" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="submit-btn-b2b" onClick={handleAddCustomer}>Submit</button>
          </div>
        </div>
      )}

      {popupMessage && <div className="popup-success-b2b">{popupMessage}</div>}
    </div>
  );
};

export default B2BProfiles;
