import React, { useState, useEffect, useRef } from 'react';
import './B2BProfiles.css';
const portalClass = value => String(value || '').split(/\s+/).filter(Boolean).flatMap(name => ({
  "ops-main": ["tadm-operations-ops-main"],
  "ops-heading": ["tadm-operations-ops-heading"],
  "ops-panel": ["tadm-operations-ops-panel"],
  "ops-actions": ["tadm-operations-ops-actions"],
  "ops-row-actions": ["tadm-operations-ops-row-actions"],
  "ops-primary": ["tadm-operations-ops-primary"],
  "ops-metrics": ["tadm-operations-ops-metrics"],
  "ops-quick": ["tadm-operations-ops-quick"],
  "ops-table-wrap": ["tadm-operations-ops-table-wrap"],
  "ops-badge": ["tadm-operations-ops-badge"],
  "ops-toolbar": ["tadm-operations-ops-toolbar"],
  "ops-dates": ["tadm-operations-ops-dates"],
  "ops-pagination": ["tadm-operations-ops-pagination"],
  "ops-alert": ["tadm-operations-ops-alert"],
  "ops-success": ["tadm-operations-ops-success"],
  "ops-empty": ["tadm-operations-ops-empty"],
  "ops-overlay": ["tadm-operations-ops-overlay"],
  "ops-modal": ["tadm-operations-ops-modal"],
  "ops-form": ["tadm-operations-ops-form"],
  "ops-form-grid": ["tadm-operations-ops-form-grid"],
  "ops-nav": ["tadm-operations-ops-nav"],
  "ops-nav-top": ["tadm-operations-ops-nav-top"],
  "ops-brand": ["tadm-operations-ops-brand"],
  "ops-nav-controls": ["tadm-operations-ops-nav-controls"],
  "ops-nav-links": ["tadm-operations-ops-nav-links"],
  "ops-mobile-toggle": ["tadm-operations-ops-mobile-toggle"],
  "ops-pos-grid": ["tadm-operations-ops-pos-grid"],
  "ops-pos-total": ["tadm-operations-ops-pos-total"],
  "ops-pos-qty": ["tadm-operations-ops-pos-qty"],
  "ops-danger": ["tadm-operations-ops-danger"],
  "ops-password": ["tadm-operations-ops-password"],
  "b2b-container-b2b": ["tadm-b2bprofiles-b2b-container-b2b"],
  "b2b-header-b2b": ["tadm-b2bprofiles-b2b-header-b2b"],
  "heading-b2b": ["tadm-b2bprofiles-heading-b2b"],
  "add-btn-b2b": ["tadm-b2bprofiles-add-btn-b2b"],
  "table-wrap-b2b": ["tadm-b2bprofiles-table-wrap-b2b"],
  "customers-table-b2b": ["tadm-b2bprofiles-customers-table-b2b"],
  "table-th-b2b": ["tadm-b2bprofiles-table-th-b2b"],
  "table-td-b2b": ["tadm-b2bprofiles-table-td-b2b"],
  "empty-b2b": ["tadm-b2bprofiles-empty-b2b"],
  "action-btn-b2b": ["tadm-b2bprofiles-action-btn-b2b"],
  "delete-btn-b2b": ["tadm-b2bprofiles-delete-btn-b2b"],
  "popup-overlay-b2b": ["tadm-b2bprofiles-popup-overlay-b2b"],
  "popup-box-b2b": ["tadm-b2bprofiles-popup-box-b2b"],
  "popup-title-b2b": ["tadm-b2bprofiles-popup-title-b2b"],
  "popup-close-b2b": ["tadm-b2bprofiles-popup-close-b2b"],
  "popup-input-b2b": ["tadm-b2bprofiles-popup-input-b2b"],
  "submit-btn-b2b": ["tadm-b2bprofiles-submit-btn-b2b"],
  "popup-success-b2b": ["tadm-b2bprofiles-popup-success-b2b"]
})[name] || ["tadm-b2bprofiles-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const B2BProfiles = () => {
  const [b2bCustomers, setB2bCustomers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const popupRef = useRef(null);
  useEffect(() => {
    fetch(`${API_BASE}/api/b2b-customers`).then(res => res.json()).then(data => setB2bCustomers(data)).catch(() => {});
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          city,
          password
        })
      });
      const data = await res.json();
      if (res.ok) {
        setB2bCustomers(prev => [...prev, data.user]);
        setPopupMessage('Successfully added the new customer');
        setShowPopup(false);
        setName('');
        setEmail('');
        setMobile('');
        setCity('');
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
  const handleClickOutside = e => {
    if (popupRef.current && !popupRef.current.contains(e.target)) setShowPopup(false);
  };
  useEffect(() => {
    if (showPopup) document.addEventListener('mousedown', handleClickOutside);else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);
  return <div className={portalClass("b2b-container-b2b")}>
      <div className={portalClass("b2b-header-b2b")}>
        <h2 className={portalClass("heading-b2b")}>B2B Customers</h2>
        <button className={portalClass("add-btn-b2b")} onClick={() => setShowPopup(true)}>Add New Customer</button>
      </div>

      <div className={portalClass("table-wrap-b2b")}>
        <table className={portalClass("customers-table-b2b")}>
          <thead className="tadm-b2bprofiles-node-0">
            <tr className="tadm-b2bprofiles-node-1">
              <th className={portalClass("table-th-b2b")}>Name</th>
              <th className={portalClass("table-th-b2b")}>Email</th>
              <th className={portalClass("table-th-b2b")}>Mobile</th>
              <th className={portalClass("table-th-b2b")}>City</th> {}
              <th className={portalClass("table-th-b2b")}>Actions</th>
            </tr>
          </thead>
          <tbody className="tadm-b2bprofiles-node-2">
            {b2bCustomers.map(customer => <tr key={customer.id} className="tadm-b2bprofiles-node-3">
                <td className={portalClass("table-td-b2b")}>{customer.name}</td>
                <td className={portalClass("table-td-b2b")}>{customer.email}</td>
                <td className={portalClass("table-td-b2b")}>{customer.mobile}</td>
                <td className={portalClass("table-td-b2b")}>{customer.city || '-'}</td> {}
                <td className={portalClass("table-td-b2b")}>
                  <button className={portalClass("action-btn-b2b")}>Change Password</button>
                  <button className={portalClass("delete-btn-b2b")}>Delete</button>
                </td>
              </tr>)}
            {b2bCustomers.length === 0 && <tr className="tadm-b2bprofiles-node-4">
                <td className={portalClass("table-td-b2b empty-b2b")} colSpan="5">No customers yet</td>
              </tr>}
          </tbody>
        </table>
      </div>

      {showPopup && <div className={portalClass("popup-overlay-b2b")}>
          <div className={portalClass("popup-box-b2b")} ref={popupRef}>
            <div className={portalClass("popup-close-b2b")} onClick={() => setShowPopup(false)}>×</div>
            <h3 className={portalClass("popup-title-b2b")}>Add New User</h3>
            <input className={portalClass("popup-input-b2b")} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input className={portalClass("popup-input-b2b")} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className={portalClass("popup-input-b2b")} type="tel" placeholder="Mobile Number" maxLength="10" value={mobile} onChange={e => setMobile(e.target.value)} />
            
            {}
            <input className={portalClass("popup-input-b2b")} type="text" placeholder="City / Location" value={city} onChange={e => setCity(e.target.value)} />
            
            <input className={portalClass("popup-input-b2b")} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <input className={portalClass("popup-input-b2b")} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <button className={portalClass("submit-btn-b2b")} onClick={handleAddCustomer}>Submit</button>
          </div>
        </div>}

      {popupMessage && <div className={portalClass("popup-success-b2b")}>{popupMessage}</div>}
    </div>;
};
export default B2BProfiles;
