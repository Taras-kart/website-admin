import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AdminAuth';
import './Sales.css';
import './B2BOrders.css';
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
  "orders-screen": ["tadm-sales-orders-screen"],
  "orders-layout": ["tadm-sales-orders-layout"],
  "orders-header": ["tadm-sales-orders-header"],
  "orders-header-main": ["tadm-sales-orders-header-main"],
  "orders-header-title": ["tadm-sales-orders-header-title"],
  "orders-header-subtitle": ["tadm-sales-orders-header-subtitle"],
  "orders-header-actions": ["tadm-sales-orders-header-actions"],
  "orders-btn-refresh": ["tadm-sales-orders-btn-refresh"],
  "orders-btn-refresh-icon": ["tadm-sales-orders-btn-refresh-icon"],
  "orders-filters-card": ["tadm-sales-orders-filters-card"],
  "orders-filters-top": ["tadm-sales-orders-filters-top"],
  "orders-filters-title": ["tadm-sales-orders-filters-title"],
  "orders-filters-subtitle": ["tadm-sales-orders-filters-subtitle"],
  "orders-filters-grid": ["tadm-sales-orders-filters-grid"],
  "orders-filter-group": ["tadm-sales-orders-filter-group"],
  "orders-filter-group-wide": ["tadm-sales-orders-filter-group-wide"],
  "orders-filter-label": ["tadm-sales-orders-filter-label"],
  "orders-filter-select": ["tadm-sales-orders-filter-select"],
  "orders-filter-input": ["tadm-sales-orders-filter-input"],
  "orders-filter-search-wrap": ["tadm-sales-orders-filter-search-wrap"],
  "orders-filter-search-icon": ["tadm-sales-orders-filter-search-icon"],
  "orders-summary-bar": ["tadm-sales-orders-summary-bar"],
  "orders-summary-section": ["tadm-sales-orders-summary-section"],
  "orders-summary-label": ["tadm-sales-orders-summary-label"],
  "orders-summary-value": ["tadm-sales-orders-summary-value"],
  "orders-summary-value-em": ["tadm-sales-orders-summary-value-em"],
  "orders-table-card": ["tadm-sales-orders-table-card"],
  "orders-table-scroller": ["tadm-sales-orders-table-scroller"],
  "orders-table": ["tadm-sales-orders-table"],
  "orders-table-head": ["tadm-sales-orders-table-head"],
  "align-right": ["tadm-sales-align-right"],
  "orders-table-row": ["tadm-sales-orders-table-row"],
  "orders-table-cell": ["tadm-sales-orders-table-cell"],
  "orders-table-text-main": ["tadm-sales-orders-table-text-main"],
  "orders-table-text-soft": ["tadm-sales-orders-table-text-soft"],
  "orders-order-id": ["tadm-sales-orders-order-id"],
  "orders-amount": ["tadm-sales-orders-amount"],
  "orders-status-pill": ["tadm-sales-orders-status-pill"],
  "orders-status-pill-lg": ["tadm-sales-orders-status-pill-lg"],
  "orders-status-placed": ["tadm-sales-orders-status-placed"],
  "orders-status-confirmed": ["tadm-sales-orders-status-confirmed"],
  "orders-status-packed": ["tadm-sales-orders-status-packed"],
  "orders-status-shipped": ["tadm-sales-orders-status-shipped"],
  "orders-status-cancelled": ["tadm-sales-orders-status-cancelled"],
  "orders-payment-chip": ["tadm-sales-orders-payment-chip"],
  "orders-btn-small": ["tadm-sales-orders-btn-small", "tadm-b2borders-orders-btn-small"],
  "orders-btn-ghost": ["tadm-sales-orders-btn-ghost"],
  "orders-loader": ["tadm-sales-orders-loader"],
  "orders-loader-text": ["tadm-sales-orders-loader-text"],
  "orders-spinner": ["tadm-sales-orders-spinner"],
  "orders-empty-state": ["tadm-sales-orders-empty-state"],
  "orders-empty-icon": ["tadm-sales-orders-empty-icon"],
  "orders-empty-title": ["tadm-sales-orders-empty-title"],
  "orders-empty-text": ["tadm-sales-orders-empty-text"],
  "orders-empty-inline": ["tadm-sales-orders-empty-inline"],
  "orders-modal-backdrop": ["tadm-sales-orders-modal-backdrop"],
  "orders-modal": ["tadm-sales-orders-modal"],
  "orders-modal-center": ["tadm-sales-orders-modal-center"],
  "orders-modal-detail": ["tadm-sales-orders-modal-detail"],
  "orders-modal-header": ["tadm-sales-orders-modal-header"],
  "orders-modal-title": ["tadm-sales-orders-modal-title"],
  "orders-modal-subtitle": ["tadm-sales-orders-modal-subtitle"],
  "orders-modal-header-actions": ["tadm-sales-orders-modal-header-actions"],
  "orders-meta-grid": ["tadm-sales-orders-meta-grid"],
  "orders-meta-item": ["tadm-sales-orders-meta-item"],
  "orders-meta-label": ["tadm-sales-orders-meta-label"],
  "orders-meta-value": ["tadm-sales-orders-meta-value"],
  "orders-meta-value-strong": ["tadm-sales-orders-meta-value-strong"],
  "orders-progress-card": ["tadm-sales-orders-progress-card"],
  "orders-progress-header": ["tadm-sales-orders-progress-header"],
  "orders-progress-header-main": ["tadm-sales-orders-progress-header-main"],
  "orders-progress-title": ["tadm-sales-orders-progress-title"],
  "orders-progress-header-sub": ["tadm-sales-orders-progress-header-sub"],
  "orders-progress-status-pill": ["tadm-sales-orders-progress-status-pill"],
  "orders-timeline": ["tadm-sales-orders-timeline"],
  "orders-timeline-line": ["tadm-sales-orders-timeline-line"],
  "orders-timeline-cancelled": ["tadm-sales-orders-timeline-cancelled"],
  "orders-timeline-steps": ["tadm-sales-orders-timeline-steps"],
  "orders-timeline-step": ["tadm-sales-orders-timeline-step"],
  "orders-timeline-dot": ["tadm-sales-orders-timeline-dot"],
  "orders-timeline-dot-done": ["tadm-sales-orders-timeline-dot-done"],
  "orders-timeline-dot-active": ["tadm-sales-orders-timeline-dot-active"],
  "orders-timeline-dot-upcoming": ["tadm-sales-orders-timeline-dot-upcoming"],
  "orders-timeline-label": ["tadm-sales-orders-timeline-label"],
  "orders-timeline-caption": ["tadm-sales-orders-timeline-caption"],
  "orders-progress-footer": ["tadm-sales-orders-progress-footer"],
  "orders-progress-meta": ["tadm-sales-orders-progress-meta"],
  "orders-progress-meta-label": ["tadm-sales-orders-progress-meta-label"],
  "orders-progress-meta-value": ["tadm-sales-orders-progress-meta-value"],
  "orders-progress-meta-actions": ["tadm-sales-orders-progress-meta-actions"],
  "orders-doc-buttons": ["tadm-sales-orders-doc-buttons"],
  "orders-shipping-card": ["tadm-sales-orders-shipping-card"],
  "orders-shipping-header": ["tadm-sales-orders-shipping-header"],
  "orders-shipping-title": ["tadm-sales-orders-shipping-title"],
  "orders-shipping-tag": ["tadm-sales-orders-shipping-tag"],
  "orders-shipping-body": ["tadm-sales-orders-shipping-body"],
  "orders-items-header": ["tadm-sales-orders-items-header"],
  "orders-items-title": ["tadm-sales-orders-items-title"],
  "orders-items-subtitle": ["tadm-sales-orders-items-subtitle"],
  "orders-items-grid": ["tadm-sales-orders-items-grid"],
  "orders-item-card": ["tadm-sales-orders-item-card"],
  "orders-item-media": ["tadm-sales-orders-item-media"],
  "orders-item-placeholder": ["tadm-sales-orders-item-placeholder"],
  "orders-item-main": ["tadm-sales-orders-item-main"],
  "orders-item-top": ["tadm-sales-orders-item-top"],
  "orders-item-meta": ["tadm-sales-orders-item-meta"],
  "orders-item-label": ["tadm-sales-orders-item-label"],
  "orders-item-value": ["tadm-sales-orders-item-value"],
  "orders-item-pricing": ["tadm-sales-orders-item-pricing"],
  "orders-item-qty": ["tadm-sales-orders-item-qty"],
  "orders-item-price": ["tadm-sales-orders-item-price"],
  "orders-item-mrp": ["tadm-sales-orders-item-mrp"],
  "orders-text-soft": ["tadm-sales-orders-text-soft"],
  "b2b-status-b2b_pending": ["tadm-b2borders-b2b-status-b2b_pending"],
  "b2b-status-approved": ["tadm-b2borders-b2b-status-approved"],
  "b2b-status-dispatched": ["tadm-b2borders-b2b-status-dispatched"],
  "b2b-status-delivered": ["tadm-b2borders-b2b-status-delivered"],
  "b2b-status-cancelled": ["tadm-b2borders-b2b-status-cancelled"],
  "b2b-action-row": ["tadm-b2borders-b2b-action-row"],
  "b2b-btn-danger": ["tadm-b2borders-b2b-btn-danger"],
  "b2b-btn-success": ["tadm-b2borders-b2b-btn-success"],
  "b2b-btn-blue": ["tadm-b2borders-b2b-btn-blue"],
  "b2b-btn-success-solid": ["tadm-b2borders-b2b-btn-success-solid"]
})[name] || ["tadm-b2borders-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
export default function B2BOrders() {
  const {
    token
  } = useAuth();
  const [b2bSales, setB2bSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
  }, [token]);
  const fetchB2BSales = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/sales/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.message || 'Unable to load wholesale orders.');
      const filteredData = (Array.isArray(data) ? data : []).filter(order => order.payment_method === 'B2B_BULK');
      setB2bSales(filteredData);
    } catch (error) {
      setLoadError(error.message);
      setB2bSales([]);
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    fetchB2BSales();
  }, [fetchB2BSales]);
  const handleUpdateStatus = async (saleId, newStatus, newPaymentStatus) => {
    if (!window.confirm(`Are you sure you want to update this order to ${newStatus || newPaymentStatus}?`)) return;
    setActionLoading(saleId);
    try {
      const res = await fetch(`${API_BASE}/api/sales/web/b2b-update-status`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          sale_id: saleId,
          new_status: newStatus,
          new_payment_status: newPaymentStatus
        })
      });
      if (res.ok) {
        fetchB2BSales();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating order');
    } finally {
      setActionLoading(null);
    }
  };
  const openOrderDetails = async sale => {
    setSelectedOrder(sale);
    setItemsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sales/admin/${sale.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setOrderItems(data.items || []);
    } catch (err) {
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };
  const fmt = n => `₹${Number(n || 0).toFixed(2)}`;
  return <div className={portalClass("orders-screen")}>
      
      <div className={portalClass("orders-layout")}>
        {loadError && <div role="alert" className={portalClass("ops-alert")}>{loadError}</div>}
        
        <div className={portalClass("orders-header")}>
          <div className={portalClass("orders-header-main")}>
            <h1 className={portalClass("orders-header-title")}>Wholesale Inquiries</h1>
            <p className={portalClass("orders-header-subtitle")}>Review, approve, and manually manage B2B bulk orders</p>
          </div>
          <div className={portalClass("orders-header-actions")}>
            <button className={portalClass("orders-btn-refresh")} onClick={fetchB2BSales}>
              <span className={portalClass("orders-btn-refresh-icon")} />
              <span className="tadm-b2borders-node-0">Refresh list</span>
            </button>
          </div>
        </div>

        <div className={portalClass("orders-summary-bar")}>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Pending Inquiries</span>
            <span className={portalClass("orders-summary-value")}>{loading ? 'Loading…' : `${b2bSales.filter(s => s.status === 'B2B_PENDING').length} order(s)`}</span>
          </div>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Total B2B Value</span>
            <span className={portalClass("orders-summary-value orders-summary-value-em")}>
              {fmt(b2bSales.reduce((acc, s) => acc + Number(s.total || s.totals?.payable || 0), 0))}
            </span>
          </div>
        </div>

        <div className={portalClass("orders-table-card")}>
          {loading ? <div className={portalClass("orders-loader")}>
              <div className={portalClass("orders-spinner")} />
              <span className={portalClass("orders-loader-text")}>Fetching wholesale orders</span>
            </div> : b2bSales.length === 0 ? <div className={portalClass("orders-empty-state")}>
              <div className={portalClass("orders-empty-icon")} />
              <h3 className={portalClass("orders-empty-title")}>No B2B orders found</h3>
              <p className={portalClass("orders-empty-text")}>Wholesale inquiries will appear here once placed.</p>
            </div> : <div className={portalClass("orders-table-scroller")}>
              <table className={portalClass("orders-table")}>
                <thead className="tadm-b2borders-node-1">
                  <tr className="tadm-b2borders-node-2">
                    <th className={portalClass("orders-table-head")}>Order ID</th>
                    <th className={portalClass("orders-table-head")}>Customer</th>
                    <th className={portalClass("orders-table-head align-right")}>Amount</th>
                    <th className={portalClass("orders-table-head")}>Status</th>
                    <th className={portalClass("orders-table-head")}>Payment</th>
                    <th className={portalClass("orders-table-head")}>View</th>
                    <th className={portalClass("orders-table-head")}>Manual Actions</th>
                  </tr>
                </thead>
                <tbody className="tadm-b2borders-node-3">
                  {b2bSales.map(sale => <tr key={sale.id} className={portalClass("orders-table-row")}>
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass("orders-order-id")}>#{sale.id.slice(0, 8)}</span>
                        <div className={portalClass("orders-table-text-soft")}>{new Date(sale.created_at).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td className={portalClass("orders-table-cell")}>
                        <div className={portalClass("orders-table-text-main")}>{sale.customer_name || 'B2B User'}</div>
                        <div className={portalClass("orders-table-text-soft")}>{sale.customer_email}</div>
                      </td>
                      <td className={portalClass("orders-table-cell align-right")}>
                        <span className={portalClass("orders-amount")}>{fmt(sale.total || sale.totals?.payable)}</span>
                      </td>
                      
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass(`orders-status-pill b2b-status-${(sale.status || '').toLowerCase()}`)}>
                          {sale.status}
                        </span>
                      </td>
                      
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass("orders-payment-chip")}>
                          {sale.payment_status}
                        </span>
                      </td>

                      <td className={portalClass("orders-table-cell")}>
                        <button className={portalClass("orders-btn-small")} onClick={() => openOrderDetails(sale)}>
                          View Items
                        </button>
                      </td>

                      <td className={portalClass("orders-table-cell")}>
                        {actionLoading === sale.id ? <span className={portalClass("orders-table-text-soft")}>Updating...</span> : <div className={portalClass("b2b-action-row")}>
                            {sale.status === 'B2B_PENDING' && <>
                                <button className={portalClass("orders-btn-small b2b-btn-success")} onClick={() => handleUpdateStatus(sale.id, 'APPROVED', null)}>Approve</button>
                                <button className={portalClass("orders-btn-small b2b-btn-danger")} onClick={() => handleUpdateStatus(sale.id, 'CANCELLED', 'FAILED')}>Decline</button>
                              </>}
                            
                            {sale.status === 'APPROVED' && sale.payment_status === 'PENDING' && <button className={portalClass("orders-btn-small b2b-btn-success")} onClick={() => handleUpdateStatus(sale.id, null, 'PAID')}>Mark Paid</button>}

                            {sale.status === 'APPROVED' && sale.payment_status === 'PAID' && <button className={portalClass("orders-btn-small b2b-btn-blue")} onClick={() => handleUpdateStatus(sale.id, 'DISPATCHED', null)}>Dispatch</button>}
                            
                            {sale.status === 'DISPATCHED' && <button className={portalClass("orders-btn-small b2b-btn-success-solid")} onClick={() => handleUpdateStatus(sale.id, 'DELIVERED', null)}>Delivered</button>}
                          </div>}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>}
        </div>
      </div>

      {}
      {selectedOrder && <div className={portalClass("orders-modal-backdrop")} onClick={closeOrderDetails}>
          <div className={portalClass("orders-modal")} onClick={e => e.stopPropagation()} style={{
        maxWidth: '700px'
      }}>
            <div className={portalClass("orders-modal-header")}>
              <div className="tadm-b2borders-node-4">
                <h3 className={portalClass("orders-modal-title")}>Bulk Request #{selectedOrder.id.slice(0, 8)}</h3>
                <p className={portalClass("orders-modal-subtitle")}>{selectedOrder.customer_name} - {selectedOrder.customer_email}</p>
              </div>
              <button className={portalClass("orders-btn-small orders-btn-ghost")} onClick={closeOrderDetails}>Close</button>
            </div>

            <div className={portalClass("orders-items-grid")} style={{
          marginTop: '20px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
              {itemsLoading ? <div className={portalClass("orders-table-text-soft")}>Loading items...</div> : orderItems.length > 0 ? orderItems.map((it, i) => <div className={portalClass("orders-item-card")} key={i}>
                    <div className={portalClass("orders-item-media")}>
                      {it.image_url ? <img src={it.image_url} alt="product" className="tadm-b2borders-node-5" /> : <div className={portalClass("orders-item-placeholder")} />}
                    </div>
                    <div className={portalClass("orders-item-main")}>
                      <div className={portalClass("orders-item-top")}>
                        <div className={portalClass("orders-item-meta")}><span className={portalClass("orders-item-label")}>Name</span><span className={portalClass("orders-item-value")}>{it.product_name || '-'}</span></div>
                        <div className={portalClass("orders-item-meta")}><span className={portalClass("orders-item-label")}>Size/Color</span><span className={portalClass("orders-item-value")}>{it.size || '-'} / {it.colour || '-'}</span></div>
                      </div>
                      <div className={portalClass("orders-item-pricing")}>
                        <div className={portalClass("orders-item-qty")} style={{
                  color: "#42536a",
                  fontWeight: 'bold'
                }}>Qty: {it.qty}</div>
                        <div className={portalClass("orders-item-price")}>{fmt(it.price)}/ea</div>
                      </div>
                    </div>
                  </div>) : <div className={portalClass("orders-table-text-soft")}>No items found.</div>}
            </div>
          </div>
        </div>}

    </div>;
}
