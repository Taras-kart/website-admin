import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from './AdminAuth';
import { apiDelete, apiGet } from './api';
import { ProductEditor } from './Operations';
import './ProductRecords.css';

const LIMIT = 30;
function ProductList({ mode }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ rows: [], total: 0 });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [target, setTarget] = useState(null);
  const [confirmBarcode, setConfirmBarcode] = useState('');
  const [revision, setRevision] = useState(0);
  const branch = user?.branch_id || '';
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiGet('/manage/stock', { branch_id: branch, q: search, limit: LIMIT, offset: page * LIMIT }, {signal:controller.signal})
      .then(response => { if (!controller.signal.aborted) setData(response); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [branch, search, page, revision]);
  const rows = data.rows || [];
  const isDelete = mode === 'delete';
  const closeDialog = () => { if (!busy) { setTarget(null); setConfirmBarcode(''); } };
  const deleteProduct = async () => {
    if (!target || confirmBarcode.trim() !== (target.ean_code || `DELETE ${target.variant_id}`)) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await apiDelete(`/manage/products/${target.variant_id}`, { branch_id: target.branch_id });
      setNotice(`${target.name} deleted. ${result.released_barcodes || 0} barcode(s) released for a future upload.`);
      setTarget(null); setConfirmBarcode(''); setRevision(r => r + 1);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <main className="tadm-records">
    <div className="tadm-records-heading"><div><h1>{isDelete ? 'Delete Products' : 'Update Products'}</h1><p>{isDelete ? 'Remove product listings and release their barcode for future uploads.' : 'Find a product, then open its dedicated editor.'}</p></div>
      <div className="tadm-records-actions"><Link to="/products" className="tadm-records-secondary">Add Product</Link><Link to="/categories/new" className="tadm-records-secondary">Add Category</Link><Link to={isDelete?'/products/update':'/products/delete'} className="tadm-records-primary">{isDelete?'Update Products':'Delete Products'}</Link></div>
    </div>
    <section className="tadm-records-card">
      <form onSubmit={event=>{event.preventDefault();setPage(0);setSearch(query.trim());}} className="tadm-records-search"><label htmlFor="product-lookup">Search by product, colour, size or barcode</label><div><input id="product-lookup" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter name or barcode" /><button type="submit">Search</button><button type="button" className="tadm-records-reset" onClick={()=>{setQuery('');setSearch('');setPage(0);setRevision(r=>r+1);}}>Reset</button></div></form>
      {notice&&<p className="tadm-records-notice" role="status">{notice}</p>}
      {error&&<p className="tadm-records-error" role="alert">{error}</p>}
      {!branch && <p className="tadm-records-notice">All branches are selected. Deleting a product removes its variant from every branch. Choose a branch above if you want to narrow the list.</p>}
      {loading ? <p className="tadm-records-empty">Loading products...</p> : rows.length ? <div className="tadm-records-table-wrap"><table><thead><tr><th>Product</th><th>Variant</th><th>Barcode</th><th>Branch</th><th>Stock</th><th>Action</th></tr></thead><tbody>{rows.map(row=><tr key={`${row.branch_id}-${row.variant_id}`}><td><strong>{row.name}</strong><small>{row.brand_name || 'Unbranded'} · {row.category_name || row.gender || 'Uncategorised'}</small></td><td>{row.colour} / {row.size}</td><td className="tadm-records-code">{row.ean_code || 'No barcode'}</td><td>{row.branch_name}</td><td>{row.on_hand}</td><td><div className="tadm-records-actions">{isDelete?<button type="button" className="tadm-records-danger" onClick={()=>{setTarget(row);setConfirmBarcode('');setError('');}}>Delete</button>:<Link className="tadm-records-primary" to={`/products/update?variantId=${row.variant_id}&branchId=${row.branch_id}`}>Update</Link>}</div></td></tr>)}</tbody></table></div> : <p className="tadm-records-empty">No active products found. Try a different search or branch.</p>}
      <div className="tadm-records-pagination"><span>{Number(data.total||0).toLocaleString('en-IN')} products</span><div className="tadm-records-actions"><button type="button" disabled={!page||loading} onClick={()=>setPage(n=>n-1)}>Previous</button><span>Page {page+1}</span><button type="button" disabled={loading||(page+1)*LIMIT>=Number(data.total||0)} onClick={()=>setPage(n=>n+1)}>Next</button></div></div>
    </section>
    {target && <div className="tadm-records-overlay" onMouseDown={closeDialog}><section className="tadm-records-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={e=>e.stopPropagation()}>
      <h2 id="delete-title">Delete {target.name}?</h2><p>Its listing will be disabled in every branch, associated stock will be retired, and its barcode mapping will be permanently released. Existing orders and stock movement history remain available.</p>
      <p className="tadm-records-warning">Deletion is blocked if there are outstanding stock reservations. Shared products require Super Admin permissions.</p>
      <label>Type <strong>{target.ean_code || `DELETE ${target.variant_id}`}</strong> to confirm<input value={confirmBarcode} onChange={e=>setConfirmBarcode(e.target.value)} autoComplete="off" autoFocus /></label>
      {error&&<p className="tadm-records-error" role="alert">{error}</p>}
      <div className="tadm-records-actions"><button type="button" onClick={closeDialog} disabled={busy}>Cancel</button><button type="button" className="tadm-records-danger" disabled={busy||confirmBarcode.trim()!==(target.ean_code||`DELETE ${target.variant_id}`)} onClick={deleteProduct}>{busy?'Deleting...':'Delete product & release barcode'}</button></div>
    </section></div>}
  </main>;
}
export function UpdateProductPage(){const [params]=useSearchParams();return params.get('variantId')?<ProductEditor mode="update" />:<ProductList mode="update" />;}
export function DeleteProductPage(){return <ProductList mode="delete" />;}
