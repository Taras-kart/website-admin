import React, { useEffect, useState } from 'react';
import './B2CProfiles.css';
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
  "b2c-container": ["tadm-b2cprofiles-b2c-container"],
  "b2c-header": ["tadm-b2cprofiles-b2c-header"],
  "b2c-title": ["tadm-b2cprofiles-b2c-title"],
  "b2c-table-wrap": ["tadm-b2cprofiles-b2c-table-wrap"],
  "b2c-table": ["tadm-b2cprofiles-b2c-table"],
  "b2c-empty": ["tadm-b2cprofiles-b2c-empty"]
})[name] || ["tadm-b2cprofiles-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const B2CProfiles = () => {
  const [b2cCustomers, setB2cCustomers] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/b2c-customers`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setB2cCustomers(data);
      }
    }).catch(() => {});
  }, []);
  return <div className={portalClass("b2c-container")}>
      <div className={portalClass("b2c-header")}>
        <h2 className={portalClass("b2c-title")}>B2C Customers</h2>
      </div>
      <div className={portalClass("b2c-table-wrap")}>
        <table className={portalClass("b2c-table")}>
          <thead className="tadm-b2cprofiles-node-0">
            <tr className="tadm-b2cprofiles-node-1">
              <th className="tadm-b2cprofiles-node-2">Full Name</th>
              <th className="tadm-b2cprofiles-node-3">Email</th>
              <th className="tadm-b2cprofiles-node-4">Mobile</th>
            </tr>
          </thead>
          <tbody className="tadm-b2cprofiles-node-5">
            {b2cCustomers.map(customer => <tr key={customer.id} className="tadm-b2cprofiles-node-6">
                <td className="tadm-b2cprofiles-node-7">{customer.name}</td>
                <td className="tadm-b2cprofiles-node-8">{customer.email}</td>
                <td className="tadm-b2cprofiles-node-9">{customer.mobile}</td>
              </tr>)}
            {b2cCustomers.length === 0 && <tr className="tadm-b2cprofiles-node-10">
                <td colSpan="3" className={portalClass("b2c-empty")}>No customers found</td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>;
};
export default B2CProfiles;
