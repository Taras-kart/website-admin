import React, { useEffect, useMemo, useState } from 'react';
import './Stocks.css';
import Navbar from './NavbarAdmin';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');

const toArray = (x) => (Array.isArray(x) ? x : []);
const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').trim());
  return Number.isFinite(n) ? n : 0;
};

export default function Stocks() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chip, setChip] = useState('All');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [supplier, setSupplier] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [lowThreshold, setLowThreshold] = useState(10);
  const [highThreshold, setHighThreshold] = useState(100);
  const [minSalesFocus, setMinSalesFocus] = useState(1);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/stocks`);
      const data = res.ok ? await res.json() : [];
      setRaw(toArray(data));
    } catch {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const rows = useMemo(
    () =>
      toArray(raw).map((s, idx) => {
        const id = s.id ?? idx + 1;
        const brand = s.brand ?? s.Brand ?? '';
        const product = s.productName ?? s.product_name ?? s.name ?? '';
        const color = s.color ?? '';
        const size = s.size ?? '';
        const quantity = num(s.quantity ?? s.qty ?? s.remaining ?? s.stock ?? 0);
        const supplier = s.supplier ?? s.vendor ?? '';
        const imageUrl = s.imageUrl ?? s.image_url ?? s.image ?? '';
        const sold30 = num(s.sold_30d ?? s.sales_30d ?? s.monthlySales ?? s.sold ?? 0);
        const orders30 = num(s.orders_30d ?? s.order_30d ?? 0);
        const sellThroughPct = (sold30 / Math.max(1, sold30 + quantity)) * 100;
        let status = 'ok';
        if (quantity <= 0) status = 'out';
        else if (quantity <= lowThreshold) status = 'low';
        else if (quantity >= highThreshold) status = 'high';
        return {
          id,
          brand,
          product,
          color,
          size,
          quantity,
          supplier,
          imageUrl,
          sold30,
          orders30,
          sellThroughPct,
          status
        };
      }),
    [raw, lowThreshold, highThreshold]
  );

  const brands = useMemo(() => ['All', ...Array.from(new Set(rows.map((r) => r.brand).filter(Boolean))).sort()], [rows]);
  const suppliers = useMemo(() => ['All', ...Array.from(new Set(rows.map((r) => r.supplier).filter(Boolean))).sort()], [rows]);

  const counts = useMemo(() => {
    const totalUnits = rows.reduce((a, b) => a + b.quantity, 0);
    const out = rows.filter((r) => r.status === 'out').length;
    const low = rows.filter((r) => r.status === 'low').length;
    const high = rows.filter((r) => r.status === 'high').length;
    const top = [...rows].sort((a, b) => b.sold30 - a.sold30).slice(0, Math.max(1, Math.floor(rows.length * 0.2))).map((r) => r.id);
    const slow = [...rows].sort((a, b) => a.sold30 - b.sold30).slice(0, Math.max(1, Math.floor(rows.length * 0.2))).map((r) => r.id);
    return { totalSkus: rows.length, totalUnits, out, low, high, topSet: new Set(top), slowSet: new Set(slow) };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (chip === 'Alerts') list = list.filter((r) => r.status === 'out' || r.status === 'low');
    if (chip === 'Low Stock') list = list.filter((r) => r.status === 'low');
    if (chip === 'High Stock') list = list.filter((r) => r.status === 'high');
    if (chip === 'Top Sellers')
      list = list.filter((r) => r.sold30 >= minSalesFocus).sort((a, b) => b.sold30 - a.sold30);
    if (chip === 'Slow Movers')
      list = list.sort((a, b) => a.sold30 - b.sold30);
    if (chip === 'Out of Stock') list = list.filter((r) => r.status === 'out');
    if (brand !== 'All') list = list.filter((r) => r.brand === brand);
    if (supplier !== 'All') list = list.filter((r) => r.supplier === supplier);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.brand.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q) ||
          r.color.toLowerCase().includes(q) ||
          r.size.toLowerCase().includes(q) ||
          r.supplier.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => b.id - a.id);
    if (sortBy === 'qty_desc') sorted.sort((a, b) => b.quantity - a.quantity);
    if (sortBy === 'qty_asc') sorted.sort((a, b) => a.quantity - b.quantity);
    if (sortBy === 'sold_desc') sorted.sort((a, b) => b.sold30 - a.sold30);
    if (sortBy === 'sold_asc') sorted.sort((a, b) => a.sold30 - b.sold30);
    if (sortBy === 'sellthrough_desc') sorted.sort((a, b) => b.sellThroughPct - a.sellThroughPct);
    if (sortBy === 'brand_asc') sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    return sorted;
  }, [rows, chip, brand, supplier, search, sortBy, minSalesFocus]);

  return (
    <div className="stocks-page">
      <Navbar />
      <div className="stocks-toolbar">
        <div className="summary-cards">
          <div className="card">
            <div className="card-title">Total SKUs</div>
            <div className="card-value">{counts.totalSkus}</div>
          </div>
          <div className="card">
            <div className="card-title">Total Units</div>
            <div className="card-value">{counts.totalUnits}</div>
          </div>
          <div className="card warn">
            <div className="card-title">Low Stock</div>
            <div className="card-value">{counts.low}</div>
          </div>
          <div className="card danger">
            <div className="card-title">Out of Stock</div>
            <div className="card-value">{counts.out}</div>
          </div>
          <div className="card ok">
            <div className="card-title">High Stock</div>
            <div className="card-value">{counts.high}</div>
          </div>
        </div>
        <div className="chips">
          {['All', 'Alerts', 'Low Stock', 'High Stock', 'Top Sellers', 'Slow Movers', 'Out of Stock'].map((c) => (
            <button key={c} className={`chip ${chip === c ? 'active' : ''}`} onClick={() => setChip(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="control-row">
          <input
            className="search"
            placeholder="Search brand, product, color, size, supplier"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select className="select" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            {suppliers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Sort: Recent</option>
            <option value="qty_desc">Qty: High → Low</option>
            <option value="qty_asc">Qty: Low → High</option>
            <option value="sold_desc">Sales 30d: High → Low</option>
            <option value="sold_asc">Sales 30d: Low → High</option>
            <option value="sellthrough_desc">Sell-through: High → Low</option>
            <option value="brand_asc">Brand: A → Z</option>
          </select>
          <button className="refresh" onClick={fetchStocks}>{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
        <div className="thresholds">
          <div className="threshold">
            <label>Low ≤</label>
            <input
              type="number"
              min="0"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(Math.max(0, parseInt(e.target.value || '0', 10)))}
            />
          </div>
          <div className="threshold">
            <label>High ≥</label>
            <input
              type="number"
              min="0"
              value={highThreshold}
              onChange={(e) => setHighThreshold(Math.max(0, parseInt(e.target.value || '0', 10)))}
            />
          </div>
          <div className="threshold">
            <label>Top Sellers min 30d</label>
            <input
              type="number"
              min="0"
              value={minSalesFocus}
              onChange={(e) => setMinSalesFocus(Math.max(0, parseInt(e.target.value || '0', 10)))}
            />
          </div>
        </div>
      </div>

      <div className="section-table">
        <h3>Live Stock Overview</h3>
        {loading ? (
          <p>Loading stocks...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Status</th>
                <th>Brand</th>
                <th>Product</th>
                <th>Color</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Sales (30d)</th>
                <th>Sell-through</th>
                <th>Supplier</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, index) => (
                <tr key={s.id} className={`row-${s.status}`}>
                  <td>{index + 1}</td>
                  <td>
                    <span className={`status ${s.status}`}>
                      {s.status === 'out' ? 'Out' : s.status === 'low' ? 'Low' : s.status === 'high' ? 'High' : 'OK'}
                    </span>
                  </td>
                  <td>{s.brand}</td>
                  <td>{s.product}</td>
                  <td>{s.color}</td>
                  <td>{s.size}</td>
                  <td>{s.quantity}</td>
                  <td>{s.sold30}</td>
                  <td>{Math.round(s.sellThroughPct)}%</td>
                  <td>{s.supplier || 'N/A'}</td>
                  <td>
                    <img src={s.imageUrl} alt={s.product} className="stock-image" />
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="11" style={{ padding: 16, color: 'gold' }}>No matching records</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
