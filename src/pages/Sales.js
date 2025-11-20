// D:\shopping-admin\src\pages\Sales.js
import React, { useEffect, useMemo, useState } from 'react';
import './Sales.css';
import Navbar from './NavbarAdmin';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const STATUSES = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'];

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sales/web`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getPayable = (s) => {
    if (s && s.totals && s.totals.payable != null) return Number(s.totals.payable);
    if (s && s.total != null) return Number(s.total);
    if (Array.isArray(s?.items) && s.items.length) {
      return s.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
    }
    return 0;
  };

  const getCustomerLabel = (s) => {
    const name = s?.customer_name && String(s.customer_name).trim();
    if (name) return name;
    if (s?.branch_id) return `Branch #${s.branch_id}`;
    return '-';
  };

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null;
    const toTs = to ? new Date(to + 'T23:59:59').getTime() : null;
    return sales.filter((s) => {
      const okStatus = status === 'ALL' ? true : String(s.status || '').toUpperCase() === status;
      const created = s.created_at ? new Date(s.created_at).getTime() : null;
      const okFrom = fromTs ? (created ? created >= fromTs : true) : true;
      const okTo = toTs ? (created ? created <= toTs : true) : true;
      const t = s.totals || {};
      const hay = [
        s.id,
        getCustomerLabel(s),
        s.customer_email,
        s.customer_mobile,
        s.status,
        s.payment_status,
        t?.payable,
        getPayable(s)
      ]
        .join(' ')
        .toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okStatus && okFrom && okTo && okQ;
    });
  }, [sales, status, q, from, to]);

  const grand = useMemo(() => {
    return filtered.reduce((acc, s) => acc + getPayable(s), 0);
  }, [filtered]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`${API_BASE}/api/sales/web/${id}`);
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toFixed(2)}`;

  return (
    <div className="orders-screen">
      <Navbar />
      <div className="orders-layout">
        <div className="orders-header">
          <div className="orders-header-main">
            <h1 className="orders-header-title">Orders</h1>
            <p className="orders-header-subtitle">Track, review and manage every purchase in one place</p>
          </div>
          <div className="orders-header-actions">
            <button className="orders-btn-refresh" onClick={fetchSales}>
              <span className="orders-btn-refresh-icon" />
              <span>Refresh list</span>
            </button>
          </div>
        </div>

        <div className="orders-filters-card">
          <div className="orders-filters-top">
            <span className="orders-filters-title">Filters</span>
            <span className="orders-filters-subtitle">Refine by status, date range or customer details</span>
          </div>
          <div className="orders-filters-grid">
            <div className="orders-filter-group">
              <label className="orders-filter-label">Status</label>
              <select
                className="orders-filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="orders-filter-group orders-filter-group-wide">
              <label className="orders-filter-label">Search</label>
              <div className="orders-filter-search-wrap">
                <span className="orders-filter-search-icon" />
                <input
                  className="orders-filter-input"
                  placeholder="Search by order id, name, email or mobile"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="orders-filter-group">
              <label className="orders-filter-label">From</label>
              <input
                className="orders-filter-input"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="orders-filter-group">
              <label className="orders-filter-label">To</label>
              <input
                className="orders-filter-input"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="orders-summary-bar">
          <div className="orders-summary-section">
            <span className="orders-summary-label">Orders</span>
            <span className="orders-summary-value">
              {loading ? 'Loading…' : `${filtered.length} order${filtered.length === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="orders-summary-section">
            <span className="orders-summary-label">Total payable</span>
            <span className="orders-summary-value orders-summary-value-em">
              {fmt(grand)}
            </span>
          </div>
        </div>

        <div className="orders-table-card">
          {loading ? (
            <div className="orders-loader">
              <div className="orders-spinner" />
              <span className="orders-loader-text">Fetching latest orders</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="orders-empty-state">
              <div className="orders-empty-icon" />
              <h3 className="orders-empty-title">No orders found</h3>
              <p className="orders-empty-text">
                Try adjusting your filters or clearing the search to see more orders.
              </p>
            </div>
          ) : (
            <div className="orders-table-scroller">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th className="orders-table-head">Order</th>
                    <th className="orders-table-head">Placed at</th>
                    <th className="orders-table-head">Status</th>
                    <th className="orders-table-head">Payment</th>
                    <th className="orders-table-head">Customer</th>
                    <th className="orders-table-head">Mobile</th>
                    <th className="orders-table-head">Email</th>
                    <th className="orders-table-head align-right">Payable</th>
                    <th className="orders-table-head align-right" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="orders-table-row">
                      <td className="orders-table-cell">
                        <span className="orders-order-id">#{s.id}</span>
                      </td>
                      <td className="orders-table-cell">
                        <span className="orders-table-text-soft">
                          {s.created_at ? new Date(s.created_at).toLocaleString() : '-'}
                        </span>
                      </td>
                      <td className="orders-table-cell">
                        <span
                          className={`orders-status-pill orders-status-${String(
                            s.status || ''
                          ).toLowerCase()}`}
                        >
                          {String(s.status || '').toUpperCase() || '-'}
                        </span>
                      </td>
                      <td className="orders-table-cell">
                        <span className="orders-payment-chip">
                          {String(s.payment_status || 'COD').toUpperCase()}
                        </span>
                      </td>
                      <td className="orders-table-cell">
                        <span className="orders-table-text-main">{getCustomerLabel(s)}</span>
                      </td>
                      <td className="orders-table-cell">
                        <span className="orders-table-text-main">
                          {s.customer_mobile || '-'}
                        </span>
                      </td>
                      <td className="orders-table-cell">
                        <span className="orders-table-text-soft">
                          {s.customer_email || '-'}
                        </span>
                      </td>
                      <td className="orders-table-cell align-right">
                        <span className="orders-amount">{fmt(getPayable(s))}</span>
                      </td>
                      <td className="orders-table-cell align-right">
                        <button
                          className="orders-btn-small"
                          onClick={() => openDetail(s.id)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detailLoading && (
        <div className="orders-modal-backdrop">
          <div className="orders-modal orders-modal-center">
            <div className="orders-loader">
              <div className="orders-spinner" />
              <span className="orders-loader-text">Loading order details</span>
            </div>
          </div>
        </div>
      )}

      {detail && !detailLoading && (
        <div className="orders-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="orders-modal orders-modal-detail" onClick={(e) => e.stopPropagation()}>
            <div className="orders-modal-header">
              <div>
                <h3 className="orders-modal-title">Order #{detail?.sale?.id}</h3>
                <p className="orders-modal-subtitle">
                  Placed on{' '}
                  {detail?.sale?.created_at
                    ? new Date(detail.sale.created_at).toLocaleString()
                    : '-'}
                </p>
              </div>
              <div className="orders-modal-header-actions">
                <span
                  className={`orders-status-pill orders-status-${String(
                    detail?.sale?.status || ''
                  ).toLowerCase()} orders-status-pill-lg`}
                >
                  {String(detail?.sale?.status || '').toUpperCase() || '-'}
                </span>
                <button
                  className="orders-btn-small orders-btn-ghost"
                  onClick={() => setDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="orders-meta-grid">
              <div className="orders-meta-item">
                <div className="orders-meta-label">Payment</div>
                <div className="orders-meta-value">
                  {String(detail?.sale?.payment_status || 'COD').toUpperCase()}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Customer</div>
                <div className="orders-meta-value">
                  {getCustomerLabel(detail?.sale)}
                  {detail?.sale?.customer_mobile ? ` · ${detail?.sale?.customer_mobile}` : ''}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Email</div>
                <div className="orders-meta-value">
                  {detail?.sale?.customer_email || '-'}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Amount payable</div>
                <div className="orders-meta-value orders-meta-value-strong">
                  {fmt(detail?.sale?.totals?.payable ?? detail?.sale?.total)}
                </div>
              </div>
            </div>

            {detail?.sale?.shipping_address && (
              <div className="orders-shipping-card">
                <div className="orders-shipping-header">
                  <h4 className="orders-shipping-title">Shipping address</h4>
                  <span className="orders-shipping-tag">Delivery</span>
                </div>
                <div className="orders-shipping-body">
                  <p>{detail.sale.shipping_address.line1}</p>
                  {detail.sale.shipping_address.line2 && (
                    <p>{detail.sale.shipping_address.line2}</p>
                  )}
                  <p>
                    {detail.sale.shipping_address.city},{' '}
                    {detail.sale.shipping_address.state} -{' '}
                    {detail.sale.shipping_address.pincode}
                  </p>
                </div>
              </div>
            )}

            <div className="orders-items-header">
              <div>
                <p className="orders-items-title">Items in this order</p>
                <p className="orders-items-subtitle">
                  {Array.isArray(detail?.items) ? detail.items.length : 0} item
                  {Array.isArray(detail?.items) && detail.items.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="orders-items-grid">
              {Array.isArray(detail?.items) && detail.items.length > 0 ? (
                detail.items.map((it, i) => (
                  <div className="orders-item-card" key={`${it.variant_id}-${i}`}>
                    <div className="orders-item-media">
                      {it.image_url ? (
                        <img src={it.image_url} alt="" />
                      ) : (
                        <div className="orders-item-placeholder" />
                      )}
                    </div>
                    <div className="orders-item-main">
                      <div className="orders-item-top">
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Variant</span>
                          <span className="orders-item-value">#{it.variant_id}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Size</span>
                          <span className="orders-item-value">{it.size || '-'}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Colour</span>
                          <span className="orders-item-value">{it.colour || '-'}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">EAN</span>
                          <span className="orders-item-value orders-text-soft">
                            {it.ean_code || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="orders-item-pricing">
                        <div className="orders-item-qty">x{it.qty}</div>
                        <div className="orders-item-price">{fmt(it.price)}</div>
                        {it.mrp != null && Number(it.mrp) > 0 ? (
                          <div className="orders-item-mrp">MRP {fmt(it.mrp)}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="orders-empty-inline">No items in this order</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
