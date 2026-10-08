import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Transaction.css';
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
  "transaction-page": ["tadm-transaction-transaction-page"],
  "transaction-header": ["tadm-transaction-transaction-header"],
  "stats-row": ["tadm-transaction-stats-row"],
  "stat-card": ["tadm-transaction-stat-card"],
  "accent": ["tadm-transaction-accent"],
  "warn": ["tadm-transaction-warn"],
  "info": ["tadm-transaction-info"],
  "danger": ["tadm-transaction-danger"],
  "stat-title": ["tadm-transaction-stat-title"],
  "stat-value": ["tadm-transaction-stat-value"],
  "chip-bar": ["tadm-transaction-chip-bar"],
  "chip": ["tadm-transaction-chip"],
  "active": ["tadm-transaction-active"],
  "transaction-filter": ["tadm-transaction-transaction-filter"],
  "filter-grid": ["tadm-transaction-filter-grid"],
  "transaction-table": ["tadm-transaction-transaction-table"],
  "status-pill": ["tadm-transaction-status-pill"],
  "ok": ["tadm-transaction-ok"],
  "delete-btn": ["tadm-transaction-delete-btn"],
  "popup-card": ["tadm-transaction-popup-card"],
  "popup-confirm-box": ["tadm-transaction-popup-confirm-box"],
  "centered-popup": ["tadm-transaction-centered-popup"],
  "popup-actions": ["tadm-transaction-popup-actions"]
})[name] || ["tadm-transaction-" + name]).join(' ');
const API_BASE = process.env.REACT_APP_API_BASE || 'https://taras-kart-backend.vercel.app';
function asNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function normStr(v) {
  return String(v == null ? '' : v).trim();
}
function toDateStr(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}
function safeUpper(v) {
  return normStr(v).toUpperCase();
}
function money(n) {
  const x = asNum(n);
  return x.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function derivePaymentMeta(row) {
  const paymentStatus = safeUpper(row.payment_status);
  const paymentRef = normStr(row.payment_ref);
  const paymentMethod = safeUpper(row.payment_method);
  const source = safeUpper(row.source);
  const isCOD = paymentStatus === 'COD' || paymentMethod === 'COD';
  const isPaid = paymentStatus === 'PAID';
  const isPending = paymentStatus === 'PENDING';
  const isFailed = paymentStatus === 'FAILED';
  let paymentType = isCOD ? 'COD' : 'PREPAID';
  if (!isCOD && isPaid && !paymentRef && paymentMethod === 'COD') paymentType = 'COD';
  if (!isCOD && isPaid && paymentRef) paymentType = 'PREPAID';
  let receivedFrom = paymentType === 'COD' ? 'Shiprocket' : 'Razorpay';
  if (paymentType === 'PREPAID' && paymentMethod && paymentMethod !== 'RAZORPAY') {
    receivedFrom = paymentMethod;
  }
  let paymentReceived = false;
  if (paymentType === 'COD') {
    paymentReceived = isPaid;
  } else {
    paymentReceived = isPaid;
  }
  let paymentState = 'PENDING';
  if (isFailed) paymentState = 'FAILED';
  if (isPending) paymentState = 'PENDING';
  if (isPaid) paymentState = 'RECEIVED';
  if (paymentType === 'COD' && paymentStatus === 'COD') paymentState = 'NOT_RECEIVED';
  const channel = source || 'WEB';
  return {
    paymentType,
    receivedFrom,
    paymentReceived,
    paymentState,
    channel
  };
}
function statusPillClass(v) {
  const s = safeUpper(v);
  if (s === 'CANCELLED' || s === 'FAILED' || s === 'RTO') return 'danger';
  if (s === 'DELIVERED' || s === 'RECEIVED' || s === 'PAID') return 'ok';
  if (s === 'PLACED' || s === 'CONFIRMED' || s === 'PENDING') return 'info';
  return 'warn';
}
export default function Transaction() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [activeChip, setActiveChip] = useState('ALL');
  const [filters, setFilters] = useState({
    q: '',
    email: '',
    mobile: '',
    status: '',
    paymentType: '',
    paymentState: '',
    channel: '',
    dateFrom: '',
    dateTo: ''
  });
  const token = localStorage.getItem('auth_token') || '';
  const fetchTx = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        credentials: 'include'
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setRows([]);
        setErr(data?.message || 'Failed to load transactions');
        setLoading(false);
        return;
      }
      setRows(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      setRows([]);
      setErr('Failed to load transactions');
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    fetchTx();
  }, [fetchTx]);
  const enriched = useMemo(() => {
    return (rows || []).map(r => {
      const totals = typeof r.totals === 'string' ? (() => {
        try {
          return JSON.parse(r.totals);
        } catch {
          return null;
        }
      })() : r.totals;
      const payable = totals?.payable != null ? asNum(totals.payable) : asNum(r.total);
      const meta = derivePaymentMeta(r);
      return {
        ...r,
        _totalsObj: totals,
        _payable: payable,
        _paymentType: meta.paymentType,
        _receivedFrom: meta.receivedFrom,
        _paymentReceived: meta.paymentReceived,
        _paymentState: meta.paymentState,
        _channel: meta.channel
      };
    });
  }, [rows]);
  const chipFiltered = useMemo(() => {
    const list = enriched;
    const chip = safeUpper(activeChip);
    if (chip === 'ALL') return list;
    if (chip === 'COD') return list.filter(x => x._paymentType === 'COD');
    if (chip === 'PREPAID') return list.filter(x => x._paymentType === 'PREPAID');
    if (chip === 'RECEIVED') return list.filter(x => x._paymentState === 'RECEIVED');
    if (chip === 'PENDING') return list.filter(x => x._paymentState === 'PENDING' || x._paymentState === 'NOT_RECEIVED');
    if (chip === 'CANCELLED') return list.filter(x => safeUpper(x.status) === 'CANCELLED');
    return list;
  }, [enriched, activeChip]);
  const filtered = useMemo(() => {
    const q = safeUpper(filters.q);
    const email = safeUpper(filters.email);
    const mobile = filters.mobile.replace(/\D/g, '');
    const status = safeUpper(filters.status);
    const paymentType = safeUpper(filters.paymentType);
    const paymentState = safeUpper(filters.paymentState);
    const channel = safeUpper(filters.channel);
    let fromTs = 0;
    let toTs = 0;
    if (filters.dateFrom) {
      const d = new Date(filters.dateFrom);
      if (!Number.isNaN(d.getTime())) fromTs = d.getTime();
    }
    if (filters.dateTo) {
      const d = new Date(filters.dateTo);
      if (!Number.isNaN(d.getTime())) toTs = d.getTime() + 24 * 60 * 60 * 1000 - 1;
    }
    return chipFiltered.filter(r => {
      const rowStatus = safeUpper(r.status);
      const rowEmail = safeUpper(r.customer_email);
      const rowName = safeUpper(r.customer_name);
      const rowMobile = normStr(r.customer_mobile).replace(/\D/g, '');
      const rowId = normStr(r.id);
      const rowChannel = safeUpper(r._channel);
      const rowPaymentType = safeUpper(r._paymentType);
      const rowPaymentState = safeUpper(r._paymentState);
      if (q) {
        const hit = rowEmail.includes(q) || rowName.includes(q) || rowMobile.includes(q) || safeUpper(rowId).includes(q);
        if (!hit) return false;
      }
      if (email && rowEmail !== email) return false;
      if (mobile && rowMobile !== mobile) return false;
      if (status && rowStatus !== status) return false;
      if (paymentType && rowPaymentType !== paymentType) return false;
      if (paymentState && rowPaymentState !== paymentState) return false;
      if (channel && rowChannel !== channel) return false;
      if (fromTs || toTs) {
        const t = new Date(r.created_at).getTime();
        if (fromTs && t < fromTs) return false;
        if (toTs && t > toTs) return false;
      }
      return true;
    });
  }, [chipFiltered, filters]);
  const stats = useMemo(() => {
    const list = filtered;
    const count = list.length;
    const cod = list.filter(x => x._paymentType === 'COD').length;
    const prepaid = list.filter(x => x._paymentType === 'PREPAID').length;
    const received = list.filter(x => x._paymentState === 'RECEIVED').length;
    const pending = list.filter(x => x._paymentState !== 'RECEIVED').length;
    const cancelled = list.filter(x => safeUpper(x.status) === 'CANCELLED').length;
    const totalAmount = list.reduce((a, x) => a + asNum(x._payable), 0);
    const receivedAmount = list.filter(x => x._paymentState === 'RECEIVED').reduce((a, x) => a + asNum(x._payable), 0);
    return {
      count,
      cod,
      prepaid,
      received,
      pending,
      cancelled,
      totalAmount,
      receivedAmount
    };
  }, [filtered]);
  const onReset = () => {
    setFilters({
      q: '',
      email: '',
      mobile: '',
      status: '',
      paymentType: '',
      paymentState: '',
      channel: '',
      dateFrom: '',
      dateTo: ''
    });
    setActiveChip('ALL');
  };
  return <div className={portalClass("transaction-page")}>
      
      <div className={portalClass("transaction-header")}>
        <h2 className="tadm-transaction-node-0">Transactions</h2>
        <p className="tadm-transaction-node-1">
          COD is counted as received only when payment status is PAID (Shiprocket remitted). Prepaid is
          counted as received only when payment status is PAID (Razorpay captured).
        </p>
      </div>

      <div className={portalClass("stats-row")}>
        <div className={portalClass("stat-card info")}>
          <div className={portalClass("stat-title")}>Total Transactions</div>
          <div className={portalClass("stat-value")}>{stats.count}</div>
        </div>
        <div className={portalClass("stat-card warn")}>
          <div className={portalClass("stat-title")}>Pending / Not Received</div>
          <div className={portalClass("stat-value")}>{stats.pending}</div>
        </div>
        <div className={portalClass("stat-card accent")}>
          <div className={portalClass("stat-title")}>Received</div>
          <div className={portalClass("stat-value")}>{stats.received}</div>
        </div>
        <div className={portalClass("stat-card")}>
          <div className={portalClass("stat-title")}>Total Amount</div>
          <div className={portalClass("stat-value")}>₹ {money(stats.totalAmount)}</div>
        </div>
        <div className={portalClass("stat-card accent")}>
          <div className={portalClass("stat-title")}>Received Amount</div>
          <div className={portalClass("stat-value")}>₹ {money(stats.receivedAmount)}</div>
        </div>
      </div>

      <div className={portalClass("chip-bar")}>
        {['ALL', 'COD', 'PREPAID', 'RECEIVED', 'PENDING', 'CANCELLED'].map(c => <button key={c} className={portalClass(`chip ${activeChip === c ? 'active' : ''}`)} onClick={() => setActiveChip(c)} type="button">
            {c}
          </button>)}
      </div>

      <div className={portalClass("transaction-filter")}>
        <h3 className="tadm-transaction-node-2">Filters</h3>

        <div className={portalClass("filter-grid")}>
          <input value={filters.q} onChange={e => setFilters(s => ({
          ...s,
          q: e.target.value
        }))} placeholder="Search (name/email/mobile/order id)" className="tadm-transaction-node-3" />

          <input value={filters.email} onChange={e => setFilters(s => ({
          ...s,
          email: e.target.value
        }))} placeholder="Exact Email" className="tadm-transaction-node-4" />

          <input value={filters.mobile} onChange={e => setFilters(s => ({
          ...s,
          mobile: e.target.value
        }))} placeholder="Exact Mobile" className="tadm-transaction-node-5" />

          <select value={filters.status} onChange={e => setFilters(s => ({
          ...s,
          status: e.target.value
        }))} className="tadm-transaction-node-6">
            <option value="" className="tadm-transaction-node-7">Order Status</option>
            <option value="PLACED" className="tadm-transaction-node-8">PLACED</option>
            <option value="CONFIRMED" className="tadm-transaction-node-9">CONFIRMED</option>
            <option value="DELIVERED" className="tadm-transaction-node-10">DELIVERED</option>
            <option value="CANCELLED" className="tadm-transaction-node-11">CANCELLED</option>
            <option value="RTO" className="tadm-transaction-node-12">RTO</option>
          </select>

          <select value={filters.paymentType} onChange={e => setFilters(s => ({
          ...s,
          paymentType: e.target.value
        }))} className="tadm-transaction-node-13">
            <option value="" className="tadm-transaction-node-14">Payment Type</option>
            <option value="COD" className="tadm-transaction-node-15">COD</option>
            <option value="PREPAID" className="tadm-transaction-node-16">PREPAID</option>
          </select>

          <select value={filters.paymentState} onChange={e => setFilters(s => ({
          ...s,
          paymentState: e.target.value
        }))} className="tadm-transaction-node-17">
            <option value="" className="tadm-transaction-node-18">Payment State</option>
            <option value="RECEIVED" className="tadm-transaction-node-19">RECEIVED</option>
            <option value="PENDING" className="tadm-transaction-node-20">PENDING</option>
            <option value="NOT_RECEIVED" className="tadm-transaction-node-21">NOT_RECEIVED</option>
            <option value="FAILED" className="tadm-transaction-node-22">FAILED</option>
          </select>

          <select value={filters.channel} onChange={e => setFilters(s => ({
          ...s,
          channel: e.target.value
        }))} className="tadm-transaction-node-23">
            <option value="" className="tadm-transaction-node-24">Channel</option>
            <option value="WEB" className="tadm-transaction-node-25">WEB</option>
            <option value="POS" className="tadm-transaction-node-26">POS</option>
            <option value="ADMIN" className="tadm-transaction-node-27">ADMIN</option>
          </select>

          <input type="date" value={filters.dateFrom} onChange={e => setFilters(s => ({
          ...s,
          dateFrom: e.target.value
        }))} className="tadm-transaction-node-28" />
          <input type="date" value={filters.dateTo} onChange={e => setFilters(s => ({
          ...s,
          dateTo: e.target.value
        }))} className="tadm-transaction-node-29" />

          <button type="button" onClick={fetchTx} className="tadm-transaction-node-30">
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          <button type="button" onClick={onReset} className="tadm-transaction-node-31">
            Reset
          </button>
        </div>

        {err ? <p style={{
        marginTop: 12,
        color: '#ff6b6b'
      }} className="tadm-transaction-node-32">{err}</p> : null}
      </div>

      <div className={portalClass("transaction-table")}>
        <h3 className="tadm-transaction-node-33">Transaction List</h3>

        <div style={{
        overflowX: 'auto'
      }} className="tadm-transaction-node-34">
          <table className="tadm-transaction-node-35">
            <thead className="tadm-transaction-node-36">
              <tr className="tadm-transaction-node-37">
                <th className="tadm-transaction-node-38">Date</th>
                <th className="tadm-transaction-node-39">Order</th>
                <th className="tadm-transaction-node-40">Channel</th>
                <th className="tadm-transaction-node-41">Customer</th>
                <th className="tadm-transaction-node-42">Amount</th>
                <th className="tadm-transaction-node-43">Payment Type</th>
                <th className="tadm-transaction-node-44">Received From</th>
                <th className="tadm-transaction-node-45">Payment State</th>
                <th className="tadm-transaction-node-46">Order Status</th>
                <th className="tadm-transaction-node-47">Payment Status</th>
              </tr>
            </thead>

            <tbody className="tadm-transaction-node-48">
              {filtered.length === 0 ? <tr className="tadm-transaction-node-49">
                  <td colSpan="10" style={{
                textAlign: 'center',
                padding: 16
              }} className="tadm-transaction-node-50">
                    No transactions found
                  </td>
                </tr> : filtered.map(r => {
              const orderShort = normStr(r.id).slice(0, 8);
              const customer = normStr(r.customer_name) || 'Unknown';
              const email = normStr(r.customer_email);
              const mobile = normStr(r.customer_mobile);
              const amount = r._payable;
              const orderStatus = safeUpper(r.status);
              const paymentStatus = safeUpper(r.payment_status);
              return <tr key={r.id} className="tadm-transaction-node-51">
                      <td className="tadm-transaction-node-52">{toDateStr(r.created_at)}</td>
                      <td className="tadm-transaction-node-53">{orderShort}</td>
                      <td className="tadm-transaction-node-54">{r._channel}</td>
                      <td className="tadm-transaction-node-55">
                        <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }} className="tadm-transaction-node-56">
                          <span className="tadm-transaction-node-57">{customer}</span>
                          {email ? <span style={{
                      fontSize: 12,
                      color: "#42536a"
                    }} className="tadm-transaction-node-58">{email}</span> : null}
                          {mobile ? <span style={{
                      fontSize: 12,
                      color: "#42536a"
                    }} className="tadm-transaction-node-59">{mobile}</span> : null}
                        </div>
                      </td>
                      <td className="tadm-transaction-node-60">₹ {money(amount)}</td>
                      <td className="tadm-transaction-node-61">
                        <span className={portalClass(`status-pill ${statusPillClass(r._paymentType)}`)}>
                          {r._paymentType}
                        </span>
                      </td>
                      <td className="tadm-transaction-node-62">{r._receivedFrom}</td>
                      <td className="tadm-transaction-node-63">
                        <span className={portalClass(`status-pill ${statusPillClass(r._paymentState)}`)}>
                          {r._paymentState}
                        </span>
                      </td>
                      <td className="tadm-transaction-node-64">
                        <span className={portalClass(`status-pill ${statusPillClass(orderStatus)}`)}>
                          {orderStatus}
                        </span>
                      </td>
                      <td className="tadm-transaction-node-65">
                        <span className={portalClass(`status-pill ${statusPillClass(paymentStatus)}`)}>
                          {paymentStatus}
                        </span>
                      </td>
                    </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
