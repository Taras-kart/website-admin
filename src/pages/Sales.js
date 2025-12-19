import React, { useEffect, useMemo, useState } from 'react';
import './Sales.css';
import Navbar from './NavbarAdmin';
import { useAuth } from './AdminAuth';
import OrderDetailPopup from './OrderDetailPopup';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const STATUSES = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'];
const ORDER_STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

function statusText(s) {
  return String(s || '').toUpperCase();
}

function computeStepFromLocal(orderStatus) {
  const idx = ORDER_STEPS.indexOf(orderStatus || 'PLACED');
  if (idx === -1) return 0;
  return idx;
}

function computeStepFromShiprocket(srStatus) {
  const s = statusText(srStatus);
  if (!s) return 0;
  if (s.includes('DELIVERED')) return 4;
  if (s.includes('OUT FOR DELIVERY') || s.includes('OUT_FOR_DELIVERY')) return 3;
  if (s.includes('IN TRANSIT') || s.includes('DISPATCH') || s.includes('SHIPPED') || s.includes('PICKED')) return 3;
  if (s.includes('AWB') || s.includes('PACKED') || s.includes('MANIFEST')) return 2;
  if (s.includes('CONFIRMED') || s.includes('PROCESSING') || s.includes('ACCEPTED') || s.includes('CREATED')) return 1;
  return 0;
}

function computeStepFromShipment(sh, srCore) {
  if (!sh && !srCore) return 0;
  const s = statusText(sh?.status || '');
  const sr = statusText(srCore?.current_status || '');
  const combined = `${s} ${sr}`.trim();
  if (!combined) {
    if (sh && sh.awb) return 2;
    return 1;
  }
  if (combined.includes('DELIVERED')) return 4;
  if (combined.includes('OUT FOR DELIVERY') || combined.includes('OUT_FOR_DELIVERY')) return 3;
  if (combined.includes('IN TRANSIT') || combined.includes('DISPATCH') || combined.includes('SHIPPED') || combined.includes('PICKED')) return 3;
  if (combined.includes('PACKED') || combined.includes('MANIFEST')) return 2;
  if (combined.includes('CONFIRMED') || combined.includes('PROCESSING') || combined.includes('ACCEPTED') || combined.includes('CREATED')) return 1;
  return 0;
}

function extractTrackingCore(raw) {
  if (!raw) return null;
  let core = raw;
  if (Array.isArray(core) && core.length) {
    const first = core[0];
    if (first && typeof first === 'object') {
      const key = Object.keys(first)[0];
      if (key && first[key] && first[key].tracking_data) {
        core = first[key].tracking_data;
      }
    }
  } else if (core.tracking_data) {
    core = core.tracking_data;
  }
  if (!core || typeof core !== 'object') return null;
  return core;
}

function buildTrackingSnapshot(raw) {
  const core = extractTrackingCore(raw);
  if (!core) {
    return {
      status: '',
      eddText: null,
      lastEventText: null,
      core: null
    };
  }
  const tracks = Array.isArray(core.shipment_track) ? core.shipment_track : [];
  const lastTrack = tracks.length ? tracks[tracks.length - 1] : null;
  const status =
    (lastTrack && lastTrack.current_status) ||
    core.current_status ||
    core.status ||
    '';
  const eddRaw =
    (lastTrack && lastTrack.edd) ||
    core.edd ||
    null;
  const lastEventRaw =
    (lastTrack && (lastTrack.date || lastTrack.pickup_date || lastTrack.updated_time_stamp)) ||
    core.updated_time_stamp ||
    core.last_status_time ||
    null;
  const edd = eddRaw ? new Date(eddRaw) : null;
  const lastEvent = lastEventRaw ? new Date(lastEventRaw) : null;
  return {
    status,
    eddText: edd && !Number.isNaN(edd.getTime())
      ? edd.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' })
      : null,
    lastEventText: lastEvent && !Number.isNaN(lastEvent.getTime())
      ? lastEvent.toLocaleString('en-IN')
      : null,
    core
  };
}

