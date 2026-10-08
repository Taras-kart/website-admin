import React, { useEffect, useMemo, useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import useOfflineQueue from './useOfflineQueue';
import { apiGet, apiPost } from './api';
import { useAuth } from './AdminAuth';
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
})[name] || ["tadm-posscan-" + name]).join(' ');
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
export default function POSScan() {
  const {
    user
  } = useAuth();
  const [branchId, setBranchId] = useState('');
  const [saleId, setSaleId] = useState(localStorage.getItem('pos_sale_id') || uuid());
  const [lines, setLines] = useState([]);
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState({
    method: 'cash',
    amount: '',
    ref: ''
  });
  const {
    queue,
    enqueue
  } = useOfflineQueue();
  useEffect(() => {
    const b = String(user?.branch_id || localStorage.getItem('pos_branch_id') || '').trim();
    setBranchId(b);
    if (b) localStorage.setItem('pos_branch_id', b);
  }, [user?.branch_id]);
  const total = useMemo(() => lines.reduce((a, b) => a + (Number(b.price) || 0) * (Number(b.qty) || 1), 0), [lines]);
  const addOrIncrement = line => {
    setLines(prev => {
      const idx = prev.findIndex(x => x.productId === line.productId && x.barcode === line.barcode);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          qty: (copy[idx].qty || 1) + 1
        };
        return copy;
      }
      return [...prev, {
        ...line,
        qty: 1
      }];
    });
  };
  async function lookupBarcode(barcode) {
    setStatus('Looking up...');
    try {
      const p = await apiGet(`/api/barcodes/${encodeURIComponent(barcode)}`).catch(() => null);
      if (!p) {
        setStatus(`No match: ${barcode}`);
        return;
      }
      const price = Number(p.retail_price ?? p.final_price_b2c ?? p.final_price ?? 0);
      addOrIncrement({
        id: uuid(),
        productId: p.id || p.variant_id || p.product_id || 0,
        name: p.product_name || p.name || 'Product',
        price: price,
        barcode
      });
      const actionId = uuid();
      const payload = {
        branch_id: branchId || user?.branch_id,
        ean_code: barcode,
        qty: 1,
        sale_id: saleId,
        client_action_id: actionId
      };
      try {
        await apiPost('/api/inventory/scan', payload);
      } catch {
        enqueue({
          id: actionId,
          url: '/api/inventory/scan',
          method: 'POST',
          body: payload
        });
      }
      setStatus('Added');
    } catch {
      setStatus('Lookup failed');
    } finally {
      setTimeout(() => setStatus(''), 1000);
    }
  }
  const changeQty = (lineId, delta) => {
    setLines(prev => prev.map(l => l.id === lineId ? {
      ...l,
      qty: Math.max(1, (l.qty || 1) + delta)
    } : l));
  };
  const removeLine = lineId => setLines(prev => prev.filter(l => l.id !== lineId));
  const startNewSale = () => {
    const id = uuid();
    setSaleId(id);
    localStorage.setItem('pos_sale_id', id);
    setLines([]);
  };
  async function confirmSale() {
    if (!lines.length) return;
    const actionId = uuid();
    const payload = {
      sale_id: saleId,
      branch_id: branchId || user?.branch_id,
      payment: {
        ...payment,
        amount: Number(payment.amount) || total
      },
      items: lines.map(l => ({
        variant_id: l.productId,
        qty: l.qty,
        ean_code: l.barcode,
        price: l.price
      })),
      client_action_id: actionId
    };
    try {
      await apiPost('/api/sales/confirm', payload);
      setStatus('Sale confirmed');
      startNewSale();
    } catch {
      enqueue({
        id: actionId,
        url: '/api/sales/confirm',
        method: 'POST',
        body: payload
      });
      setStatus('Queued (offline)');
      startNewSale();
    } finally {
      setTimeout(() => setStatus(''), 1500);
    }
  }
  return <div className={portalClass("pos-scan-page")}>
      
      <div style={{
      maxWidth: 1080,
      margin: '0 auto',
      padding: 16
    }} className="tadm-posscan-node-0">
        <h2 className="tadm-posscan-node-1">Branch POS</h2>
        <p style={{
        opacity: 0.8,
        marginTop: -6
      }} className="tadm-posscan-node-2">Scan items, then confirm after payment.</p>

        <div className={portalClass("pos-top")} style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'start'
      }}>
          <div className={portalClass("card")} style={{
          padding: 12
        }}>
            <label className="tadm-posscan-node-3">Branch</label>
            <div style={{
            marginTop: 6,
            fontWeight: 600
          }} className="tadm-posscan-node-4">{branchId || '—'}</div>
            <div style={{
            marginTop: 12
          }} className="tadm-posscan-node-5">
              <label className="tadm-posscan-node-6">Sale ID</label>
              <div style={{
              display: 'flex',
              gap: 8
            }} className="tadm-posscan-node-7">
                <input value={saleId} readOnly className="tadm-posscan-node-8" />
                <button onClick={startNewSale} className="tadm-posscan-node-9">New Sale</button>
              </div>
              <small style={{
              opacity: 0.7
            }} className="tadm-posscan-node-10">Queued actions: {queue.length}</small>
            </div>
          </div>

          <div className={portalClass("card")} style={{
          padding: 12
        }}>
            <label className="tadm-posscan-node-11">Scan / Enter Barcode</label>
            <BarcodeScanner onDetected={lookupBarcode} />
            {status && <div style={{
            marginTop: 8,
            color: "#42536a"
          }} className="tadm-posscan-node-12">{status}</div>}
          </div>
        </div>

        <div className={portalClass("card")} style={{
        marginTop: 16,
        padding: 12
      }}>
          <h3 className="tadm-posscan-node-13">Items</h3>
          <table style={{
          width: '100%',
          marginTop: 8
        }} className="tadm-posscan-node-14">
            <thead className="tadm-posscan-node-15">
              <tr className="tadm-posscan-node-16">
                <th className="tadm-posscan-node-17">Product</th>
                <th className="tadm-posscan-node-18">Barcode</th>
                <th className="tadm-posscan-node-19">Qty</th>
                <th className="tadm-posscan-node-20">Price</th>
                <th className="tadm-posscan-node-21">Subtotal</th>
                <th className="tadm-posscan-node-22"></th>
              </tr>
            </thead>
            <tbody className="tadm-posscan-node-23">
              {lines.map(l => <tr key={l.id} className="tadm-posscan-node-24">
                  <td className="tadm-posscan-node-25">{l.name}</td>
                  <td className="tadm-posscan-node-26">{l.barcode}</td>
                  <td className="tadm-posscan-node-27">
                    <div style={{
                  display: 'inline-flex',
                  gap: 6,
                  alignItems: 'center'
                }} className="tadm-posscan-node-28">
                      <button onClick={() => changeQty(l.id, -1)} className="tadm-posscan-node-29">-</button>
                      <span className="tadm-posscan-node-30">{l.qty}</span>
                      <button onClick={() => changeQty(l.id, +1)} className="tadm-posscan-node-31">+</button>
                    </div>
                  </td>
                  <td className="tadm-posscan-node-32">₹{Number(l.price || 0).toFixed(0)}</td>
                  <td className="tadm-posscan-node-33">₹{(Number(l.price || 0) * (l.qty || 1)).toFixed(0)}</td>
                  <td className="tadm-posscan-node-34"><button onClick={() => removeLine(l.id)} className="tadm-posscan-node-35">Remove</button></td>
                </tr>)}
              {!lines.length && <tr className="tadm-posscan-node-36">
                  <td colSpan="6" style={{
                padding: 12,
                color: "#42536a"
              }} className="tadm-posscan-node-37">No items yet. Scan a barcode.</td>
                </tr>}
            </tbody>
          </table>

          <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 12,
          gap: 16
        }} className="tadm-posscan-node-38">
            <div style={{
            textAlign: 'right'
          }} className="tadm-posscan-node-39">
              <div style={{
              fontSize: 14,
              opacity: 0.7
            }} className="tadm-posscan-node-40">Total</div>
              <div style={{
              fontWeight: 700,
              fontSize: 20
            }} className="tadm-posscan-node-41">₹{total.toFixed(0)}</div>
            </div>
          </div>
        </div>

        <div className={portalClass("card")} style={{
        marginTop: 16,
        padding: 12
      }}>
          <h3 className="tadm-posscan-node-42">Payment & Confirm</h3>
          <div style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: 'repeat(3, minmax(0,1fr))'
        }} className="tadm-posscan-node-43">
            <select value={payment.method} onChange={e => setPayment(p => ({
            ...p,
            method: e.target.value
          }))} className="tadm-posscan-node-44">
              <option value="cash" className="tadm-posscan-node-45">Cash</option>
              <option value="upi" className="tadm-posscan-node-46">UPI</option>
              <option value="card" className="tadm-posscan-node-47">Card</option>
            </select>
            <input type="number" placeholder="Amount (optional)" value={payment.amount} onChange={e => setPayment(p => ({
            ...p,
            amount: e.target.value
          }))} className="tadm-posscan-node-48" />
            <input type="text" placeholder="Ref / UTR (optional)" value={payment.ref} onChange={e => setPayment(p => ({
            ...p,
            ref: e.target.value
          }))} className="tadm-posscan-node-49" />
          </div>
          <div style={{
          marginTop: 12
        }} className="tadm-posscan-node-50">
            <button disabled={!branchId || !lines.length} onClick={confirmSale} className="tadm-posscan-node-51">Confirm Sale</button>
            {!branchId && <small style={{
            marginLeft: 8,
            color: "#42536a"
          }} className="tadm-posscan-node-52">Select branch</small>}
          </div>
        </div>
      </div>
    </div>;
}
