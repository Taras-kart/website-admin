import React, { useEffect, useMemo, useState } from 'react';
import './OrderIssues.css';
import OrderCancelPopup from './OrderCancelPopup';
import { useNavigate } from 'react-router-dom';
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
  "oi-screen": ["tadm-orderissues-oi-screen"],
  "oi-layout": ["tadm-orderissues-oi-layout"],
  "oi-header": ["tadm-orderissues-oi-header"],
  "oi-header-main": ["tadm-orderissues-oi-header-main"],
  "oi-title": ["tadm-orderissues-oi-title"],
  "oi-subtitle": ["tadm-orderissues-oi-subtitle"],
  "oi-header-actions": ["tadm-orderissues-oi-header-actions"],
  "oi-refresh-btn": ["tadm-orderissues-oi-refresh-btn"],
  "oi-refresh-dot": ["tadm-orderissues-oi-refresh-dot"],
  "oi-tabs": ["tadm-orderissues-oi-tabs"],
  "oi-tab": ["tadm-orderissues-oi-tab"],
  "oi-tab-active": ["tadm-orderissues-oi-tab-active"],
  "oi-summary": ["tadm-orderissues-oi-summary"],
  "oi-summary-card": ["tadm-orderissues-oi-summary-card"],
  "oi-summary-label": ["tadm-orderissues-oi-summary-label"],
  "oi-summary-value": ["tadm-orderissues-oi-summary-value"],
  "oi-summary-note": ["tadm-orderissues-oi-summary-note"],
  "oi-filters": ["tadm-orderissues-oi-filters"],
  "oi-filter-group": ["tadm-orderissues-oi-filter-group"],
  "oi-filter-label": ["tadm-orderissues-oi-filter-label"],
  "oi-filter-select": ["tadm-orderissues-oi-filter-select"],
  "oi-filter-search": ["tadm-orderissues-oi-filter-search"],
  "oi-filter-search-wrap": ["tadm-orderissues-oi-filter-search-wrap"],
  "oi-filter-search-icon": ["tadm-orderissues-oi-filter-search-icon"],
  "oi-filter-input": ["tadm-orderissues-oi-filter-input"],
  "oi-filter-helper": ["tadm-orderissues-oi-filter-helper"],
  "oi-table-card": ["tadm-orderissues-oi-table-card"],
  "oi-loader": ["tadm-orderissues-oi-loader"],
  "oi-spinner": ["tadm-orderissues-oi-spinner"],
  "oi-loader-text": ["tadm-orderissues-oi-loader-text"],
  "oi-empty": ["tadm-orderissues-oi-empty"],
  "oi-empty-inline": ["tadm-orderissues-oi-empty-inline"],
  "oi-empty-icon": ["tadm-orderissues-oi-empty-icon"],
  "oi-empty-title": ["tadm-orderissues-oi-empty-title"],
  "oi-empty-text": ["tadm-orderissues-oi-empty-text"],
  "oi-table-scroller": ["tadm-orderissues-oi-table-scroller"],
  "oi-table": ["tadm-orderissues-oi-table"],
  "oi-th": ["tadm-orderissues-oi-th"],
  "oi-tr": ["tadm-orderissues-oi-tr"],
  "oi-td": ["tadm-orderissues-oi-td"],
  "oi-pill-id": ["tadm-orderissues-oi-pill-id"],
  "oi-muted": ["tadm-orderissues-oi-muted"],
  "oi-strong": ["tadm-orderissues-oi-strong"],
  "oi-text": ["tadm-orderissues-oi-text"],
  "oi-amount": ["tadm-orderissues-oi-amount"],
  "oi-chip": ["tadm-orderissues-oi-chip"],
  "oi-chip-cod": ["tadm-orderissues-oi-chip-cod"],
  "oi-chip-prepaid": ["tadm-orderissues-oi-chip-prepaid"],
  "oi-chip-other": ["tadm-orderissues-oi-chip-other"],
  "oi-notes": ["tadm-orderissues-oi-notes"],
  "oi-notes-origin": ["tadm-orderissues-oi-notes-origin"],
  "oi-notes-reason": ["tadm-orderissues-oi-notes-reason"],
  "oi-open-card": ["tadm-orderissues-oi-open-card"],
  "oi-open-header": ["tadm-orderissues-oi-open-header"],
  "oi-open-title": ["tadm-orderissues-oi-open-title"],
  "oi-open-text": ["tadm-orderissues-oi-open-text"],
  "oi-open-status": ["tadm-orderissues-oi-open-status"],
  "oi-cancel-btn": ["tadm-orderissues-oi-cancel-btn"],
  "oi-placeholder-card": ["tadm-orderissues-oi-placeholder-card"],
  "oi-placeholder-title": ["tadm-orderissues-oi-placeholder-title"],
  "oi-placeholder-text": ["tadm-orderissues-oi-placeholder-text"]
})[name] || ["tadm-orderissues-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
function statusText(s) {
  return String(s || '').toUpperCase();
}
function getPayable(s) {
  if (s && s.totals && s.totals.payable != null) return Number(s.totals.payable);
  if (s && s.total != null) return Number(s.total);
  if (Array.isArray(s?.items) && s.items.length) {
    return s.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
  }
  return 0;
}
function getCustomerLabel(s) {
  const name = s?.customer_name && String(s.customer_name).trim();
  if (name) return name;
  if (s?.branch_id) return `Branch #${s.branch_id}`;
  return '-';
}
function getPaymentType(s) {
  const raw = statusText(s?.payment_status || 'COD');
  if (raw.includes('COD')) return 'COD';
  if (raw.includes('PREPAID') || raw.includes('ONLINE') || raw.includes('PAID')) return 'PREPAID';
  return 'OTHER';
}
function fmtAmount(n) {
  return `₹${Number(n || 0).toFixed(2)}`;
}
function refundStatusLabel(r) {
  const ref = statusText(r.refund_status || '');
  const st = statusText(r.status || '');
  if (ref === 'REFUNDED') return 'Refund completed';
  if (ref === 'PENDING_REFUND') return 'Refund approved';
  if (st === 'REQUESTED') return 'Pending review';
  if (st === 'APPROVED') return 'Approved';
  if (st === 'REJECTED') return 'Rejected';
  return ref || st || '-';
}
export default function OrderIssues() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cancellations');
  const [q, setQ] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSale, setPopupSale] = useState(null);
  const [popupSubmitting, setPopupSubmitting] = useState(false);
  const [cancelBusyId, setCancelBusyId] = useState(null);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [returnsError, setReturnsError] = useState('');
  const [returnsList, setReturnsList] = useState([]);
  const [returnsLoaded, setReturnsLoaded] = useState(false);
  const [refundsLoading, setRefundsLoading] = useState(false);
  const [refundsError, setRefundsError] = useState('');
  const [refundsList, setRefundsList] = useState([]);
  const [refundsLoaded, setRefundsLoaded] = useState(false);
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
  const cancelledOrders = useMemo(() => sales.filter(s => statusText(s.status) === 'CANCELLED'), [sales]);
  const filteredOrders = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return sales.filter(s => {
      const payType = getPaymentType(s);
      const okPayment = paymentFilter === 'ALL' ? true : payType === paymentFilter;
      const hay = [s.id, getCustomerLabel(s), s.customer_email, s.customer_mobile, s.status, s.payment_status].join(' ').toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okPayment && okQ;
    });
  }, [sales, paymentFilter, q]);
  const summary = useMemo(() => {
    const total = cancelledOrders.length;
    const cod = cancelledOrders.filter(s => getPaymentType(s) === 'COD').length;
    const prepaid = cancelledOrders.filter(s => getPaymentType(s) === 'PREPAID').length;
    const totalAmount = cancelledOrders.reduce((acc, s) => acc + getPayable(s), 0);
    return {
      total,
      cod,
      prepaid,
      totalAmount
    };
  }, [cancelledOrders]);
  const openCancelPopupForSale = sale => {
    if (!sale) return;
    setPopupSale(sale);
    setPopupOpen(true);
  };
  const closeCancelPopup = () => {
    setPopupOpen(false);
    setPopupSale(null);
    setPopupSubmitting(false);
    setCancelBusyId(null);
  };
  const handleAdminConfirmCancel = async reasonText => {
    if (!popupSale) return;
    setPopupSubmitting(true);
    setCancelBusyId(popupSale.id);
    const payType = getPaymentType(popupSale);
    try {
      await fetch(`${API_BASE}/api/orders/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sale_id: popupSale.id,
          payment_type: payType,
          reason: reasonText,
          source: 'admin'
        })
      });
      const trimmedReason = reasonText && reasonText.trim() ? reasonText.trim() : '';
      const nowIso = new Date().toISOString();
      setSales(prev => prev.map(s => s.id === popupSale.id ? {
        ...s,
        status: 'CANCELLED',
        updated_at: nowIso,
        cancellation_source: 'admin',
        cancellation_reason: trimmedReason || s.cancellation_reason,
        cancellation_created_at: nowIso
      } : s));
      closeCancelPopup();
    } catch {
      setPopupSubmitting(false);
      setCancelBusyId(null);
    }
  };
  const fetchReturns = async () => {
    setReturnsLoading(true);
    setReturnsError('');
    try {
      const res = await fetch(`${API_BASE}/api/returns/admin`);
      if (!res.ok) throw new Error('Unable to load returns');
      const data = await res.json();
      setReturnsList(Array.isArray(data.rows || data) ? data.rows || data : []);
      setReturnsLoaded(true);
    } catch (e) {
      setReturnsError(e.message || 'Could not load returns');
      setReturnsList([]);
    } finally {
      setReturnsLoading(false);
    }
  };
  const fetchRefunds = async () => {
    setRefundsLoading(true);
    setRefundsError('');
    try {
      const res = await fetch(`${API_BASE}/api/returns/admin/refunds`);
      if (!res.ok) throw new Error('Unable to load refunds');
      const data = await res.json();
      setRefundsList(Array.isArray(data.rows || data) ? data.rows || data : []);
      setRefundsLoaded(true);
    } catch (e) {
      setRefundsError(e.message || 'Could not load refunds');
      setRefundsList([]);
    } finally {
      setRefundsLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === 'returns' && !returnsLoaded && !returnsLoading) {
      fetchReturns();
    }
    if (activeTab === 'refunds' && !refundsLoaded && !refundsLoading) {
      fetchRefunds();
    }
  }, [activeTab, returnsLoaded, returnsLoading, refundsLoaded, refundsLoading]);
  return <div className={portalClass("oi-screen")}>
      
      <div className={portalClass("oi-layout")}>
        <header className={portalClass("oi-header")}>
          <div className={portalClass("oi-header-main")}>
            <h1 className={portalClass("oi-title")}>Cancel / Return / Refund Center</h1>
            <p className={portalClass("oi-subtitle")}>
              See all order problems in one place and keep customers informed.
            </p>
          </div>
          <div className={portalClass("oi-header-actions")}>
            <button className={portalClass("oi-refresh-btn")} onClick={fetchSales}>
              <span className={portalClass("oi-refresh-dot")} />
              <span className="tadm-orderissues-node-0">Refresh data</span>
            </button>
          </div>
        </header>

        <div className={portalClass("oi-tabs")}>
          <button className={portalClass(`oi-tab ${activeTab === 'cancellations' ? 'oi-tab-active' : ''}`)} onClick={() => setActiveTab('cancellations')}>
            Cancellations
          </button>
          <button className={portalClass(`oi-tab ${activeTab === 'returns' ? 'oi-tab-active' : ''}`)} onClick={() => setActiveTab('returns')}>
            Returns
          </button>
          <button className={portalClass(`oi-tab ${activeTab === 'refunds' ? 'oi-tab-active' : ''}`)} onClick={() => setActiveTab('refunds')}>
            Refunds
          </button>
        </div>

        {activeTab === 'cancellations' && <>
            <section className={portalClass("oi-summary")}>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>Cancelled orders</div>
                <div className={portalClass("oi-summary-value")}>{summary.total}</div>
                <div className={portalClass("oi-summary-note")}>Across all payment types</div>
              </div>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>COD cancellations</div>
                <div className={portalClass("oi-summary-value")}>{summary.cod}</div>
                <div className={portalClass("oi-summary-note")}>Useful for courier follow up</div>
              </div>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>Prepaid cancellations</div>
                <div className={portalClass("oi-summary-value")}>{summary.prepaid}</div>
                <div className={portalClass("oi-summary-note")}>Needs refund handling</div>
              </div>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>Cancelled order value</div>
                <div className={portalClass("oi-summary-value")}>{fmtAmount(summary.totalAmount)}</div>
                <div className={portalClass("oi-summary-note")}>Total of cancelled orders</div>
              </div>
            </section>

            <section className={portalClass("oi-filters")}>
              <div className={portalClass("oi-filter-group")}>
                <label className={portalClass("oi-filter-label")}>Payment type</label>
                <select className={portalClass("oi-filter-select")} value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                  <option value="ALL" className="tadm-orderissues-node-1">All</option>
                  <option value="COD" className="tadm-orderissues-node-2">COD</option>
                  <option value="PREPAID" className="tadm-orderissues-node-3">Prepaid</option>
                  <option value="OTHER" className="tadm-orderissues-node-4">Other</option>
                </select>
              </div>
              <div className={portalClass("oi-filter-group oi-filter-search")}>
                <label className={portalClass("oi-filter-label")}>Search</label>
                <div className={portalClass("oi-filter-search-wrap")}>
                  <span className={portalClass("oi-filter-search-icon")} />
                  <input className={portalClass("oi-filter-input")} placeholder="Search by order id, name, email or mobile" value={q} onChange={e => setQ(e.target.value)} />
                </div>
              </div>
              <div className={portalClass("oi-filter-helper")}>
                Use this view to see cancelled orders, who cancelled them, and cancel new orders
                when needed.
              </div>
            </section>

            <section className={portalClass("oi-table-card")}>
              {loading ? <div className={portalClass("oi-loader")}>
                  <div className={portalClass("oi-spinner")} />
                  <span className={portalClass("oi-loader-text")}>Loading orders</span>
                </div> : filteredOrders.length === 0 ? <div className={portalClass("oi-empty")}>
                  <div className={portalClass("oi-empty-icon")} />
                  <h3 className={portalClass("oi-empty-title")}>No orders found</h3>
                  <p className={portalClass("oi-empty-text")}>
                    When an order is cancelled, it will show up here with who cancelled and the
                    reason.
                  </p>
                </div> : <div className={portalClass("oi-table-scroller")}>
                  <table className={portalClass("oi-table")}>
                    <thead className="tadm-orderissues-node-5">
                      <tr className="tadm-orderissues-node-6">
                        <th className={portalClass("oi-th")}>Order</th>
                        <th className={portalClass("oi-th")}>Placed on</th>
                        <th className={portalClass("oi-th")}>Status</th>
                        <th className={portalClass("oi-th")}>Payment</th>
                        <th className={portalClass("oi-th")}>Customer</th>
                        <th className={portalClass("oi-th")}>Mobile</th>
                        <th className={portalClass("oi-th")}>Email</th>
                        <th className={portalClass("oi-th")}>Amount</th>
                        <th className={portalClass("oi-th")}>Cancel / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="tadm-orderissues-node-7">
                      {filteredOrders.map(s => {
                  const payType = getPaymentType(s);
                  const orderStatus = statusText(s.status);
                  const isCancelled = orderStatus === 'CANCELLED';
                  const cancelledAt = s.cancellation_created_at || s.updated_at || s.created_at;
                  const cancelledTime = cancelledAt ? new Date(cancelledAt).toLocaleString() : '-';
                  const reason = s.cancellation_reason || s.cancellation_notes || s.cancellation_comment || '';
                  const originRaw = s.cancellation_source || s.cancelled_by || '';
                  const originLower = String(originRaw || '').toLowerCase();
                  let originLabel = 'Cancelled';
                  if (isCancelled) {
                    if (originLower.includes('admin')) {
                      originLabel = 'Cancelled by you';
                    } else if (originLower.includes('user') || originLower.includes('customer') || originLower.includes('web')) {
                      originLabel = 'Cancelled by the user';
                    } else if (originLower.includes('system') || originLower.includes('auto')) {
                      originLabel = 'Cancelled automatically';
                    } else if (!originLower) {
                      originLabel = 'Cancelled';
                    } else {
                      originLabel = `Cancelled (${originRaw})`;
                    }
                  }
                  const isBusy = cancelBusyId === s.id && popupSubmitting;
                  const canCancelNow = !isCancelled && !orderStatus.includes('DELIVERED') && !orderStatus.includes('RTO');
                  return <tr key={s.id} className={portalClass("oi-tr")}>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-pill-id")}>#{s.id}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-muted")}>
                                {s.created_at ? new Date(s.created_at).toLocaleString() : '-'}
                              </span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-status-text")}>{orderStatus || '-'}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass(`oi-chip oi-chip-${payType.toLowerCase()}`)}>
                                {payType}
                              </span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-strong")}>{getCustomerLabel(s)}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-text")}>{s.customer_mobile || '-'}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-muted")}>{s.customer_email || '-'}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-amount")}>{fmtAmount(getPayable(s))}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              {isCancelled ? <div className={portalClass("oi-notes")}>
                                  <div className={portalClass("oi-notes-origin")}>
                                    {originLabel} · {cancelledTime}
                                  </div>
                                  <div className={portalClass("oi-notes-reason")}>
                                    {reason ? reason : 'No reason captured'}
                                  </div>
                                </div> : <button className={portalClass("oi-cancel-btn")} disabled={isBusy || !canCancelNow} onClick={() => openCancelPopupForSale(s)}>
                                  {isBusy ? 'Cancelling…' : 'Cancel order'}
                                </button>}
                            </td>
                          </tr>;
                })}
                    </tbody>
                  </table>
                </div>}
            </section>
          </>}

        {activeTab === 'returns' && <section className={portalClass("oi-table-card")}>
            {returnsLoading ? <div className={portalClass("oi-loader")}>
                <div className={portalClass("oi-spinner")} />
                <span className={portalClass("oi-loader-text")}>Loading returns</span>
              </div> : returnsError ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>Could not load returns</h3>
                <p className={portalClass("oi-empty-text")}>{returnsError}</p>
                <button className={portalClass("oi-refresh-btn")} onClick={fetchReturns}>
                  <span className={portalClass("oi-refresh-dot")} />
                  <span className="tadm-orderissues-node-8">Retry</span>
                </button>
              </div> : returnsList.length === 0 ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>No return requests yet</h3>
                <p className={portalClass("oi-empty-text")}>
                  When customers raise a return or replacement request, it will show up here.
                </p>
              </div> : <div className={portalClass("oi-table-scroller")}>
                <table className={portalClass("oi-table")}>
                  <thead className="tadm-orderissues-node-9">
                    <tr className="tadm-orderissues-node-10">
                      <th className={portalClass("oi-th")}>Request</th>
                      <th className={portalClass("oi-th")}>Order</th>
                      <th className={portalClass("oi-th")}>Created</th>
                      <th className={portalClass("oi-th")}>Type</th>
                      <th className={portalClass("oi-th")}>Status</th>
                      <th className={portalClass("oi-th")}>Customer</th>
                      <th className={portalClass("oi-th")}>Mobile</th>
                      <th className={portalClass("oi-th")}>Email</th>
                      <th className={portalClass("oi-th")}>Amount</th>
                      <th className={portalClass("oi-th")}>Reason</th>
                      <th className={portalClass("oi-th")}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="tadm-orderissues-node-11">
                    {returnsList.map(r => {
                const createdAt = r.created_at ? new Date(r.created_at).toLocaleString() : '-';
                const status = statusText(r.status || '');
                const type = statusText(r.type || '');
                const amount = r.sale_totals && r.sale_totals.payable != null ? Number(r.sale_totals.payable) : r.amount || 0;
                return <tr key={r.id} className={portalClass("oi-tr")}>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>RR#{String(r.id).slice(0, 8)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>#{r.sale_id}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-muted")}>{createdAt}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-status-text")}>{type || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-status-text")}>{status || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-strong")}>{r.customer_name || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.customer_mobile || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-muted")}>{r.customer_email || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-amount")}>{fmtAmount(amount)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>
                              {r.reason || r.reason_code || 'Not specified'}
                            </span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <button className={portalClass("oi-cancel-btn")} onClick={() => navigate(`/returns/${r.id}`)}>
                              Review
                            </button>
                          </td>
                        </tr>;
              })}
                  </tbody>
                </table>
              </div>}
          </section>}

        {activeTab === 'refunds' && <section className={portalClass("oi-table-card")}>
            {refundsLoading ? <div className={portalClass("oi-loader")}>
                <div className={portalClass("oi-spinner")} />
                <span className={portalClass("oi-loader-text")}>Loading refunds</span>
              </div> : refundsError ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>Could not load refunds</h3>
                <p className={portalClass("oi-empty-text")}>{refundsError}</p>
                <button className={portalClass("oi-refresh-btn")} onClick={fetchRefunds}>
                  <span className={portalClass("oi-refresh-dot")} />
                  <span className="tadm-orderissues-node-12">Retry</span>
                </button>
              </div> : refundsList.length === 0 ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>No refunds logged yet</h3>
                <p className={portalClass("oi-empty-text")}>
                  When refunds are initiated, they will show up here with amount and status.
                </p>
              </div> : <div className={portalClass("oi-table-scroller")}>
                <table className={portalClass("oi-table")}>
                  <thead className="tadm-orderissues-node-13">
                    <tr className="tadm-orderissues-node-14">
                      <th className={portalClass("oi-th")}>Refund</th>
                      <th className={portalClass("oi-th")}>Order</th>
                      <th className={portalClass("oi-th")}>Request</th>
                      <th className={portalClass("oi-th")}>Amount</th>
                      <th className={portalClass("oi-th")}>Mode</th>
                      <th className={portalClass("oi-th")}>Status</th>
                      <th className={portalClass("oi-th")}>Initiated by</th>
                      <th className={portalClass("oi-th")}>Created</th>
                      <th className={portalClass("oi-th")}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="tadm-orderissues-node-15">
                    {refundsList.map(r => {
                const createdAt = r.created_at ? new Date(r.created_at).toLocaleString() : '-';
                return <tr key={r.id} className={portalClass("oi-tr")}>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>RF#{String(r.id).slice(0, 8)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>#{r.sale_id}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>
                              {r.return_request_id ? String(r.return_request_id).slice(0, 8) : '-'}
                            </span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-amount")}>{fmtAmount(r.amount)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.mode || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-status-text")}>{refundStatusLabel(r)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.initiated_by || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-muted")}>{createdAt}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.remarks || '-'}</span>
                          </td>
                        </tr>;
              })}
                  </tbody>
                </table>
              </div>}
          </section>}
      </div>

      <OrderCancelPopup open={popupOpen} sale={popupSale} onClose={closeCancelPopup} onConfirm={handleAdminConfirmCancel} isSubmitting={popupSubmitting} />
    </div>;
}
