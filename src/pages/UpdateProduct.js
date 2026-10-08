import React, { useState, useEffect, useMemo } from 'react';
import './UpdateProduct.css';
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
  "update-product-page": ["tadm-updateproduct-update-product-page"],
  "update-topbar": ["tadm-updateproduct-update-topbar"],
  "toolbar-card": ["tadm-updateproduct-toolbar-card"],
  "table-panel": ["tadm-updateproduct-table-panel"],
  "floating-savebar": ["tadm-updateproduct-floating-savebar"],
  "confirm-modal": ["tadm-updateproduct-confirm-modal"],
  "popup-toast": ["tadm-updateproduct-popup-toast"],
  "topbar-left": ["tadm-updateproduct-topbar-left"],
  "page-kicker": ["tadm-updateproduct-page-kicker"],
  "title-wrap": ["tadm-updateproduct-title-wrap"],
  "page-subtitle": ["tadm-updateproduct-page-subtitle"],
  "summary-strip": ["tadm-updateproduct-summary-strip"],
  "summary-chip": ["tadm-updateproduct-summary-chip"],
  "active": ["tadm-updateproduct-active"],
  "topbar-right": ["tadm-updateproduct-topbar-right"],
  "filters": ["tadm-updateproduct-filters"],
  "filter-pill": ["tadm-updateproduct-filter-pill"],
  "toolbar-right": ["tadm-updateproduct-toolbar-right"],
  "search-input": ["tadm-updateproduct-search-input"],
  "sort-select": ["tadm-updateproduct-sort-select"],
  "primary-btn": ["tadm-updateproduct-primary-btn"],
  "ghost-btn": ["tadm-updateproduct-ghost-btn"],
  "table-panel-head": ["tadm-updateproduct-table-panel-head"],
  "table-scroll-wrapper": ["tadm-updateproduct-table-scroll-wrapper"],
  "dirty-row": ["tadm-updateproduct-dirty-row"],
  "table-select": ["tadm-updateproduct-table-select"],
  "serial-cell": ["tadm-updateproduct-serial-cell"],
  "readonly-value": ["tadm-updateproduct-readonly-value"],
  "image-stack": ["tadm-updateproduct-image-stack"],
  "table-image": ["tadm-updateproduct-table-image"],
  "upload-btn": ["tadm-updateproduct-upload-btn"],
  "status-badge": ["tadm-updateproduct-status-badge"],
  "saved": ["tadm-updateproduct-saved"],
  "edited": ["tadm-updateproduct-edited"],
  "empty-state-cell": ["tadm-updateproduct-empty-state-cell"],
  "floating-savebar-left": ["tadm-updateproduct-floating-savebar-left"],
  "floating-label": ["tadm-updateproduct-floating-label"],
  "floating-value": ["tadm-updateproduct-floating-value"],
  "floating-savebar-right": ["tadm-updateproduct-floating-savebar-right"],
  "success": ["tadm-updateproduct-success"],
  "error": ["tadm-updateproduct-error"],
  "popup-overlay": ["tadm-updateproduct-popup-overlay"],
  "modal-actions": ["tadm-updateproduct-modal-actions"],
  "pagination-controls": ["tadm-updateproduct-pagination-controls"],
  "pagination-info": ["tadm-updateproduct-pagination-info"]
})[name] || ["tadm-updateproduct-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const DEFAULT_ASSETS_BASE = 'https://taras-kart-backend.vercel.app/uploads';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const ASSETS_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ASSETS_BASE) || DEFAULT_ASSETS_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const ASSETS_BASE = ASSETS_BASE_RAW.replace(/\/+$/, '');
const normalizeAssetUrl = maybeRelative => {
  if (!maybeRelative) return '';
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  const base = ASSETS_BASE || API_BASE;
  if (!base) return maybeRelative;
  const needsSlash = !maybeRelative.startsWith('/');
  return `${base}${needsSlash ? '/' : ''}${maybeRelative}`;
};
const coerceNumber = v => {
  if (v === '' || v === null || v === undefined) return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v).trim());
  return Number.isFinite(n) ? n : 0;
};
const toCategoryLabel = value => {
  const s = String(value || '').trim().toLowerCase();
  if (!s) return '';
  if (s === 'women' || s === "women's" || s === 'ladies' || s === 'female') return 'Women';
  if (s === 'men' || s === "men's" || s === 'mens' || s === 'male') return 'Men';
  if (s.startsWith('kid') || s === 'boys' || s === 'girls' || s === 'children') return 'Kids';
  return String(value || '').trim();
};
const rowFromApi = p => {
  const id = p.id || p.product_id || p._id || p.uuid;
  return {
    id,
    category: toCategoryLabel(p.category || p.gender || ''),
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
    total_count: coerceNumber(p.total_count ?? p.available_qty ?? p.on_hand),
    image_url: normalizeAssetUrl(p.image_url || p.image || p.imageUrl || p.path || ''),
    newImageFile: null,
    preview_url: '',
    dirty: false
  };
};
const computeFinal = (price, discount) => {
  const p = coerceNumber(price);
  const d = coerceNumber(discount);
  return Number((p - p * d / 100).toFixed(2));
};
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
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return await res.json();
};
const fetchAllProducts = async () => {
  const directUrls = [`${API_BASE}/api/products?all=true`, `${API_BASE}/api/products?limit=50000`, `${API_BASE}/api/products`];
  for (const url of directUrls) {
    try {
      const data = await fetchJson(url);
      const items = getItemsFromResponse(data);
      if (Array.isArray(items) && items.length > 200) {
        return items.map(rowFromApi);
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
      const mapped = rowFromApi(item);
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
const UpdateProduct = () => {
  const [rows, setRows] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [popupConfirm, setPopupConfirm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const mapped = await fetchAllProducts();
      setRows(mapped);
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
  useEffect(() => {
    return () => {
      rows.forEach(r => {
        if (r.preview_url) URL.revokeObjectURL(r.preview_url);
      });
    };
  }, [rows]);
  const rowIndexById = useMemo(() => {
    const map = new Map();
    rows.forEach((r, i) => map.set(r.id, i));
    return map;
  }, [rows]);
  const updateField = (index, field, value) => {
    if (index < 0) return;
    setRows(prev => {
      const next = [...prev];
      const current = {
        ...next[index]
      };
      if (field === 'category') {
        current[field] = toCategoryLabel(value);
      } else if (field === 'original_price_b2b' || field === 'discount_b2b' || field === 'original_price_b2c' || field === 'discount_b2c' || field === 'total_count') {
        current[field] = value === '' ? '' : coerceNumber(value);
      } else {
        current[field] = value;
      }
      if (field === 'original_price_b2b' || field === 'discount_b2b') {
        current.final_price_b2b = computeFinal(current.original_price_b2b, current.discount_b2b);
      }
      if (field === 'original_price_b2c' || field === 'discount_b2c') {
        current.final_price_b2c = computeFinal(current.original_price_b2c, current.discount_b2c);
      }
      current.dirty = true;
      next[index] = current;
      return next;
    });
  };
  const handleImageChange = (index, file) => {
    if (!file || index < 0) return;
    setRows(prev => {
      const next = [...prev];
      const current = {
        ...next[index]
      };
      if (current.preview_url) URL.revokeObjectURL(current.preview_url);
      current.newImageFile = file;
      current.preview_url = URL.createObjectURL(file);
      current.dirty = true;
      next[index] = current;
      return next;
    });
  };
  const filteredSortedRows = useMemo(() => {
    let list = rows;
    if (filter === 'Men') list = list.filter(r => String(r.category).toLowerCase() === 'men');else if (filter === 'Women') list = list.filter(r => String(r.category).toLowerCase() === 'women');else if (filter === 'Kids') list = list.filter(r => String(r.category).toLowerCase().startsWith('kids'));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => String(r.brand || '').toLowerCase().includes(q) || String(r.product_name || '').toLowerCase().includes(q) || String(r.color || '').toLowerCase().includes(q) || String(r.size || '').toLowerCase().includes(q) || String(r.category || '').toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => coerceNumber(b.id) - coerceNumber(a.id));else if (sortBy === 'price_b2c_asc') sorted.sort((a, b) => computeFinal(a.original_price_b2c, a.discount_b2c) - computeFinal(b.original_price_b2c, b.discount_b2c));else if (sortBy === 'price_b2c_desc') sorted.sort((a, b) => computeFinal(b.original_price_b2c, b.discount_b2c) - computeFinal(a.original_price_b2c, a.discount_b2c));else if (sortBy === 'stock_desc') sorted.sort((a, b) => coerceNumber(b.total_count) - coerceNumber(a.total_count));else if (sortBy === 'brand_asc') sorted.sort((a, b) => String(a.brand || '').localeCompare(String(b.brand || '')));
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
  const dirtyRows = useMemo(() => rows.filter(r => r.dirty), [rows]);
  const validationErrors = useMemo(() => {
    const errors = [];
    dirtyRows.forEach(p => {
      const missing = [];
      if (!p.id) missing.push('id');
      if (!String(p.category || '').trim()) missing.push('category');
      if (!String(p.brand || '').trim()) missing.push('brand');
      if (!String(p.product_name || '').trim()) missing.push('product name');
      if (!String(p.color || '').trim()) missing.push('color');
      if (!String(p.size || '').trim()) missing.push('size');
      if (p.original_price_b2b === '' || p.original_price_b2b === null || p.original_price_b2b === undefined) missing.push('original price b2b');
      if (p.discount_b2b === '' || p.discount_b2b === null || p.discount_b2b === undefined) missing.push('discount b2b');
      if (p.original_price_b2c === '' || p.original_price_b2c === null || p.original_price_b2c === undefined) missing.push('original price b2c');
      if (p.discount_b2c === '' || p.discount_b2c === null || p.discount_b2c === undefined) missing.push('discount b2c');
      if (p.total_count === '' || p.total_count === null || p.total_count === undefined) missing.push('stock');
      if (!(p.image_url || p.preview_url || p.newImageFile)) missing.push('image');
      if (missing.length) {
        errors.push({
          id: p.id,
          name: p.product_name || `Row ${p.id}`,
          fields: missing
        });
      }
    });
    return errors;
  }, [dirtyRows]);
  const validateDirty = () => dirtyRows.length > 0 && validationErrors.length === 0;
  const handleUpdateClick = () => {
    if (!dirtyRows.length) {
      setPopupMessage('No changes to update');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2200);
      return;
    }
    if (!validateDirty()) {
      const first = validationErrors[0];
      const details = first ? `Missing in ${first.name}: ${first.fields.join(', ')}` : 'Please complete all required fields in edited rows';
      setPopupMessage(details);
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 3200);
      return;
    }
    setPopupConfirm(true);
  };
  const uploadImageIfNeeded = async r => {
    if (!r.newImageFile) return r.image_url;
    const formData = new FormData();
    formData.append('image', r.newImageFile);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Upload failed ${res.status}`);
    const data = await res.json();
    return normalizeAssetUrl(data.imageUrl || data.url || data.path);
  };
  const confirmUpdate = async confirmed => {
    setPopupConfirm(false);
    if (!confirmed) return;
    setIsSaving(true);
    try {
      const updatesPayload = await Promise.all(dirtyRows.map(async r => {
        const uploaded_url = await uploadImageIfNeeded(r);
        return {
          ...r,
          image_url: uploaded_url
        };
      }));
      const res = await fetch(`${API_BASE}/api/products/bulk-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          updates: updatesPayload
        })
      });
      if (!res.ok) throw new Error(`Update failed ${res.status}`);
      setRows(prev => prev.map(r => {
        const updated = updatesPayload.find(u => u.id === r.id);
        if (updated) {
          return {
            ...r,
            ...updated,
            dirty: false,
            newImageFile: null,
            preview_url: ''
          };
        }
        return r;
      }));
      setPopupMessage('Changes saved successfully');
      setPopupType('success');
      setTimeout(() => setPopupMessage(''), 2200);
    } catch {
      setPopupMessage('Error saving changes');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2600);
    } finally {
      setIsSaving(false);
    }
  };
  const totalCount = rows.length;
  const visibleCount = filteredSortedRows.length;
  const editedCount = dirtyRows.length;
  return <div className={portalClass("update-product-page")}>
      <div className={portalClass("update-topbar")}>
        <div className={portalClass("topbar-left")}>
          <div className={portalClass("title-wrap")}>
            <p className={portalClass("page-kicker")}>Catalog Management</p>
            <h1 className="tadm-updateproduct-node-0">Update Products</h1>
            <p className={portalClass("page-subtitle")}>Refine product details, pricing, stock and images from one clean workspace.</p>
          </div>

          <div className={portalClass("summary-strip")}>
            <div className={portalClass("summary-chip")}>
              <span className="tadm-updateproduct-node-1">Total</span>
              <strong className="tadm-updateproduct-node-2">{totalCount}</strong>
            </div>
            <div className={portalClass("summary-chip")}>
              <span className="tadm-updateproduct-node-3">Visible</span>
              <strong className="tadm-updateproduct-node-4">{visibleCount}</strong>
            </div>
            <div className={portalClass("summary-chip active")}>
              <span className="tadm-updateproduct-node-5">Edited</span>
              <strong className="tadm-updateproduct-node-6">{editedCount}</strong>
            </div>
          </div>
        </div>

        <div className={portalClass("topbar-right")}>
          <button className={portalClass("ghost-btn")} onClick={fetchAll} disabled={isLoading || isSaving}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className={portalClass("toolbar-card")}>
        <div className={portalClass("filters")}>
          {['All', 'Men', 'Women', 'Kids'].map(f => <button key={f} className={portalClass(`filter-pill ${filter === f ? 'active' : ''}`)} onClick={() => setFilter(f)}>
              {f}
            </button>)}
        </div>

        <div className={portalClass("toolbar-right")}>
          <input className={portalClass("search-input")} placeholder="Search by brand, product, color, size or category" value={search} onChange={e => setSearch(e.target.value)} />
          <select className={portalClass("sort-select")} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent" className="tadm-updateproduct-node-7">Sort: Recent</option>
            <option value="price_b2c_asc" className="tadm-updateproduct-node-8">Price B2C: Low to High</option>
            <option value="price_b2c_desc" className="tadm-updateproduct-node-9">Price B2C: High to Low</option>
            <option value="stock_desc" className="tadm-updateproduct-node-10">Stock: High to Low</option>
            <option value="brand_asc" className="tadm-updateproduct-node-11">Brand: A to Z</option>
          </select>
        </div>
      </div>

      <div className={portalClass("table-panel")}>
        <div className={portalClass("table-panel-head")}>
          <div className="tadm-updateproduct-node-12">
            <h2 className="tadm-updateproduct-node-13">Product Table</h2>
            <p className="tadm-updateproduct-node-14">{editedCount ? `${editedCount} row${editedCount > 1 ? 's' : ''} have unsaved changes` : 'Everything is up to date'}</p>
          </div>
        </div>

        <div className={portalClass("table-scroll-wrapper")}>
          <table className="tadm-updateproduct-node-15">
            <thead className="tadm-updateproduct-node-16">
              <tr className="tadm-updateproduct-node-17">
                <th className="tadm-updateproduct-node-18">Sl. No</th>
                <th className="tadm-updateproduct-node-19">Category</th>
                <th className="tadm-updateproduct-node-20">Brand</th>
                <th className="tadm-updateproduct-node-21">Product Name</th>
                <th className="tadm-updateproduct-node-22">Color</th>
                <th className="tadm-updateproduct-node-23">Size</th>
                <th className="tadm-updateproduct-node-24">Original Price (B2B)</th>
                <th className="tadm-updateproduct-node-25">Discount % (B2B)</th>
                <th className="tadm-updateproduct-node-26">Final Price (B2B)</th>
                <th className="tadm-updateproduct-node-27">Original Price (B2C)</th>
                <th className="tadm-updateproduct-node-28">Discount % (B2C)</th>
                <th className="tadm-updateproduct-node-29">Final Price (B2C)</th>
                <th className="tadm-updateproduct-node-30">Stock</th>
                <th className="tadm-updateproduct-node-31">Image</th>
                <th className="tadm-updateproduct-node-32">Status</th>
              </tr>
            </thead>
            <tbody className="tadm-updateproduct-node-33">
              {paginatedRows.map((product, idx) => {
              const rowIndex = rowIndexById.get(product.id);
              const serialNum = (currentPage - 1) * itemsPerPage + idx + 1;
              return <tr key={product.id || idx} className={portalClass(product.dirty ? 'dirty-row' : '')}>
                    <td className={portalClass("serial-cell")}>{serialNum}</td>

                    <td className="tadm-updateproduct-node-34">
                      <select className={portalClass("table-select")} value={product.category} onChange={e => updateField(rowIndex, 'category', e.target.value)}>
                        <option value="" className="tadm-updateproduct-node-35">Select</option>
                        <option value="Men" className="tadm-updateproduct-node-36">Men</option>
                        <option value="Women" className="tadm-updateproduct-node-37">Women</option>
                        <option value="Kids" className="tadm-updateproduct-node-38">Kids</option>
                      </select>
                    </td>

                    <td className="tadm-updateproduct-node-39">
                      <input type="text" value={product.brand} onChange={e => updateField(rowIndex, 'brand', e.target.value)} className="tadm-updateproduct-node-40" />
                    </td>

                    <td className="tadm-updateproduct-node-41">
                      <input type="text" value={product.product_name} onChange={e => updateField(rowIndex, 'product_name', e.target.value)} className="tadm-updateproduct-node-42" />
                    </td>

                    <td className="tadm-updateproduct-node-43">
                      <input type="text" value={product.color} onChange={e => updateField(rowIndex, 'color', e.target.value)} className="tadm-updateproduct-node-44" />
                    </td>

                    <td className="tadm-updateproduct-node-45">
                      <input type="text" value={product.size} onChange={e => updateField(rowIndex, 'size', e.target.value)} className="tadm-updateproduct-node-46" />
                    </td>

                    <td className="tadm-updateproduct-node-47">
                      <input type="number" value={product.original_price_b2b} onChange={e => updateField(rowIndex, 'original_price_b2b', e.target.value)} className="tadm-updateproduct-node-48" />
                    </td>

                    <td className="tadm-updateproduct-node-49">
                      <input type="number" value={product.discount_b2b} onChange={e => updateField(rowIndex, 'discount_b2b', e.target.value)} className="tadm-updateproduct-node-50" />
                    </td>

                    <td className="tadm-updateproduct-node-51">
                      <div className={portalClass("readonly-value")}>{computeFinal(product.original_price_b2b, product.discount_b2b).toFixed(2)}</div>
                    </td>

                    <td className="tadm-updateproduct-node-52">
                      <input type="number" value={product.original_price_b2c} onChange={e => updateField(rowIndex, 'original_price_b2c', e.target.value)} className="tadm-updateproduct-node-53" />
                    </td>

                    <td className="tadm-updateproduct-node-54">
                      <input type="number" value={product.discount_b2c} onChange={e => updateField(rowIndex, 'discount_b2c', e.target.value)} className="tadm-updateproduct-node-55" />
                    </td>

                    <td className="tadm-updateproduct-node-56">
                      <div className={portalClass("readonly-value")}>{computeFinal(product.original_price_b2c, product.discount_b2c).toFixed(2)}</div>
                    </td>

                    <td className="tadm-updateproduct-node-57">
                      <input type="number" min="0" value={product.total_count} onChange={e => updateField(rowIndex, 'total_count', e.target.value)} className="tadm-updateproduct-node-58" />
                    </td>

                    <td className="tadm-updateproduct-node-59">
                      <div className={portalClass("image-stack")}>
                        <img src={product.preview_url || product.image_url || 'https://via.placeholder.com/76x76?text=No+Image'} alt="product" className={portalClass("table-image")} />
                        <label className={portalClass("upload-btn")}>
                          Replace
                          <input type="file" accept="image/*" onChange={e => handleImageChange(rowIndex, e.target.files && e.target.files[0])} className="tadm-updateproduct-node-60" />
                        </label>
                      </div>
                    </td>

                    <td className="tadm-updateproduct-node-61">
                      <span className={portalClass(`status-badge ${product.dirty ? 'edited' : 'saved'}`)}>
                        {product.dirty ? 'Edited' : 'Saved'}
                      </span>
                    </td>
                  </tr>;
            })}

              {!paginatedRows.length && <tr className="tadm-updateproduct-node-62">
                  <td colSpan="15" className={portalClass("empty-state-cell")}>No products found</td>
                </tr>}
            </tbody>
          </table>
        </div>
        
        {}
        {totalPages > 1 && <div className={portalClass("pagination-controls")}>
            <button className={portalClass("ghost-btn")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span className={portalClass("pagination-info")}>Page {currentPage} of {totalPages}</span>
            <button className={portalClass("ghost-btn")} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>}
      </div>

      <div className={portalClass("floating-savebar")}>
        <div className={portalClass("floating-savebar-left")}>
          <span className={portalClass("floating-label")}>Unsaved changes</span>
          <strong className={portalClass("floating-value")}>{editedCount} row{editedCount !== 1 ? 's' : ''} edited</strong>
        </div>

        <div className={portalClass("floating-savebar-right")}>
          <button className={portalClass("ghost-btn")} onClick={fetchAll} disabled={isLoading || isSaving}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className={portalClass("primary-btn")} onClick={handleUpdateClick} disabled={!dirtyRows.length || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {popupMessage && <div className={portalClass(`popup-toast ${popupType}`)}>
          {popupMessage}
        </div>}

      {popupConfirm && <div className={portalClass("popup-overlay")}>
          <div className={portalClass("confirm-modal")}>
            <h3 className="tadm-updateproduct-node-63">Save changes</h3>
            <p className="tadm-updateproduct-node-64">Do you want to save all edited rows now?</p>
            <div className={portalClass("modal-actions")}>
              <button className={portalClass("primary-btn")} onClick={() => confirmUpdate(true)}>Yes, Save</button>
              <button className={portalClass("ghost-btn")} onClick={() => confirmUpdate(false)}>Cancel</button>
            </div>
          </div>
        </div>}
    </div>;
};
export default UpdateProduct;
