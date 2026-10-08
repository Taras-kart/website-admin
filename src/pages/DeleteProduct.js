import React, { useEffect, useMemo, useState } from 'react';
import './DeleteProduct.css';
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
  "delete-product-page": ["tadm-deleteproduct-delete-product-page"],
  "delete-toolbar": ["tadm-deleteproduct-delete-toolbar"],
  "filters": ["tadm-deleteproduct-filters"],
  "chip": ["tadm-deleteproduct-chip"],
  "active": ["tadm-deleteproduct-active"],
  "tools": ["tadm-deleteproduct-tools"],
  "search-input": ["tadm-deleteproduct-search-input"],
  "sort-select": ["tadm-deleteproduct-sort-select"],
  "refresh-btn": ["tadm-deleteproduct-refresh-btn"],
  "danger-btn": ["tadm-deleteproduct-danger-btn"],
  "delete-section2": ["tadm-deleteproduct-delete-section2"],
  "table-scroll-wrapper": ["tadm-deleteproduct-table-scroll-wrapper"],
  "table-image": ["tadm-deleteproduct-table-image"],
  "delete-btn": ["tadm-deleteproduct-delete-btn"],
  "popup-card": ["tadm-deleteproduct-popup-card"],
  "popup-confirm-box": ["tadm-deleteproduct-popup-confirm-box"],
  "success": ["tadm-deleteproduct-success"],
  "error": ["tadm-deleteproduct-error"],
  "popup-actions": ["tadm-deleteproduct-popup-actions"],
  "pagination-controls": ["tadm-deleteproduct-pagination-controls"],
  "pagination-info": ["tadm-deleteproduct-pagination-info"]
})[name] || ["tadm-deleteproduct-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const DEFAULT_ASSETS_BASE = 'https://taras-kart-backend.vercel.app/uploads';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const ASSETS_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ASSETS_BASE) || DEFAULT_ASSETS_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const ASSETS_BASE = ASSETS_BASE_RAW.replace(/\/+$/, '');
const coerceNumber = v => {
  const n = typeof v === 'number' ? v : parseFloat(String(v || '').trim());
  return Number.isFinite(n) ? n : 0;
};
const normalizeAssetUrl = maybeRelative => {
  if (!maybeRelative) return '';
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  const base = ASSETS_BASE || API_BASE;
  const needsSlash = !maybeRelative.startsWith('/');
  return `${base}${needsSlash ? '/' : ''}${maybeRelative}`;
};
const computeFinal = (price, discount) => {
  const p = coerceNumber(price);
  const d = coerceNumber(discount);
  return Number((p - p * d / 100).toFixed(2));
};
const mapRow = p => ({
  id: p.id || p.product_id || p._id || p.uuid,
  category: p.category || '',
  brand: p.brand || '',
  product_name: p.product_name || '',
  color: p.color || '',
  size: p.size || '',
  original_price_b2b: coerceNumber(p.original_price_b2b),
  discount_b2b: coerceNumber(p.discount_b2b),
  final_price_b2b: coerceNumber(p.final_price_b2b),
  original_price_b2c: coerceNumber(p.original_price_b2c),
  discount_b2c: coerceNumber(p.discount_b2c),
  final_price_b2c: coerceNumber(p.final_price_b2c),
  total_count: coerceNumber(p.total_count),
  image_url: normalizeAssetUrl(p.image_url || p.image || p.imageUrl || p.path || '')
});
const getItemsFromResponse = data => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};
const getHasMoreFromResponse = (data, itemsLength, limit, page) => {
  if (typeof data?.hasMore === 'boolean') return data.hasMore;
  if (typeof data?.has_next === 'boolean') return data.has_next;
  if (typeof data?.nextPage === 'number') return data.nextPage > page;
  if (typeof data?.next_page === 'number') return data.next_page > page;
  if (typeof data?.totalPages === 'number') return page < data.totalPages;
  if (typeof data?.total_pages === 'number') return page < data.total_pages;
  if (typeof data?.total === 'number') return page * limit < data.total;
  if (typeof data?.count === 'number') return page * limit < data.count;
  return itemsLength === limit;
};
const fetchJson = async url => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return await res.json();
};
const fetchAllProducts = async () => {
  const directUrls = [`${API_BASE}/api/products?all=true`, `${API_BASE}/api/products?limit=50000`, `${API_BASE}/api/products`];
  for (const url of directUrls) {
    try {
      const data = await fetchJson(url);
      const items = getItemsFromResponse(data);
      if (Array.isArray(items) && items.length > 200) {
        return items.map(mapRow);
      }
    } catch {}
  }
  const pageSize = 1000;
  let page = 1;
  let hasMore = true;
  const all = [];
  const seen = new Set();
  while (hasMore) {
    const pageUrls = [`${API_BASE}/api/products?page=${page}&limit=${pageSize}`, `${API_BASE}/api/products?page=${page}&pageSize=${pageSize}`, `${API_BASE}/api/products?page=${page}&per_page=${pageSize}`, `${API_BASE}/api/products?offset=${(page - 1) * pageSize}&limit=${pageSize}`];
    let pageItems = [];
    let responseData = null;
    for (const url of pageUrls) {
      try {
        const data = await fetchJson(url);
        const items = getItemsFromResponse(data);
        if (Array.isArray(items) && items.length > 0) {
          pageItems = items;
          responseData = data;
          break;
        }
      } catch {}
    }
    if (!pageItems.length) break;
    let addedThisRound = 0;
    for (const item of pageItems) {
      const mapped = mapRow(item);
      const key = String(mapped.id ?? `${mapped.product_name}-${mapped.color}-${mapped.size}`);
      if (!seen.has(key)) {
        seen.add(key);
        all.push(mapped);
        addedThisRound += 1;
      }
    }
    if (addedThisRound === 0) break;
    hasMore = getHasMoreFromResponse(responseData, pageItems.length, pageSize, page);
    page += 1;
    if (page > 100) break;
  }
  if (all.length > 0) return all;
  return [];
};
const DeleteProduct = () => {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [confirmIds, setConfirmIds] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const allRows = await fetchAllProducts();
      setRows(allRows);
      setCurrentPage(1);
    } catch {
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);
  const filteredSortedRows = useMemo(() => {
    let list = rows;
    if (filter === 'Men') list = list.filter(r => String(r.category).toLowerCase() === 'men');else if (filter === 'Women') list = list.filter(r => String(r.category).toLowerCase() === 'women');else if (filter === 'Kids') list = list.filter(r => String(r.category).toLowerCase().startsWith('kids'));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => (r.brand || '').toLowerCase().includes(q) || (r.product_name || '').toLowerCase().includes(q) || (r.color || '').toLowerCase().includes(q) || (r.size || '').toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sortBy === 'recent') {
      sorted.sort((a, b) => {
        const av = Number(a.id) || 0;
        const bv = Number(b.id) || 0;
        return bv - av;
      });
    } else if (sortBy === 'price_b2c_asc') {
      sorted.sort((a, b) => computeFinal(a.original_price_b2c, a.discount_b2c) - computeFinal(b.original_price_b2c, b.discount_b2c));
    } else if (sortBy === 'price_b2c_desc') {
      sorted.sort((a, b) => computeFinal(b.original_price_b2c, b.discount_b2c) - computeFinal(a.original_price_b2c, a.discount_b2c));
    } else if (sortBy === 'stock_desc') {
      sorted.sort((a, b) => coerceNumber(b.total_count) - coerceNumber(a.total_count));
    } else if (sortBy === 'brand_asc') {
      sorted.sort((a, b) => String(a.brand || '').localeCompare(String(b.brand || '')));
    }
    return sorted;
  }, [rows, filter, search, sortBy]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, sortBy]);
  const totalPages = Math.ceil(filteredSortedRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSortedRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSortedRows, currentPage]);
  const askDelete = ids => {
    if (!ids.length) {
      setPopupMessage('Select at least one product');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 1800);
      return;
    }
    setConfirmIds(ids);
    setShowConfirm(true);
  };
  const confirmDelete = async ok => {
    setShowConfirm(false);
    if (!ok) return;
    try {
      await Promise.all(confirmIds.map(id => fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      })));
      setRows(prev => prev.filter(r => !confirmIds.includes(r.id)));
      setSelectedIds(new Set());
      setPopupMessage('Deleted successfully');
      setPopupType('success');
      setTimeout(() => setPopupMessage(''), 1800);
    } catch {
      setPopupMessage('Failed to delete some items');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2000);
    } finally {
      setConfirmIds([]);
    }
  };
  const toggleSelect = id => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  };
  const toggleSelectAllVisible = () => {
    const visibleIds = paginatedRows.map(r => r.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach(id => next.delete(id));
      } else {
        visibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  };
  return <div className={portalClass("delete-product-page")}>
      <div className={portalClass("delete-toolbar")}>
        <div className={portalClass("filters")}>
          {['All', 'Men', 'Women', 'Kids'].map(f => <button key={f} className={portalClass(`chip ${filter === f ? 'active' : ''}`)} onClick={() => setFilter(f)}>
              {f}
            </button>)}
        </div>

        <div className={portalClass("tools")}>
          <input className={portalClass("search-input")} placeholder="Search by brand, product, color, size" value={search} onChange={e => setSearch(e.target.value)} />

          <select className={portalClass("sort-select")} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent" className="tadm-deleteproduct-node-0">Sort: Recent</option>
            <option value="price_b2c_asc" className="tadm-deleteproduct-node-1">Price B2C: Low to High</option>
            <option value="price_b2c_desc" className="tadm-deleteproduct-node-2">Price B2C: High to Low</option>
            <option value="stock_desc" className="tadm-deleteproduct-node-3">Stock: High to Low</option>
            <option value="brand_asc" className="tadm-deleteproduct-node-4">Brand: A → Z</option>
          </select>

          <button className={portalClass("refresh-btn")} onClick={fetchAll} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>

          <button className={portalClass("danger-btn")} onClick={() => askDelete(Array.from(selectedIds))}>
            Delete Selected
          </button>
        </div>
      </div>

      <div className={portalClass("delete-section2")}>
        <h2 className="tadm-deleteproduct-node-5">Product Table ({filteredSortedRows.length})</h2>
        <div className={portalClass("table-scroll-wrapper")}>
          <table className="tadm-deleteproduct-node-6">
            <thead className="tadm-deleteproduct-node-7">
              <tr className="tadm-deleteproduct-node-8">
                <th className="tadm-deleteproduct-node-9">
                  <input type="checkbox" onChange={toggleSelectAllVisible} checked={paginatedRows.length > 0 && paginatedRows.every(r => selectedIds.has(r.id))} aria-label="Select all visible" className="tadm-deleteproduct-node-10" />
                </th>
                <th className="tadm-deleteproduct-node-11">Sl. No</th>
                <th className="tadm-deleteproduct-node-12">Category</th>
                <th className="tadm-deleteproduct-node-13">Brand</th>
                <th className="tadm-deleteproduct-node-14">Product Name</th>
                <th className="tadm-deleteproduct-node-15">Color</th>
                <th className="tadm-deleteproduct-node-16">Size</th>
                <th className="tadm-deleteproduct-node-17">Original Price (B2C)</th>
                <th className="tadm-deleteproduct-node-18">Discount % (B2C)</th>
                <th className="tadm-deleteproduct-node-19">Final Price (B2C)</th>
                <th className="tadm-deleteproduct-node-20">Stock</th>
                <th className="tadm-deleteproduct-node-21">Image</th>
                <th className="tadm-deleteproduct-node-22">Delete</th>
              </tr>
            </thead>
            <tbody className="tadm-deleteproduct-node-23">
              {paginatedRows.map((p, idx) => {
              const serialNum = (currentPage - 1) * itemsPerPage + idx + 1;
              return <tr key={p.id || idx} className="tadm-deleteproduct-node-24">
                    <td className="tadm-deleteproduct-node-25">
                      <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} aria-label={`Select ${p.product_name}`} className="tadm-deleteproduct-node-26" />
                    </td>
                    <td className="tadm-deleteproduct-node-27">{serialNum}</td>
                    <td className="tadm-deleteproduct-node-28">{p.category}</td>
                    <td className="tadm-deleteproduct-node-29">{p.brand}</td>
                    <td className="tadm-deleteproduct-node-30">{p.product_name}</td>
                    <td className="tadm-deleteproduct-node-31">{p.color}</td>
                    <td className="tadm-deleteproduct-node-32">{p.size}</td>
                    <td className="tadm-deleteproduct-node-33">{p.original_price_b2c}</td>
                    <td className="tadm-deleteproduct-node-34">{p.discount_b2c}</td>
                    <td className="tadm-deleteproduct-node-35">{computeFinal(p.original_price_b2c, p.discount_b2c).toFixed(2)}</td>
                    <td className="tadm-deleteproduct-node-36">{p.total_count}</td>
                    <td className="tadm-deleteproduct-node-37">
                      <img src={p.image_url} alt="product" className={portalClass("table-image")} />
                    </td>
                    <td className="tadm-deleteproduct-node-38">
                      <button className={portalClass("delete-btn")} onClick={() => askDelete([p.id])}>
                        Delete
                      </button>
                    </td>
                  </tr>;
            })}

              {!paginatedRows.length && <tr className="tadm-deleteproduct-node-39">
                  <td colSpan="13" style={{
                padding: 16,
                color: "#42536a"
              }} className="tadm-deleteproduct-node-40">
                    No products found
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

       {}
        {totalPages > 1 && <div className={portalClass("pagination-controls")}>
            <button className={portalClass("refresh-btn")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{
          minWidth: '100px'
        }}>
              Previous
            </button>
            <span className={portalClass("pagination-info")}>
              Page {currentPage} of {totalPages}
            </span>
            <button className={portalClass("refresh-btn")} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{
          minWidth: '100px'
        }}>
              Next
            </button>
          </div>}
      </div>

      {popupMessage && <div className={portalClass(`popup-card ${popupType}`)}>{popupMessage}</div>}

      {showConfirm && <div className={portalClass("popup-confirm-box centered-popup")}>
          <p className="tadm-deleteproduct-node-41">{confirmIds.length > 1 ? `Delete ${confirmIds.length} products?` : 'Delete this product?'}</p>
          <div className={portalClass("popup-actions")}>
            <button onClick={() => confirmDelete(true)} className="tadm-deleteproduct-node-42">Yes</button>
            <button onClick={() => confirmDelete(false)} className="tadm-deleteproduct-node-43">No</button>
          </div>
        </div>}
    </div>;
};
export default DeleteProduct;