function buildExpectedDeliveryText(trackingSnapshot, sale, latestShipment) {
  if (trackingSnapshot && trackingSnapshot.eddText) return trackingSnapshot.eddText;
  const baseRaw =
    (latestShipment && (latestShipment.pickup_date || latestShipment.created_at)) ||
    (sale && (sale.updated_at || sale.created_at)) ||
    null;
  if (!baseRaw) return '-';
  const base = new Date(baseRaw);
  if (Number.isNaN(base.getTime())) return '-';
  base.setDate(base.getDate() + 5);
  return base.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
}

export default function Sales() {
  const { token } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      if (!token) {
        setSales([]);
        return;
      }
      const res = await fetch(`${API_BASE}/api/sales/admin`, { headers: authHeaders });
      const data = await res.json().catch(() => []);
      setSales(Array.isArray(data) ? data : []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [token]);

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
      const [saleRes, shRes] = await Promise.all([
        fetch(`${API_BASE}/api/sales/admin/${id}`, { headers: authHeaders }),
        fetch(`${API_BASE}/api/shipments/by-sale/${id}`, { headers: authHeaders })
      ]);
      const saleJson = await saleRes.json().catch(() => null);
      const shJson = await shRes.json().catch(() => []);
      const sale = saleJson && saleJson.sale ? saleJson.sale : saleJson;
      const items = Array.isArray(saleJson?.items) ? saleJson.items : [];
      const shipments = Array.isArray(shJson) ? shJson : [];
      const latestShipment = shipments.length ? shipments[shipments.length - 1] : null;
      let trackingRaw = null;
      const trackOrderId = latestShipment?.shiprocket_order_id || latestShipment?.awb || '';
      if (trackOrderId) {
        try {
          const trRes = await fetch(`${API_BASE}/api/shiprocket/track/${encodeURIComponent(trackOrderId)}`);
          const trJson = await trRes.json().catch(() => null);
          if (trRes.ok && trJson) trackingRaw = trJson;
        } catch {
          trackingRaw = null;
        }
      }
      const trackingSnapshot = buildTrackingSnapshot(trackingRaw);
      setDetail({
        sale,
        items,
        shipments,
        trackingSnapshot,
        latestShipment
      });
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
              <select className="orders-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
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
              <input className="orders-filter-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="orders-filter-group">
              <label className="orders-filter-label">To</label>
              <input className="orders-filter-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
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
            <span className="orders-summary-value orders-summary-value-em">{fmt(grand)}</span>
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
              <p className="orders-empty-text">Try adjusting your filters or clearing the search to see more orders.</p>
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
                  {filtered.map((s) => {
                    const localStatus = statusText(s.status || 'PLACED');
                    return (
                      <tr key={s.id} className="orders-table-row">
                        <td className="orders-table-cell">
                          <span className="orders-order-id">#{s.id}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-soft">{s.created_at ? new Date(s.created_at).toLocaleString() : '-'}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className={`orders-status-pill orders-status-${String(s.status || '').toLowerCase()}`}>
                            {localStatus || '-'}
                          </span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-payment-chip">{String(s.payment_status || 'COD').toUpperCase()}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-main">{getCustomerLabel(s)}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-main">{s.customer_mobile || '-'}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-soft">{s.customer_email || '-'}</span>
                        </td>
                        <td className="orders-table-cell align-right">
                          <span className="orders-amount">{fmt(getPayable(s))}</span>
                        </td>
                        <td className="orders-table-cell align-right">
                          <button className="orders-btn-small" onClick={() => openDetail(s.id)}>
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <OrderDetailPopup
        open={detailLoading || !!detail}
        loading={detailLoading}
        detail={detail}
        onClose={() => setDetail(null)}
        apiBase={API_BASE}
        orderSteps={ORDER_STEPS}
        statusText={statusText}
        computeStepFromLocal={computeStepFromLocal}
        computeStepFromShiprocket={computeStepFromShiprocket}
        computeStepFromShipment={computeStepFromShipment}
        buildExpectedDeliveryText={buildExpectedDeliveryText}
        fmt={fmt}
      />
    </div>
  );
}
