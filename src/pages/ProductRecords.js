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
  const [gender, setGender] = useState('');
  const [stock, setStock] = useState('');
  const [sort, setSort] = useState('recent');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
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
    let mounted = true;
    apiGet('/api/categories/admin').then(data => {
      if (mounted) setCategories((data?.rows || []).filter(c => c.parent_id !== null && c.is_active));
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiGet('/manage/stock', { branch_id: branch, q: search, gender, stock_state: stock, category_id: category, sort, limit: LIMIT, offset: page * LIMIT }, {signal:controller.signal})
      .then(response => { if (!controller.signal.aborted) setData(response); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [branch, search, gender, stock, category, sort, page, revision]);
  const rows = data.rows || [];
  const isDelete = mode === 'delete';
  const closeDialog = () => { if (!busy) { setTarget(null); setConfirmBarcode(''); } };
  const confirmationText = target ? (target.scope === 'entire' ? `DELETE PRODUCT ${target.product_id}` : target.ean_code || `DELETE VARIANT ${target.variant_id}`) : ''; 
  const deleteProduct = async () => {
    if (!target || confirmBarcode.trim() !== confirmationText) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const path = target.scope === 'entire' ? `/manage/products/by-product/${target.product_id}` : `/manage/products/${target.variant_id}`;
      const result = await apiDelete(path, { branch_id: target.branch_id });
      setNotice(`${target.name} permanently deleted: ${result.deleted_variants || 0} variant(s), ${result.released_barcodes || 0} barcode(s). The parent product was ${result.deleted_product ? 'also deleted' : 'retained for its remaining variants'}. Stock movements are archived in the audit log.`);
      setTarget(null); setConfirmBarcode(''); setRevision(r => r + 1);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <main className="tadm-records">
    <div className="tadm-records-heading"><div><h1>{isDelete ? 'Delete Products' : 'Update Products'}</h1><p>{isDelete ? 'Permanently delete variants or entire product styles from PostgreSQL. Sales-linked records cannot be deleted.' : 'Find a product, then open its dedicated editor.'}</p></div>
      <div className="tadm-records-actions"><Link to="/products" className="tadm-records-secondary">Add Product</Link>{user?.role !== 'SUPER_ADMIN' && <Link to="/categories/new" className="tadm-records-secondary">New Category</Link>}<Link to={isDelete?'/products/update':'/products/delete'} className="tadm-records-primary">{isDelete?'Update Products':'Delete Products'}</Link></div>
    </div>
    <section className="tadm-records-card">
      <form onSubmit={event=>{event.preventDefault();setPage(0);setSearch(query.trim());}} className="tadm-records-search"><label htmlFor="product-lookup">Search by product, colour, size or barcode</label><div><input id="product-lookup" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter name or barcode" /><button type="submit">Search</button><button type="button" className="tadm-records-reset" onClick={()=>{setQuery('');setSearch('');setGender('');setCategory('');setStock('');setSort('recent');setPage(0);setRevision(r=>r+1);}}>Reset</button></div></form>
      <div className="tadm-filter-grid" aria-label="Product filters">
        <label>Department<select value={gender} onChange={e=>{setGender(e.target.value);setCategory('');setPage(0)}}><option value="">All departments</option><option value="MEN">Men</option><option value="WOMEN">Women</option><option value="KIDS">Kids</option></select></label>
        <label>Category<select value={category} onChange={e=>{setCategory(e.target.value);setPage(0)}}><option value="">All categories</option>{categories.filter(c=>!gender||c.gender===gender).map(c=><option key={c.id} value={c.id}>{c.category_path}</option>)}</select></label>
        <label>Stock<select value={stock} onChange={e=>{setStock(e.target.value);setPage(0)}}><option value="">All stock levels</option><option value="low">Low (1–5)</option><option value="out">Out of stock</option><option value="in">In stock</option><option value="high">High (100+)</option></select></label>
        <label>Sort<select value={sort} onChange={e=>{setSort(e.target.value);setPage(0)}}><option value="recent">Recently added</option><option value="name">Product name</option><option value="stock_asc">Stock: low to high</option><option value="stock_desc">Stock: high to low</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label>
      </div>
      {notice&&<p className="tadm-records-notice" role="status">{notice}</p>}
      {error&&<p className="tadm-records-error" role="alert">{error}</p>}
      {!branch && <p className="tadm-records-notice">All branches are selected. Deleting a product removes its variant from every branch. Choose a branch above if you want to narrow the list.</p>}
      {loading ? <p className="tadm-records-empty">Loading products...</p> : rows.length ? <div className="tadm-records-table-wrap"><table><thead><tr><th>Product</th><th>Variant</th><th>Barcode</th><th>Branch</th><th>Stock</th><th>Action</th></tr></thead><tbody>{rows.map(row=><tr key={`${row.branch_id}-${row.variant_id}`}><td><strong>{row.name}</strong><small>{row.brand_name || 'Unbranded'} · {row.category_name || row.gender || 'Uncategorised'}</small></td><td>{row.colour} / {row.size}</td><td className="tadm-records-code">{row.ean_code || 'No barcode'}</td><td>{row.branch_name}</td><td>{row.on_hand}</td><td><div className="tadm-records-actions">{isDelete?<><button type="button" className="tadm-records-danger" onClick={()=>{setTarget({...row,scope:'variant'});setConfirmBarcode('');setError('');}}>Delete Variant</button><button type="button" className="tadm-records-danger" onClick={()=>{setTarget({...row,scope:'entire'});setConfirmBarcode('');setError('');}}>Delete Entire Product</button></>:<Link className="tadm-records-primary" to={`/products/update?variantId=${row.variant_id}&branchId=${row.branch_id}`}>Update</Link>}</div></td></tr>)}</tbody></table></div> : <p className="tadm-records-empty">No active products found. Try a different search or branch.</p>}
      <div className="tadm-records-pagination"><span>{Number(data.total||0).toLocaleString('en-IN')} products</span><div className="tadm-records-actions"><button type="button" disabled={!page||loading} onClick={()=>setPage(n=>n-1)}>Previous</button><span>Page {page+1}</span><button type="button" disabled={loading||(page+1)*LIMIT>=Number(data.total||0)} onClick={()=>setPage(n=>n+1)}>Next</button></div></div>
    </section>
    {target && <div className="tadm-records-overlay" onMouseDown={closeDialog}><section className="tadm-records-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={e=>e.stopPropagation()}>
      <h2 id="delete-title">Permanently delete {target.scope === 'entire' ? 'entire product' : 'variant'}?</h2><p>This permanently removes {target.scope === 'entire' ? 'the product row and all its variants' : 'this variant row and the parent if no variants remain'} from the database, along with linked stock, cart entries when applicable, and released barcode/image mappings. This cannot be undone from the admin page. Historical stock movements are archived in the audit log.</p>
      <p className="tadm-records-warning">Deletion is blocked if there are outstanding reservations, historical sales, or unknown foreign-key dependencies. Products stocked in multiple branches require Super Admin.</p>
      <label>Type <strong>{confirmationText}</strong> to confirm<input value={confirmBarcode} onChange={e=>setConfirmBarcode(e.target.value)} autoComplete="off" autoFocus /></label>
      {error&&<p className="tadm-records-error" role="alert">{error}</p>}
      <div className="tadm-records-actions"><button type="button" onClick={closeDialog} disabled={busy}>Cancel</button><button type="button" className="tadm-records-danger" disabled={busy||confirmBarcode.trim()!==confirmationText} onClick={deleteProduct}>{busy?'Deleting...':'Permanently Delete'}</button></div>
    </section></div>}
  </main>;
}
export function UpdateProductPage(){const [params]=useSearchParams();return params.get('variantId')?<ProductEditor mode="update" />:<ProductList mode="update" />;}
export function DeleteProductPage(){return <ProductList mode="delete" />;}
