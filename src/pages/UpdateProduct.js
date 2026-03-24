import React, { useState, useEffect, useMemo } from 'react';
import './UpdateProduct.css';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const DEFAULT_ASSETS_BASE = 'https://taras-kart-backend.vercel.app/uploads';

const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;

const ASSETS_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ASSETS_BASE) ||
  DEFAULT_ASSETS_BASE;

const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const ASSETS_BASE = ASSETS_BASE_RAW.replace(/\/+$/, '');

const normalizeAssetUrl = (maybeRelative) => {
  if (!maybeRelative) return '';
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  const base = ASSETS_BASE || API_BASE;
  if (!base) return maybeRelative;
  const needsSlash = !maybeRelative.startsWith('/');
  return `${base}${needsSlash ? '/' : ''}${maybeRelative}`;
};

const coerceNumber = (v) => {
  if (v === '' || v === null || v === undefined) return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v).trim());
  return Number.isFinite(n) ? n : 0;
};

const toCategoryLabel = (value) => {
  const s = String(value || '').trim().toLowerCase();
  if (!s) return '';
  if (s === 'women' || s === "women's" || s === 'ladies' || s === 'female') return 'Women';
  if (s === 'men' || s === "men's" || s === 'mens' || s === 'male') return 'Men';
  if (s.startsWith('kid') || s === 'boys' || s === 'girls' || s === 'children') return 'Kids';
  return String(value || '').trim();
};

