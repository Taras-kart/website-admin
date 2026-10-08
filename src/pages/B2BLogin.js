import React, { useRef, useEffect } from 'react';
import './B2BLogin.css';
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
  "ops-password": ["tadm-operations-ops-password"]
})[name] || ["tadm-b2blogin-" + name]).join(' ');
const B2BLogin = ({
  name,
  email,
  mobile,
  password,
  confirmPassword,
  setName,
  setEmail,
  setMobile,
  setPassword,
  setConfirmPassword,
  handleSubmit,
  onClose
}) => {
  const popupRef = useRef(null);
  const handleClickOutside = e => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return <div className={portalClass("popup-overlay")}>
      <div className={portalClass("popup-box")} ref={popupRef}>
        <div className={portalClass("popup-close")} onClick={onClose}>×</div>
        <h3 className="tadm-b2blogin-node-0">Add New User</h3>

        <label className="tadm-b2blogin-node-1">Full Name</label>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="tadm-b2blogin-node-2" />

        <label className="tadm-b2blogin-node-3">Email</label>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="tadm-b2blogin-node-4" />

        <label className="tadm-b2blogin-node-5">Mobile Number</label>
        <input type="tel" placeholder="Mobile Number" maxLength="10" value={mobile} onChange={e => setMobile(e.target.value)} className="tadm-b2blogin-node-6" />

        <label className="tadm-b2blogin-node-7">Password</label>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="tadm-b2blogin-node-8" />

        <label className="tadm-b2blogin-node-9">Confirm Password</label>
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="tadm-b2blogin-node-10" />

        <button className={portalClass("submit-btn")} onClick={handleSubmit}>Submit</button>
      </div>
    </div>;
};
export default B2BLogin;
