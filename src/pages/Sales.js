import React, { useEffect, useMemo, useState } from 'react';
import './Sales.css';
import Navbar from './NavbarAdmin';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const statuses = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'];

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
        s.customer_name,
        s.customer_email,
        s.customer_mobile,
        s.status,
        s.payment_status,
        t?.payable
      ]
        .join(' ')
        .toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okStatus && okFrom && okTo && okQ;
    });
  }, [sales, status, q, from, to]);

  const grand = useMemo(() => {
    return filtered.reduce((acc, s) => acc + Number(s?.totals?.payable || 0), 0);
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
    <div className="sales-page">
      <Navbar />
      <div className="sales-head">
        <h1>Orders</h1>
        <div className="actions">
          <button onClick={fetchSales}>Refresh</button>
        </div>
      </div>

      <div className="filters">
        <div className="group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="group grow">
          <label>Search</label>
          <input
            placeholder="Search by id, name, email, mobile"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="group">
          <label>From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="group">
          <label>To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="summary-bar">
        <span>{loading ? 'Loading…' : `${filtered.length} orders`}</span>
        <span>Total Payable {fmt(grand)}</span>
      </div>

      <div className="sales-table-wrap">
        {loading ? (
          <div className="loader">
            <div className="spin" />
            <span>Loading orders…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">No orders found</div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placed</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Payable</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  <td>{s.created_at ? new Date(s.created_at).toLocaleString() : '-'}</td>
                  <td>
                    <span className={`pill ${String(s.status || '').toLowerCase()}`}>
                      {String(s.status || '').toUpperCase() || '-'}
                    </span>
                  </td>
                  <td>{String(s.payment_status || 'COD').toUpperCase()}</td>
                  <td>{s.customer_name || '-'}</td>
                  <td>{s.customer_mobile || '-'}</td>
                  <td className="muted">{s.customer_email || '-'}</td>
                  <td>{fmt(s?.totals?.payable)}</td>
                  <td>
                    <button className="mini" onClick={() => openDetail(s.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detailLoading && (
        <div className="modal-wrap">
          <div className="modal center">
            <div className="loader">
              <div className="spin" />
              <span>Loading…</span>
            </div>
          </div>
        </div>
      )}

      {detail && !detailLoading && (
        <div className="modal-wrap" onClick={() => setDetail(null)}>
          <div className="modal fancy" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Order #{detail?.sale?.id}</h3>
              <button className="mini ghost" onClick={() => setDetail(null)}>
                Close
              </button>
            </div>

            <div className="order-meta full">
              <div>
                <div className="label">Status</div>
                <div className="value">{String(detail?.sale?.status || '').toUpperCase()}</div>
              </div>
              <div>
                <div className="label">Payment</div>
                <div className="value">{String(detail?.sale?.payment_status || 'COD').toUpperCase()}</div>
              </div>
              <div>
                <div className="label">Customer</div>
                <div className="value">
                  {detail?.sale?.customer_name || '-'}
                  {detail?.sale?.customer_mobile ? ` · ${detail?.sale?.customer_mobile}` : ''}
                </div>
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">{detail?.sale?.customer_email || '-'}</div>
              </div>
              <div>
                <div className="label">Payable</div>
                <div className="value strong">{fmt(detail?.sale?.totals?.payable)}</div>
              </div>
            </div>

            {detail?.sale?.shipping_address && (
              <div className="ship-block">
                <h4>Shipping Address</h4>
                <p>{detail.sale.shipping_address.line1}</p>
                {detail.sale.shipping_address.line2 && <p>{detail.sale.shipping_address.line2}</p>}
                <p>
                  {detail.sale.shipping_address.city}, {detail.sale.shipping_address.state} -{' '}
                  {detail.sale.shipping_address.pincode}
                </p>
              </div>
            )}

            <div className="items-head">Items</div>

            <div className="items grid">
              {Array.isArray(detail?.items) && detail.items.length > 0 ? (
                detail.items.map((it, i) => (
                  <div className="item cardish" key={`${it.variant_id}-${i}`}>
                    <div className="media wide">
                      {it.image_url ? <img src={it.image_url} alt="" /> : <div className="ph" />}
                    </div>
                    <div className="info cols">
                      <div className="row">
                        <span className="label">Variant</span>
                        <span>#{it.variant_id}</span>
                      </div>
                      <div className="row">
                        <span className="label">Size</span>
                        <span>{it.size || '-'}</span>
                      </div>
                      <div className="row">
                        <span className="label">Colour</span>
                        <span>{it.colour || '-'}</span>
                      </div>
                      <div className="row">
                        <span className="label">EAN</span>
                        <span className="muted">{it.ean_code || '-'}</span>
                      </div>
                    </div>
                    <div className="money tall">
                      <div className="qty">x{it.qty}</div>
                      <div className="price">{fmt(it.price)}</div>
                      {it.mrp != null && Number(it.mrp) > 0 ? (
                        <div className="mrp">MRP {fmt(it.mrp)}</div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty">No items</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