const rowFromApi = (p) => {
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
  return Number((p - (p * d) / 100).toFixed(2));
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

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
      const data = await res.json();
      const mapped = Array.isArray(data) ? data.map(rowFromApi) : [];
      setRows(mapped);
    } catch (err) {
      console.error('Fetch products error:', err);
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
      rows.forEach((r) => {
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
    setRows((prev) => {
      const next = [...prev];
      const current = { ...next[index] };

      if (field === 'category') {
        current[field] = toCategoryLabel(value);
      } else if (
        field === 'original_price_b2b' ||
        field === 'discount_b2b' ||
        field === 'original_price_b2c' ||
        field === 'discount_b2c' ||
        field === 'total_count'
      ) {
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
    setRows((prev) => {
      const next = [...prev];
      const current = { ...next[index] };
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

    if (filter === 'Men') list = list.filter((r) => String(r.category).toLowerCase() === 'men');
    else if (filter === 'Women') list = list.filter((r) => String(r.category).toLowerCase() === 'women');
    else if (filter === 'Kids') list = list.filter((r) => String(r.category).toLowerCase().startsWith('kids'));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) =>
        String(r.brand || '').toLowerCase().includes(q) ||
        String(r.product_name || '').toLowerCase().includes(q) ||
        String(r.color || '').toLowerCase().includes(q) ||
        String(r.size || '').toLowerCase().includes(q) ||
        String(r.category || '').toLowerCase().includes(q)
      );
    }

    const sorted = [...list];

    if (sortBy === 'recent') sorted.sort((a, b) => coerceNumber(b.id) - coerceNumber(a.id));
    else if (sortBy === 'price_b2c_asc') sorted.sort((a, b) => computeFinal(a.original_price_b2c, a.discount_b2c) - computeFinal(b.original_price_b2c, b.discount_b2c));
    else if (sortBy === 'price_b2c_desc') sorted.sort((a, b) => computeFinal(b.original_price_b2c, b.discount_b2c) - computeFinal(a.original_price_b2c, a.discount_b2c));
    else if (sortBy === 'stock_desc') sorted.sort((a, b) => coerceNumber(b.total_count) - coerceNumber(a.total_count));
    else if (sortBy === 'brand_asc') sorted.sort((a, b) => String(a.brand || '').localeCompare(String(b.brand || '')));

    return sorted;
  }, [rows, filter, search, sortBy]);

  const dirtyRows = useMemo(() => rows.filter((r) => r.dirty), [rows]);

  const validationErrors = useMemo(() => {
    const errors = [];

    dirtyRows.forEach((p) => {
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

  const uploadImageIfNeeded = async (r) => {
    if (!r.newImageFile) return r.image_url;
    const formData = new FormData();
    formData.append('image', r.newImageFile);
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
    if (!res.ok) {
      const text = await res.text();
      console.error('Upload failed:', res.status, text);
      throw new Error(`Upload failed ${res.status}`);
    }
    const data = await res.json();
    return normalizeAssetUrl(data.imageUrl || data.url || data.path);
  };

  const persistRow = async (r) => {
    const image_url = await uploadImageIfNeeded(r);
    const payload = {
      category: r.category,
      brand: r.brand,
      product_name: r.product_name,
      color: r.color,
      size: r.size,
      original_price_b2b: coerceNumber(r.original_price_b2b),
      discount_b2b: coerceNumber(r.discount_b2b),
      final_price_b2b: computeFinal(r.original_price_b2b, r.discount_b2b),
      original_price_b2c: coerceNumber(r.original_price_b2c),
      discount_b2c: coerceNumber(r.discount_b2c),
      final_price_b2c: computeFinal(r.original_price_b2c, r.discount_b2c),
      total_count: Math.max(0, Math.floor(coerceNumber(r.total_count))),
      image_url
    };

    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(r.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Update API failed:', res.status, text);
      throw new Error(`Update failed ${res.status}`);
    }

    const updated = await res.json().catch(() => payload);

    return {
      ...r,
      ...updated,
      category: toCategoryLabel(updated.category || updated.gender || r.category),
      total_count: coerceNumber(updated.total_count ?? updated.available_qty ?? payload.total_count),
      image_url,
      newImageFile: null,
      preview_url: '',
      dirty: false
    };
  };

  const confirmUpdate = async (confirmed) => {
    setPopupConfirm(false);
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const updatedMap = new Map();

      for (const r of rows) {
        if (!r.dirty) continue;
        const u = await persistRow(r);
        updatedMap.set(r.id, u);
      }

      const next = rows.map((r) => updatedMap.get(r.id) || r);
      setRows(next);
      setPopupMessage('Changes saved successfully');
      setPopupType('success');
      setTimeout(() => setPopupMessage(''), 2200);
    } catch (err) {
      console.error('Save error:', err);
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

  return (
    <div className="update-product-page">
      <div className="update-topbar">
        <div className="topbar-left">
          <div className="title-wrap">
            <p className="page-kicker">Catalog Management</p>
            <h1>Update Products</h1>
            <p className="page-subtitle">Refine product details, pricing, stock and images from one clean workspace.</p>
          </div>

          <div className="summary-strip">
            <div className="summary-chip">
              <span>Total</span>
              <strong>{totalCount}</strong>
            </div>
            <div className="summary-chip">
              <span>Visible</span>
              <strong>{visibleCount}</strong>
            </div>
            <div className="summary-chip active">
              <span>Edited</span>
              <strong>{editedCount}</strong>
            </div>
          </div>
        </div>

        <div className="topbar-right">
          <button className="ghost-btn" onClick={fetchAll} disabled={isLoading || isSaving}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="toolbar-card">
        <div className="filters">
          {['All', 'Men', 'Women', 'Kids'].map((f) => (
            <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="toolbar-right">
          <input
            className="search-input"
            placeholder="Search by brand, product, color, size or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Sort: Recent</option>
            <option value="price_b2c_asc">Price B2C: Low to High</option>
            <option value="price_b2c_desc">Price B2C: High to Low</option>
            <option value="stock_desc">Stock: High to Low</option>
            <option value="brand_asc">Brand: A to Z</option>
          </select>
        </div>
      </div>

      <div className="table-panel">
        <div className="table-panel-head">
          <div>
            <h2>Product Table</h2>
            <p>{editedCount ? `${editedCount} row${editedCount > 1 ? 's' : ''} have unsaved changes` : 'Everything is up to date'}</p>
          </div>
        </div>

        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Product Name</th>
                <th>Color</th>
                <th>Size</th>
                <th>Original Price (B2B)</th>
                <th>Discount % (B2B)</th>
                <th>Final Price (B2B)</th>
                <th>Original Price (B2C)</th>
                <th>Discount % (B2C)</th>
                <th>Final Price (B2C)</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSortedRows.map((product, idx) => {
                const rowIndex = rowIndexById.get(product.id);
                return (
                  <tr key={product.id || idx} className={product.dirty ? 'dirty-row' : ''}>
                    <td className="serial-cell">{idx + 1}</td>

                    <td>
                      <select
                        className="table-select"
                        value={product.category}
                        onChange={(e) => updateField(rowIndex, 'category', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="text"
                        value={product.brand}
                        onChange={(e) => updateField(rowIndex, 'brand', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={product.product_name}
                        onChange={(e) => updateField(rowIndex, 'product_name', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={product.color}
                        onChange={(e) => updateField(rowIndex, 'color', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={product.size}
                        onChange={(e) => updateField(rowIndex, 'size', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={product.original_price_b2b}
                        onChange={(e) => updateField(rowIndex, 'original_price_b2b', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={product.discount_b2b}
                        onChange={(e) => updateField(rowIndex, 'discount_b2b', e.target.value)}
                      />
                    </td>

                    <td>
                      <div className="readonly-value">{computeFinal(product.original_price_b2b, product.discount_b2b).toFixed(2)}</div>
                    </td>

                    <td>
                      <input
                        type="number"
                        value={product.original_price_b2c}
                        onChange={(e) => updateField(rowIndex, 'original_price_b2c', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={product.discount_b2c}
                        onChange={(e) => updateField(rowIndex, 'discount_b2c', e.target.value)}
                      />
                    </td>

                    <td>
                      <div className="readonly-value">{computeFinal(product.original_price_b2c, product.discount_b2c).toFixed(2)}</div>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        value={product.total_count}
                        onChange={(e) => updateField(rowIndex, 'total_count', e.target.value)}
                      />
                    </td>

                    <td>
                      <div className="image-stack">
                        <img
                          src={product.preview_url || product.image_url || 'https://via.placeholder.com/76x76?text=No+Image'}
                          alt="product"
                          className="table-image"
                        />
                        <label className="upload-btn">
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(rowIndex, e.target.files && e.target.files[0])}
                          />
                        </label>
                      </div>
                    </td>

                    <td>
                      <span className={`status-badge ${product.dirty ? 'edited' : 'saved'}`}>
                        {product.dirty ? 'Edited' : 'Saved'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {!filteredSortedRows.length && (
                <tr>
                  <td colSpan="15" className="empty-state-cell">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="floating-savebar">
        <div className="floating-savebar-left">
          <span className="floating-label">Unsaved changes</span>
          <strong className="floating-value">{editedCount} row{editedCount !== 1 ? 's' : ''} edited</strong>
        </div>

        <div className="floating-savebar-right">
          <button className="ghost-btn" onClick={fetchAll} disabled={isLoading || isSaving}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="primary-btn" onClick={handleUpdateClick} disabled={!dirtyRows.length || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {popupMessage && (
        <div className={`popup-toast ${popupType}`}>
          {popupMessage}
        </div>
      )}

      {popupConfirm && (
        <div className="popup-overlay">
          <div className="confirm-modal">
            <h3>Save changes</h3>
            <p>Do you want to save all edited rows now?</p>
            <div className="modal-actions">
              <button className="primary-btn" onClick={() => confirmUpdate(true)}>Yes, Save</button>
              <button className="ghost-btn" onClick={() => confirmUpdate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;