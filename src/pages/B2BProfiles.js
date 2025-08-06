import React, { useState, useEffect, useRef } from 'react';
import './B2BProfiles.css';

const B2BProfiles = () => {
  const [b2bCustomers, setB2bCustomers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/b2b-customers')
      .then(res => res.json())
      .then(data => setB2bCustomers(data))
      .catch(err => console.error('Failed to fetch customers:', err));
  }, []);

  const handleAddCustomer = async () => {
    if (!newEmail || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setPopupMessage('Passwords do not match');
      setTimeout(() => setPopupMessage(''), 2000);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/b2b-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password })
      });

      const data = await res.json();

      if (res.ok) {
        setB2bCustomers(prev => [...prev, { id: data.customer.id, name: data.customer.name, email: data.customer.email }]);
        setPopupMessage('Successfully added the new customer');
        setShowPopup(false);
        setNewEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setPopupMessage(''), 2000);
      } else {
        setPopupMessage(data.message || 'Error adding customer');
        setTimeout(() => setPopupMessage(''), 2000);
      }
    } catch (error) {
      setPopupMessage('Server error');
      setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div>
      <div className="b2b-header">
        <h2>B2B Customers List</h2>
        <button className="add-btn" onClick={() => setShowPopup(true)}>Add New Customer</button>
      </div>

      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {b2bCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>
                <button className="action-btn">Change Password</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box" ref={popupRef}>
            <div className="popup-close" onClick={() => setShowPopup(false)}>×</div>
            <h3>Add New B2B Customer</h3>
            <input type="email" placeholder="Enter Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="submit-btn" onClick={handleAddCustomer}>Submit</button>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="popup-success">{popupMessage}</div>
      )}
    </div>
  );
};

export default B2BProfiles;
