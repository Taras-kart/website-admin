import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Stocks.css';
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
  "ops-password": ["tadm-operations-ops-password"],
  "stocks-page": ["tadm-stocks-stocks-page"],
  "stocks-toolbar": ["tadm-stocks-stocks-toolbar"],
  "bar-row": ["tadm-stocks-bar-row"],
  "seg": ["tadm-stocks-seg"],
  "seg-btn": ["tadm-stocks-seg-btn"],
  "active": ["tadm-stocks-active"],
  "right-tools": ["tadm-stocks-right-tools"],
  "export": ["tadm-stocks-export"],
  "disabled": ["tadm-stocks-disabled"],
  "summary-cards": ["tadm-stocks-summary-cards"],
  "card": ["tadm-stocks-card"],
  "ok": ["tadm-stocks-ok"],
  "warn": ["tadm-stocks-warn"],
  "danger": ["tadm-stocks-danger"],
  "card-title": ["tadm-stocks-card-title"],
  "card-value": ["tadm-stocks-card-value"],
  "chips": ["tadm-stocks-chips"],
  "chip": ["tadm-stocks-chip"],
  "control-row": ["tadm-stocks-control-row"],
  "search-wrap": ["tadm-stocks-search-wrap"],
  "search": ["tadm-stocks-search"],
  "select": ["tadm-stocks-select"],
  "clear": ["tadm-stocks-clear"],
  "refresh": ["tadm-stocks-refresh"],
  "thresholds": ["tadm-stocks-thresholds"],
  "threshold": ["tadm-stocks-threshold"],
  "section-table": ["tadm-stocks-section-table"],
  "table-container": ["tadm-stocks-table-container"],
  "stock-table": ["tadm-stocks-stock-table"],
  "al": ["tadm-stocks-al"],
  "ar": ["tadm-stocks-ar"],
  "mono": ["tadm-stocks-mono"],
  "truncate": ["tadm-stocks-truncate"],
  "status": ["tadm-stocks-status"],
  "low": ["tadm-stocks-low"],
  "high": ["tadm-stocks-high"],
  "out": ["tadm-stocks-out"],
  "row-low": ["tadm-stocks-row-low"],
  "row-high": ["tadm-stocks-row-high"],
  "row-out": ["tadm-stocks-row-out"]
})[name] || ["tadm-stocks-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const toArray = x => Array.isArray(x) ? x : [];
const num = v => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').trim());
  return Number.isFinite(n) ? n : 0;
};
const safe = v => v == null ? '' : String(v);
const nf = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) : '-';
};
const cf = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '-';
};
export default function Stocks() {
  const {
    user
  } = useAuth();
  const branchId = user?.branch_id;
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chip, setChip] = useState('All');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [lowThreshold, setLowThreshold] = useState(10);
  const [highThreshold, setHighThreshold] = useState(100);
  const [gender, setGender] = useState('ALL');
  const searchRef = useRef(null);
  const [csvUrl, setCsvUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  useEffect(() => {
    const g = localStorage.getItem('stocks_gender') || 'ALL';
    setGender(g);
  }, []);
  const fetchStocks = useCallback(async () => {
    if (!branchId) {
      setRaw([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token') || '';
      const params = new URLSearchParams();
      if (gender !== 'ALL') params.set('gender', gender);
      const res = await fetch(`${API_BASE}/api/branch/${encodeURIComponent(branchId)}/stock${params.toString() ? `?${params.toString()}` : ''}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
        credentials: 'omit',
        mode: 'cors'
      });
      const data = res.ok ? await res.json() : [];
      setRaw(toArray(data));
    } catch {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, [branchId, gender]);
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);
  const rows = useMemo(() => toArray(raw).map((s, idx) => {
    const id = s.variant_id ?? idx + 1;
    const brand = safe(s.brand_name);
    const product = safe(s.product_name);
    const pattern = safe(s.pattern_code);
    const fit = safe(s.fit_type);
    const mark = safe(s.mark_code);
    const color = safe(s.colour);
    const size = safe(s.size);
    const ean = safe(s.ean_code);
    const mrp = num(s.mrp);
    const sale = num(s.sale_price);
    const cost = num(s.cost_price);
    const quantity = num(s.on_hand);
    const reserved = num(s.reserved);
    let status = 'ok';
    if (quantity <= 0) status = 'out';else if (quantity <= lowThreshold) status = 'low';else if (quantity >= highThreshold) status = 'high';
    return {
      id,
      brand,
      product,
      pattern,
      fit,
      mark,
      color,
      size,
      ean,
      mrp,
      sale,
      cost,
      quantity,
      reserved,
      status
    };
  }), [raw, lowThreshold, highThreshold]);
  const brands = useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.brand).filter(Boolean))).sort()], [rows]);
  const counts = useMemo(() => {
    const totalUnits = rows.reduce((a, b) => a + b.quantity, 0);
    const out = rows.filter(r => r.status === 'out').length;
    const low = rows.filter(r => r.status === 'low').length;
    const high = rows.filter(r => r.status === 'high').length;
    return {
      totalSkus: rows.length,
      totalUnits,
      out,
      low,
      high
    };
  }, [rows]);
  const filtered = useMemo(() => {
    let list = rows;
    if (chip === 'Alerts') list = list.filter(r => r.status === 'out' || r.status === 'low');
    if (chip === 'Low Stock') list = list.filter(r => r.status === 'low');
    if (chip === 'High Stock') list = list.filter(r => r.status === 'high');
    if (chip === 'Out of Stock') list = list.filter(r => r.status === 'out');
    if (brand !== 'All') list = list.filter(r => r.brand === brand);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => [r.brand, r.product, r.pattern, r.fit, r.mark, r.color, r.size, r.ean].some(x => x.toLowerCase().includes(q)));
    }
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => b.id - a.id);
    if (sortBy === 'qty_desc') sorted.sort((a, b) => b.quantity - a.quantity);
    if (sortBy === 'qty_asc') sorted.sort((a, b) => a.quantity - b.quantity);
    if (sortBy === 'mrp_desc') sorted.sort((a, b) => b.mrp - a.mrp);
    if (sortBy === 'mrp_asc') sorted.sort((a, b) => a.mrp - b.mrp);
    if (sortBy === 'sale_desc') sorted.sort((a, b) => b.sale - a.sale);
    if (sortBy === 'sale_asc') sorted.sort((a, b) => a.sale - b.sale);
    if (sortBy === 'brand_asc') sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    return sorted;
  }, [rows, chip, brand, search, sortBy]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);
  useEffect(() => {
    if (!filtered.length) {
      setCsvUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
      return;
    }
    const header = ['Sl. No,Status,Brand,Product,Pattern,Fit,Mark,Size,Colour,EAN,MRP,Sale Price,Cost Price,Qty,Reserved'];
    const lines = paginatedRows.map((s, i) => [i + 1, s.status.toUpperCase(), `"${(s.brand || '').replace(/"/g, '""')}"`, `"${(s.product || '').replace(/"/g, '""')}"`, `"${(s.pattern || '').replace(/"/g, '""')}"`, `"${(s.fit || '').replace(/"/g, '""')}"`, `"${(s.mark || '').replace(/"/g, '""')}"`, `"${(s.size || '').replace(/"/g, '""')}"`, `"${(s.color || '').replace(/"/g, '""')}"`, `"${(s.ean || '').replace(/"/g, '""')}"`, s.mrp, s.sale, s.cost, s.quantity, s.reserved].join(','));
    const csv = [...header, ...lines].join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    setCsvUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [filtered, paginatedRows]);
  useEffect(() => {
    return () => {
      if (csvUrl) URL.revokeObjectURL(csvUrl);
    };
  }, [csvUrl]);
  const onGenderChange = g => {
    setGender(g);
    localStorage.setItem('stocks_gender', g);
  };
  const clearSearch = () => {
    setSearch('');
    searchRef.current?.focus();
  };
  return <div className={portalClass("stocks-page")}>
      
      <div className={portalClass("stocks-toolbar")}>
        <div className={portalClass("bar-row")}>
          <div className={portalClass("seg")}>
            <button className={portalClass(`seg-btn ${gender === 'ALL' ? 'active' : ''}`)} onClick={() => onGenderChange('ALL')}>All</button>
            <button className={portalClass(`seg-btn ${gender === 'MEN' ? 'active' : ''}`)} onClick={() => onGenderChange('MEN')}>Men</button>
            <button className={portalClass(`seg-btn ${gender === 'WOMEN' ? 'active' : ''}`)} onClick={() => onGenderChange('WOMEN')}>Women</button>
            <button className={portalClass(`seg-btn ${gender === 'KIDS' ? 'active' : ''}`)} onClick={() => onGenderChange('KIDS')}>Kids</button>
          </div>
          <div className={portalClass("right-tools")}>
            {csvUrl ? <a className={portalClass("export")} href={csvUrl} download={`stock_${gender.toLowerCase()}.csv`}>Export CSV</a> : <button className={portalClass("export disabled")} disabled>Export CSV</button>}
            <button className={portalClass("refresh")} onClick={fetchStocks}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </div>

        <div className={portalClass("summary-cards")}>
          <div className={portalClass("card")}>
            <div className={portalClass("card-title")}>Total SKUs</div>
            <div className={portalClass("card-value")}>{nf(counts.totalSkus)}</div>
          </div>
          <div className={portalClass("card")}>
            <div className={portalClass("card-title")}>Total Units</div>
            <div className={portalClass("card-value")}>{nf(counts.totalUnits)}</div>
          </div>
          <div className={portalClass("card warn")}>
            <div className={portalClass("card-title")}>Low Stock</div>
            <div className={portalClass("card-value")}>{nf(counts.low)}</div>
          </div>
          <div className={portalClass("card danger")}>
            <div className={portalClass("card-title")}>Out of Stock</div>
            <div className={portalClass("card-value")}>{nf(counts.out)}</div>
          </div>
          <div className={portalClass("card ok")}>
            <div className={portalClass("card-title")}>High Stock</div>
            <div className={portalClass("card-value")}>{nf(counts.high)}</div>
          </div>
        </div>

        <div className={portalClass("chips")}>
          {['All', 'Alerts', 'Low Stock', 'High Stock', 'Out of Stock'].map(c => <button key={c} className={portalClass(`chip ${chip === c ? 'active' : ''}`)} onClick={() => setChip(c)}>
              {c}
            </button>)}
        </div>

        <div className={portalClass("control-row")}>
          <div className={portalClass("search-wrap")}>
            <input ref={searchRef} className={portalClass("search")} placeholder="Search brand, product, pattern, fit, mark, color, size, EAN" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className={portalClass("clear")} onClick={clearSearch}>✕</button>}
          </div>
          <select className={portalClass("select")} value={brand} onChange={e => setBrand(e.target.value)}>
            {brands.map(b => <option key={b} value={b} className="tadm-stocks-node-0">
                {b}
              </option>)}
          </select>
          <select className={portalClass("select")} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent" className="tadm-stocks-node-1">Sort: Recent</option>
            <option value="qty_desc" className="tadm-stocks-node-2">Qty: High → Low</option>
            <option value="qty_asc" className="tadm-stocks-node-3">Qty: Low → High</option>
            <option value="mrp_desc" className="tadm-stocks-node-4">MRP: High → Low</option>
            <option value="mrp_asc" className="tadm-stocks-node-5">MRP: Low → High</option>
            <option value="sale_desc" className="tadm-stocks-node-6">Sale Price: High → Low</option>
            <option value="sale_asc" className="tadm-stocks-node-7">Sale Price: Low → High</option>
            <option value="brand_asc" className="tadm-stocks-node-8">Brand: A → Z</option>
          </select>
        </div>

        <div className={portalClass("thresholds")}>
          <div className={portalClass("threshold")}>
            <label className="tadm-stocks-node-9">Low ≤</label>
            <input type="number" min="0" value={lowThreshold} onChange={e => setLowThreshold(Math.max(0, parseInt(e.target.value || '0', 10)))} className="tadm-stocks-node-10" />
          </div>
          <div className={portalClass("threshold")}>
            <label className="tadm-stocks-node-11">High ≥</label>
            <input type="number" min="0" value={highThreshold} onChange={e => setHighThreshold(Math.max(0, parseInt(e.target.value || '0', 10)))} className="tadm-stocks-node-12" />
          </div>
        </div>
      </div>

      

      <div className={portalClass("section-table")}>
        <h3 className="tadm-stocks-node-13">Live Stock Overview</h3>
        {loading ? <p className="tadm-stocks-node-14">Loading stocks...</p> : <div className={portalClass("table-container")}>
            
            <table className={portalClass("stock-table")}>
              <colgroup className="tadm-stocks-node-15">
                <col style={{
              width: '70px'
            }} className="tadm-stocks-node-16" />
                <col style={{
              width: '90px'
            }} className="tadm-stocks-node-17" />
                <col style={{
              width: '160px'
            }} className="tadm-stocks-node-18" />
                <col style={{
              width: '220px'
            }} className="tadm-stocks-node-19" />
                <col style={{
              width: '120px'
            }} className="tadm-stocks-node-20" />
                <col style={{
              width: '120px'
            }} className="tadm-stocks-node-21" />
                <col style={{
              width: '110px'
            }} className="tadm-stocks-node-22" />
                <col style={{
              width: '90px'
            }} className="tadm-stocks-node-23" />
                <col style={{
              width: '160px'
            }} className="tadm-stocks-node-24" />
                <col style={{
              width: '160px'
            }} className="tadm-stocks-node-25" />
                <col style={{
              width: '120px'
            }} className="tadm-stocks-node-26" />
                <col style={{
              width: '130px'
            }} className="tadm-stocks-node-27" />
                <col style={{
              width: '130px'
            }} className="tadm-stocks-node-28" />
                <col style={{
              width: '100px'
            }} className="tadm-stocks-node-29" />
                <col style={{
              width: '110px'
            }} className="tadm-stocks-node-30" />
              </colgroup>
              <thead className="tadm-stocks-node-31">
                <tr className="tadm-stocks-node-32">
                  <th className="tadm-stocks-node-33">Sl. No</th>
                  <th className="tadm-stocks-node-34">Status</th>
                  <th className={portalClass("al")}>Brand</th>
                  <th className={portalClass("al")}>Product</th>
                  <th className={portalClass("al")}>Pattern</th>
                  <th className={portalClass("al")}>Fit</th>
                  <th className={portalClass("al")}>Mark</th>
                  <th className="tadm-stocks-node-35">Size</th>
                  <th className={portalClass("al")}>Colour</th>
                  <th className={portalClass("al")}>EAN</th>
                  <th className={portalClass("ar")}>MRP</th>
                  <th className={portalClass("ar")}>Sale Price</th>
                  <th className={portalClass("ar")}>Cost Price</th>
                  <th className={portalClass("ar")}>Qty</th>
                  <th className={portalClass("ar")}>Reserved</th>
                </tr>
              </thead>
              <tbody className="tadm-stocks-node-36">
            {paginatedRows.map((s, index) => <tr key={s.id} className={portalClass(`row-${s.status}`)}>
                    <td className={portalClass("mono")}>{index + 1}</td>
                    <td className="tadm-stocks-node-37">
                      <span className={portalClass(`status ${s.status}`)}>
                        {s.status === 'out' ? 'Out' : s.status === 'low' ? 'Low' : s.status === 'high' ? 'High' : 'OK'}
                      </span>
                    </td>
                    <td className={portalClass("al truncate")} title={s.brand}>{s.brand || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.product}>{s.product || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.pattern}>{s.pattern || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.fit}>{s.fit || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.mark}>{s.mark || '-'}</td>
                    <td className={portalClass("mono")}>{s.size || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.color}>{s.color || '-'}</td>
                    <td className={portalClass("al mono truncate")} title={s.ean}>{s.ean || '-'}</td>
                    <td className={portalClass("ar")}>{cf(s.mrp)}</td>
                    <td className={portalClass("ar")}>{cf(s.sale)}</td>
                    <td className={portalClass("ar")}>{cf(s.cost)}</td>
                    <td className={portalClass("ar")}>{nf(s.quantity)}</td>
                    <td className={portalClass("ar")}>{nf(s.reserved)}</td>
                  </tr>)}
                {!filtered.length && <tr className="tadm-stocks-node-38">
                    <td colSpan="15" style={{
                padding: 16,
                color: "#42536a"
              }} className="tadm-stocks-node-39">No matching records</td>
                  </tr>}
              </tbody>
            </table>
            {totalPages > 1 && <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '16px',
          background: "#ffffff"
        }} className="tadm-stocks-node-40">
    <button className={portalClass("refresh")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
      Previous
    </button>
    <span style={{
            color: "#42536a",
            fontWeight: 'bold'
          }} className="tadm-stocks-node-41">Page {currentPage} of {totalPages}</span>
    <button className={portalClass("refresh")} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>}
          </div>}
      </div>
    </div>;
}
