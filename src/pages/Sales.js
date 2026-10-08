import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Sales.css';
import { useAuth } from './AdminAuth';
import OrderDetailPopup from './OrderDetailPopup';
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
  "orders-btn-small": ["tadm-sales-orders-btn-small"],
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
  "orders-text-soft": ["tadm-sales-orders-text-soft"]
})[name] || ["tadm-sales-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const STATUSES = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'];
const ORDER_STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];
const PAYMENT_FILTERS = ['ALL', 'COD', 'PREPAID', 'PENDING', 'FAILED'];
const STAGE_FILTERS = ['ALL', 'COMPLETE', 'INCOMPLETE'];
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
  const status = (lastTrack && lastTrack.current_status) || core.current_status || core.status || '';
  const eddRaw = (lastTrack && lastTrack.edd) || core.edd || null;
  const lastEventRaw = (lastTrack && (lastTrack.date || lastTrack.pickup_date || lastTrack.updated_time_stamp)) || core.updated_time_stamp || core.last_status_time || null;
  const edd = eddRaw ? new Date(eddRaw) : null;
  const lastEvent = lastEventRaw ? new Date(lastEventRaw) : null;
  return {
    status,
    eddText: edd && !Number.isNaN(edd.getTime()) ? edd.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }) : null,
    lastEventText: lastEvent && !Number.isNaN(lastEvent.getTime()) ? lastEvent.toLocaleString('en-IN') : null,
    core
  };
}
function buildExpectedDeliveryText(trackingSnapshot, sale, latestShipment) {
  if (trackingSnapshot && trackingSnapshot.eddText) return trackingSnapshot.eddText;
  const baseRaw = (latestShipment && (latestShipment.pickup_date || latestShipment.created_at)) || (sale && (sale.updated_at || sale.created_at)) || null;
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
function normalizePayMode(paymentStatus) {
  const p = statusText(paymentStatus);
  if (!p) return 'UNKNOWN';
  if (p.includes('COD') || p.includes('CASH')) return 'COD';
  if (p.includes('PREPAID') || p.includes('PAID') || p.includes('ONLINE') || p.includes('RAZORPAY') || p.includes('PAYMENT_SUCCESS')) return 'PREPAID';
  if (p.includes('PENDING') || p.includes('INIT') || p.includes('CREATED') || p.includes('PROCESSING')) return 'PENDING';
  if (p.includes('FAILED') || p.includes('CANCEL')) return 'FAILED';
  return p;
}
function normalizeOrderStage(saleStatus) {
  const st = statusText(saleStatus);
  if (!st) return 'UNKNOWN';
  if (st.includes('CANCEL')) return 'CANCELLED';
  if (st.includes('DELIVER')) return 'DELIVERED';
  if (st.includes('SHIP')) return 'SHIPPED';
  if (st.includes('PACK')) return 'PACKED';
  if (st.includes('CONFIRM')) return 'CONFIRMED';
  if (st.includes('PLACE')) return 'PLACED';
  return st;
}
function isIncompleteOrder(s) {
  const stage = normalizeOrderStage(s?.status);
  const pay = normalizePayMode(s?.payment_status);
  const payable = Number(s && s.totals && s.totals.payable != null ? s.totals.payable : s && s.total != null ? s.total : 0);
  const hasCustomer = (s?.customer_name && String(s.customer_name).trim()) || (s?.customer_email && String(s.customer_email).trim()) || (s?.customer_mobile && String(s.customer_mobile).trim());
  const hasItems = Array.isArray(s?.items) ? s.items.length > 0 : true;
  const missingTotal = !Number.isFinite(payable) || payable <= 0;
  const badStage = stage === 'UNKNOWN';
  const badPay = pay === 'UNKNOWN';
  return !hasCustomer || !hasItems || missingTotal || badStage || badPay;
}
export default function Sales() {
  const {
    token
  } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`
    } : {};
  }, [token]);
  const getPayable = useCallback(s => {
    if (s && s.totals && s.totals.payable != null) return Number(s.totals.payable);
    if (s && s.total != null) return Number(s.total);
    if (Array.isArray(s?.items) && s.items.length) {
      return s.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
    }
    return 0;
  }, []);
  const getCustomerLabel = useCallback(s => {
    const name = s?.customer_name && String(s.customer_name).trim();
    if (name) return name;
    if (s?.branch_id) return `Branch #${s.branch_id}`;
    return '-';
  }, []);
  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      if (!token) {
        setSales([]);
        return;
      }
      const res = await fetch(`${API_BASE}/api/sales/admin`, {
        headers: authHeaders
      });
      const data = await res.json().catch(() => []);
      setSales(Array.isArray(data) ? data : []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders]);
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null;
    const toTs = to ? new Date(to + 'T23:59:59').getTime() : null;
    return sales.filter(s => {
      const okStatus = status === 'ALL' ? true : String(s.status || '').toUpperCase() === status;
      const payMode = normalizePayMode(s?.payment_status);
      const okPayment = paymentFilter === 'ALL' ? true : payMode === paymentFilter;
      const incomplete = isIncompleteOrder(s);
      const okStage = stageFilter === 'ALL' ? true : stageFilter === 'INCOMPLETE' ? incomplete : !incomplete;
      const created = s.created_at ? new Date(s.created_at).getTime() : null;
      const okFrom = fromTs ? created ? created >= fromTs : true : true;
      const okTo = toTs ? created ? created <= toTs : true : true;
      const t = s.totals || {};
      const hay = [s.id, getCustomerLabel(s), s.customer_email, s.customer_mobile, s.status, s.payment_status, t?.payable, getPayable(s)].join(' ').toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okStatus && okPayment && okStage && okFrom && okTo && okQ;
    });
  }, [sales, status, paymentFilter, stageFilter, q, from, to, getCustomerLabel, getPayable]);
  const grand = useMemo(() => {
    return filtered.reduce((acc, s) => acc + getPayable(s), 0);
  }, [filtered, getPayable]);
  const openDetail = useCallback(async id => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const [saleRes, shRes] = await Promise.all([fetch(`${API_BASE}/api/sales/admin/${id}`, {
        headers: authHeaders
      }), fetch(`${API_BASE}/api/shipments/by-sale/${id}`, {
        headers: authHeaders
      })]);
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
  }, [authHeaders]);
  const fmt = useCallback(n => `₹${Number(n || 0).toFixed(2)}`, []);
  return <div className={portalClass("orders-screen")}>
      
      <div className={portalClass("orders-layout")}>
        <div className={portalClass("orders-header")}>
          <div className={portalClass("orders-header-main")}>
            <h1 className={portalClass("orders-header-title")}>Orders</h1>
            <p className={portalClass("orders-header-subtitle")}>Track, review and manage every purchase in one place</p>
          </div>
          <div className={portalClass("orders-header-actions")}>
            <button className={portalClass("orders-btn-refresh")} onClick={fetchSales}>
              <span className={portalClass("orders-btn-refresh-icon")} />
              <span className="tadm-sales-node-0">Refresh list</span>
            </button>
          </div>
        </div>

        <div className={portalClass("orders-filters-card")}>
          <div className={portalClass("orders-filters-top")}>
            <span className={portalClass("orders-filters-title")}>Filters</span>
            <span className={portalClass("orders-filters-subtitle")}>Refine by status, payment, date range or customer details</span>
          </div>
          <div className={portalClass("orders-filters-grid")}>
            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>Status</label>
              <select className={portalClass("orders-filter-select")} value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s} className="tadm-sales-node-1">
                    {s}
                  </option>)}
              </select>
            </div>

            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>Payment</label>
              <select className={portalClass("orders-filter-select")} value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                {PAYMENT_FILTERS.map(p => <option key={p} value={p} className="tadm-sales-node-2">
                    {p}
                  </option>)}
              </select>
            </div>

            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>Completeness</label>
              <select className={portalClass("orders-filter-select")} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
                {STAGE_FILTERS.map(st => <option key={st} value={st} className="tadm-sales-node-3">
                    {st}
                  </option>)}
              </select>
            </div>

            <div className={portalClass("orders-filter-group orders-filter-group-wide")}>
              <label className={portalClass("orders-filter-label")}>Search</label>
              <div className={portalClass("orders-filter-search-wrap")}>
                <span className={portalClass("orders-filter-search-icon")} />
                <input className={portalClass("orders-filter-input")} placeholder="Search by order id, name, email or mobile" value={q} onChange={e => setQ(e.target.value)} />
              </div>
            </div>

            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>From</label>
              <input className={portalClass("orders-filter-input")} type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>

            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>To</label>
              <input className={portalClass("orders-filter-input")} type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className={portalClass("orders-summary-bar")}>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Orders</span>
            <span className={portalClass("orders-summary-value")}>{loading ? 'Loading…' : `${filtered.length} order${filtered.length === 1 ? '' : 's'}`}</span>
          </div>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Total payable</span>
            <span className={portalClass("orders-summary-value orders-summary-value-em")}>{fmt(grand)}</span>
          </div>
        </div>

        <div className={portalClass("orders-table-card")}>
          {loading ? <div className={portalClass("orders-loader")}>
              <div className={portalClass("orders-spinner")} />
              <span className={portalClass("orders-loader-text")}>Fetching latest orders</span>
            </div> : filtered.length === 0 ? <div className={portalClass("orders-empty-state")}>
              <div className={portalClass("orders-empty-icon")} />
              <h3 className={portalClass("orders-empty-title")}>No orders found</h3>
              <p className={portalClass("orders-empty-text")}>Try adjusting your filters or clearing the search to see more orders.</p>
            </div> : <div className={portalClass("orders-table-scroller")}>
              <table className={portalClass("orders-table")}>
                <thead className="tadm-sales-node-4">
                  <tr className="tadm-sales-node-5">
                    <th className={portalClass("orders-table-head")}>Order</th>
                    <th className={portalClass("orders-table-head")}>Placed at</th>
                    <th className={portalClass("orders-table-head")}>Status</th>
                    <th className={portalClass("orders-table-head")}>Payment</th>
                    <th className={portalClass("orders-table-head")}>Customer</th>
                    <th className={portalClass("orders-table-head")}>Mobile</th>
                    <th className={portalClass("orders-table-head")}>Email</th>
                    <th className={portalClass("orders-table-head align-right")}>Payable</th>
                    <th className={portalClass("orders-table-head align-right")} />
                  </tr>
                </thead>
                <tbody className="tadm-sales-node-6">
                  {filtered.map(s => {
                const localStatus = statusText(s.status || 'PLACED');
                return <tr key={s.id} className={portalClass("orders-table-row")}>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-order-id")}>#{s.id}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-soft")}>{s.created_at ? new Date(s.created_at).toLocaleString() : '-'}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass(`orders-status-pill orders-status-${String(s.status || '').toLowerCase()}`)}>{localStatus || '-'}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-payment-chip")}>{String(s.payment_status || 'COD').toUpperCase()}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-main")}>{getCustomerLabel(s)}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-main")}>{s.customer_mobile || '-'}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-soft")}>{s.customer_email || '-'}</span>
                        </td>
                        <td className={portalClass("orders-table-cell align-right")}>
                          <span className={portalClass("orders-amount")}>{fmt(getPayable(s))}</span>
                        </td>
                        <td className={portalClass("orders-table-cell align-right")}>
                          <button className={portalClass("orders-btn-small")} onClick={() => openDetail(s.id)}>
                            View details
                          </button>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>}
        </div>
      </div>

      <OrderDetailPopup open={detailLoading || !!detail} loading={detailLoading} detail={detail} onClose={() => setDetail(null)} apiBase={API_BASE} orderSteps={ORDER_STEPS} statusText={statusText} computeStepFromLocal={computeStepFromLocal} computeStepFromShiprocket={computeStepFromShiprocket} computeStepFromShipment={computeStepFromShipment} buildExpectedDeliveryText={buildExpectedDeliveryText} fmt={fmt} />
    </div>;
}
