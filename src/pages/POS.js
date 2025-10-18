import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './NavbarAdmin';
import './POS.css';
import { useAuth } from './AdminAuth';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`);

export default function POS() {
  const { token, user } = useAuth();
  const branchId = user?.branch_id || user?.branchId || null;

  const [saleId, setSaleId] = useState(uid());
  const [ean, setEan] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [payMethod, setPayMethod] = useState('CASH');
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const headersAuth = useMemo(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1500);
  };

  const totals = useMemo(() => {
    let qty = 0;
    let total = 0;
    for (const it of items) {
      qty += it.qty;
      total += it.qty * Number(it.price || 0);
    }
    return { qty, total };
  }, [items]);

  const fetchByEAN = async (code) => {
    const res = await fetch(`${API_BASE}/api/barcodes/${encodeURIComponent(code)}`);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.message || 'Not found');
    }
    return res.json();
  };

  const reserveScan = async ({ ean_code, qty = 1 }) => {
    const body = {
      branch_id: branchId,
      ean_code,
      qty,
      sale_id: saleId,
      client_action_id: uid(),
    };
    const res = await fetch(`${API_BASE}/api/inventory/scan`, {
      method: 'POST',
      headers: headersAuth,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.message || 'Scan failed');
    }
    return res.json();
  };

  const handleScan = async (codeFromInput) => {
    const code = String(codeFromInput || ean || '').trim();
    if (!code) return showToast('Enter EAN');
    if (!branchId) {
      setError('No branch assigned to this user');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchByEAN(code);
      await reserveScan({ ean_code: code, qty: 1 });
      const variantId = Number(data.variant_id);
      const price = Number(data.sale_price ?? data.mrp ?? 0);
      const image = data.image_url || (data.ean_code ? `https://res.cloudinary.com/deymt9uyh/image/upload/f_auto,q_auto/products/${data.ean_code}` : '');
      setItems((prev) => {
        const ix = prev.findIndex((p) => p.variant_id === variantId);
        if (ix >= 0) {
          const updated = [...prev];
          updated[ix] = { ...updated[ix], qty: updated[ix].qty + 1 };
          return updated;
        }
        return [
          ...prev,
          {
            variant_id: variantId,
            ean_code: data.ean_code,
            name: data.product_name || 'Product',
            brand: data.brand_name || '',
            size: data.size || '',
            colour: data.colour || '',
            price,
            mrp: Number(data.mrp || 0),
            image_url: image,
            qty: 1,
          },
        ];
      });
      showToast('Added');
    } catch (e) {
      setError(e.message || 'Scan failed');
      showToast('Not found');
    } finally {
      setLoading(false);
      setEan('');
      inputRef.current?.focus();
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScan(ean);
    }
  };

  const addOne = async (row) => {
    try {
      await reserveScan({ ean_code: row.ean_code, qty: 1 });
      setItems((prev) => prev.map((p) => (p.variant_id === row.variant_id ? { ...p, qty: p.qty + 1 } : p)));
      showToast('+1');
    } catch (e) {
      setError(e.message || 'Failed to add');
    }
  };

  const startNewSale = () => {
    setItems([]);
    setSaleId(uid());
    setPayMethod('CASH');
    setCheckoutOpen(false);
    setSuccessOpen(false);
    setError('');
    setEan('');
    inputRef.current?.focus();
  };

  const proceedCheckout = () => {
    if (!items.length) return;
    setCheckoutOpen(true);
  };

  const confirmSale = async () => {
    if (!items.length) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        sale_id: saleId,
        branch_id: branchId,
        payment: {
          method: payMethod,
          ref: null,
        },
        items: items.map((it) => ({
          variant_id: it.variant_id,
          ean_code: it.ean_code,
          qty: it.qty,
          price: it.price,
        })),
        client_action_id: uid(),
      };
      const res = await fetch(`${API_BASE}/api/sales/confirm`, {
        method: 'POST',
        headers: headersAuth,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Confirm failed');
      }
      await res.json();
      setCheckoutOpen(false);
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        startNewSale();
      }, 1400);
    } catch (e) {
      setError(e.message || 'Confirm failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pos-page">
      <Navbar />
      <div className="pos-shell">
        <div className="pos-topbar">
          <div className="pos-breadcrumb">
            <div className="pos-title">Billing</div>
            <div className="pos-sub">Branch {branchId || '-'} • Sale {saleId.slice(0, 8)}</div>
          </div>
          <div className="pos-actions">
            <button className="btn ghost" onClick={startNewSale}>New</button>
            <button className="btn primary" onClick={proceedCheckout} disabled={!items.length}>Proceed to Checkout</button>
          </div>
        </div>

        <div className="scan-panel">
          <div className="scan-left">
            <div className="scan-label">Scan EAN</div>
            <input
              ref={inputRef}
              className="scan-input"
              placeholder="Scan barcode or type EAN"
              value={ean}
              onChange={(e) => setEan(e.target.value.replace(/[^\d]/g, ''))}
              onKeyDown={handleEnter}
              inputMode="numeric"
            />
            <button className="btn" onClick={() => handleScan(ean)} disabled={loading || !ean}>{loading ? 'Searching…' : 'Add'}</button>
            <div className="scan-hint">If a product doesn’t scan, type the EAN and press Enter</div>
          </div>
          <div className="scan-summary">
            <div className="summary-box">
              <div className="summary-line">
                <span>Items</span>
                <b>{totals.qty}</b>
              </div>
              <div className="summary-line">
                <span>Total</span>
                <b>₹{totals.total.toFixed(2)}</b>
              </div>
              <button className="btn primary full" onClick={proceedCheckout} disabled={!items.length}>Checkout</button>
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <div className="table-head">
            <div className="th img">Image</div>
            <div className="th item">Item</div>
            <div className="th price">Price</div>
            <div className="th qty">Qty</div>
            <div className="th total">Total</div>
          </div>
          {items.length === 0 ? (
            <div className="table-empty">Scan items to begin</div>
          ) : (
            items.map((it) => (
              <div key={it.variant_id} className="table-row">
                <div className="td img">
                  {it.image_url ? <img src={it.image_url} alt={it.name} /> : <div className="img-ph" />}
                </div>
                <div className="td item">
                  <div className="item-name">{it.name}</div>
                  <div className="item-meta">
                    <span>{it.brand || '-'}</span>
                    <span>Size {it.size || '-'}</span>
                    <span>Color {it.colour || '-'}</span>
                    <span>EAN {it.ean_code}</span>
                  </div>
                </div>
                <div className="td price">₹{Number(it.price).toFixed(2)}</div>
                <div className="td qty">
                  <button className="btn tiny" onClick={() => addOne(it)}>+1</button>
                  <div className="qty-box">{it.qty}</div>
                </div>
                <div className="td total">₹{(it.qty * Number(it.price)).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        {(error || toast) && (
          <div className="alerts">
            {error ? <div className="alert error">{error}</div> : null}
            {toast ? <div className="alert note">{toast}</div> : null}
          </div>
        )}
      </div>

      {checkoutOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">Payment</div>
              <button className="modal-x" onClick={() => setCheckoutOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="pay-options">
                <label className={`pay-opt ${payMethod === 'CASH' ? 'active' : ''}`}>
                  <input type="radio" name="pay" value="CASH" checked={payMethod === 'CASH'} onChange={() => setPayMethod('CASH')} />
                  <span>Cash</span>
                </label>
                <label className={`pay-opt ${payMethod === 'UPI' ? 'active' : ''}`}>
                  <input type="radio" name="pay" value="UPI" checked={payMethod === 'UPI'} onChange={() => setPayMethod('UPI')} />
                  <span>UPI</span>
                </label>
                <label className={`pay-opt ${payMethod === 'ONLINE' ? 'active' : ''}`}>
                  <input type="radio" name="pay" value="ONLINE" checked={payMethod === 'ONLINE'} onChange={() => setPayMethod('ONLINE')} />
                  <span>Online</span>
                </label>
              </div>
              <div className="modal-summary">
                <div>Items: <b>{totals.qty}</b></div>
                <div>Total: <b>₹{totals.total.toFixed(2)}</b></div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn ghost" onClick={() => setCheckoutOpen(false)}>Back</button>
              <button className="btn primary" onClick={confirmSale} disabled={submitting}>{submitting ? 'Confirming…' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}

      {successOpen && (
        <div className="modal-backdrop">
          <div className="modal success">
            <div className="success-icon">✓</div>
            <div className="success-title">Payment Successful</div>
            <div className="success-sub">Ready for next customer</div>
          </div>
        </div>
      )}
    </div>
  );
}
