import React, { useState } from 'react';
import './HomePage.css';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import DeleteProduct from './DeleteProduct';
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
  "admin-homepage": ["tadm-homepage-admin-homepage"],
  "admin-body": ["tadm-homepage-admin-body"],
  "admin-sidebar": ["tadm-homepage-admin-sidebar"],
  "sidebar-button": ["tadm-homepage-sidebar-button"],
  "active": ["tadm-homepage-active"],
  "admin-main": ["tadm-homepage-admin-main"]
})[name] || ["tadm-homepage-" + name]).join(' ');
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Add');
  const renderContent = () => {
    if (activeTab === 'Add') return <AddProduct />;
    if (activeTab === 'Update') return <UpdateProduct />;
    if (activeTab === 'Delete') return <DeleteProduct />;
    return null;
  };
  return <div className={portalClass("admin-homepage")}>
      
      <div className={portalClass("admin-body")}>
        <div className={portalClass("admin-sidebar")}>
          <button className={portalClass(`sidebar-button ${activeTab === 'Add' ? 'active' : ''}`)} onClick={() => setActiveTab('Add')}>
            <span className="tadm-homepage-node-0">Add Product</span>
          </button>

          <button className={portalClass(`sidebar-button ${activeTab === 'Update' ? 'active' : ''}`)} onClick={() => setActiveTab('Update')}>
            <span className="tadm-homepage-node-1">Update Product</span>
          </button>

          <button className={portalClass(`sidebar-button ${activeTab === 'Delete' ? 'active' : ''}`)} onClick={() => setActiveTab('Delete')}>
            <span className="tadm-homepage-node-2">Delete Product</span>
          </button>
        </div>
        <div className={portalClass("admin-main")}>{renderContent()}</div>
      </div>
    </div>;
};
export default HomePage;
