import React, { useEffect, useState } from 'react';
import { useAuth } from './AdminAuth';
import { apiGet } from './api';
import './TransactionsPage.css';
const money = n => Number(n||0).toLocaleString('en-IN',{style:'currency',currency:'INR'});
const defaults = {q:'',email:'',mobile:'',status:'',payment_type:'',customer_payment:'',source:'',start:'',end:''};
const PAGE_SIZE=40;
export default function TransactionsPage(){
 const {user}=useAuth();
 const [filters,setFilters]=useState(defaults);
 const [applied,setApplied]=useState(defaults);
 const [page,setPage]=useState(0);
 const [data,setData]=useState({rows:[],total:0,summary:{}});
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(false);
 const [refresh,setRefresh]=useState(0);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');
   apiGet('/manage/transactions',{...applied,branch_id:user?.branch_id,limit:PAGE_SIZE,offset:page*PAGE_SIZE},{signal:controller.signal})
     .then(result=>{if(!controller.signal.aborted)setData(result)})
     .catch(err=>{if(!controller.signal.aborted)setError(err.message)})
     .finally(()=>{if(!controller.signal.aborted)setLoading(false)});
   return()=>controller.abort();
 },[applied,user?.branch_id,page,refresh]);
 const set=(key,value)=>setFilters(v=>({...v,[key]:value}));
 const apply=e=>{e.preventDefault();setPage(0);setApplied({...filters})};
 const reset=()=>{setFilters({...defaults});setApplied({...defaults});setPage(0)};
 const stats=data.summary||{};
 const cards=[['Total Transactions',stats.total,'slate'],['COD',stats.cod,'gold'],['Prepaid',stats.prepaid,'violet'],['Customer Paid',stats.customer_paid,'mint'],['Customer Pending',stats.customer_pending,'amber'],['Cancelled',stats.cancelled,'rose'],['Total Amount',money(stats.total_amount),'slate'],['Customer Paid Amount',money(stats.customer_paid_amount),'mint']];
 return <main className="tadm-tx">
 <header className="tadm-tx-header"><div><p className="tadm-tx-eyebrow">PAYMENT OPERATIONS</p><h1>Transactions</h1><p>Customer payment and bank settlement are separate. Bank receipts are not reported without verified settlement data.</p></div><button type="button" onClick={()=>setRefresh(n=>n+1)} disabled={loading}>{loading?'Refreshing…':'Refresh'}</button></header>
 <div className="tadm-tx-stats">{cards.map(([label,value,tint])=><article className={'tadm-tx-stat '+tint} key={label}><span>{label}</span><strong>{typeof value === 'number' ? value.toLocaleString('en-IN') : (value || '0')}</strong></article>)}</div>
 <div className="tadm-tx-bank-note"><strong>Bank settlement: Not tracked</strong><span>Shiprocket / payment-gateway payouts must be reconciled before displaying bank received or pending amounts.</span></div>
 <form onSubmit={apply} className="tadm-tx-filters"><div className="tadm-tx-filters-title"><h2>Filters</h2><button type="button" onClick={reset}>Reset filters</button></div><div className="tadm-tx-filter-grid">
 <label>Search<input value={filters.q} onChange={e=>set('q',e.target.value)} placeholder="Order, name, email, mobile, reference" /></label>
 <label>Exact email<input type="email" value={filters.email} onChange={e=>set('email',e.target.value)} placeholder="customer@example.com" /></label>
 <label>Exact mobile<input type="tel" value={filters.mobile} onChange={e=>set('mobile',e.target.value)} placeholder="Mobile number" /></label>
 <label>Order status<select value={filters.status} onChange={e=>set('status',e.target.value)}>{['','PLACED','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED','FAILED'].map(v=><option key={v} value={v}>{v||'All statuses'}</option>)}</select></label>
 <label>Payment type<select value={filters.payment_type} onChange={e=>set('payment_type',e.target.value)}><option value="">All types</option><option value="COD">COD</option><option value="PREPAID">Prepaid</option></select></label>
 <label>Customer payment<select value={filters.customer_payment} onChange={e=>set('customer_payment',e.target.value)}><option value="">All payments</option><option value="PAID">Paid</option><option value="PENDING">Pending</option></select></label>
 <label>Channel<select value={filters.source} onChange={e=>set('source',e.target.value)}><option value="">All channels</option><option value="WEB">Website</option><option value="POS">In store</option><option value="B2B">Wholesale</option></select></label>
 <label>From<input type="date" value={filters.start} onChange={e=>set('start',e.target.value)} /></label><label>To<input type="date" min={filters.start||undefined} value={filters.end} onChange={e=>set('end',e.target.value)} /></label>
 </div><div className="tadm-tx-actions"><button type="submit" className="tadm-tx-search">Apply filters</button><button type="button" onClick={reset}>Clear</button></div></form>
 {error&&<p className="tadm-tx-error" role="alert">{error}</p>}
 <section className="tadm-tx-table-card"><h2>Transaction records <small>{Number(data.total||0).toLocaleString('en-IN')} results</small></h2><div className="tadm-tx-table-scroll"><table><thead><tr><th>Order / Date</th><th>Customer</th><th>Branch</th><th>Type</th><th>Customer payment</th><th>Bank settlement</th><th>Order status</th><th>Amount</th></tr></thead><tbody>{data.rows?.map(row=><tr key={row.id}><td><strong>{String(row.id).slice(0,12)}</strong><small>{new Date(row.created_at).toLocaleString('en-IN')}</small></td><td>{row.customer_name||'Counter customer'}<small>{row.customer_email}</small></td><td>{row.branch_name||'Unassigned'}</td><td><span className="tadm-tx-pill">{row.payment_type}</span></td><td><span className={'tadm-tx-pill '+(row.payment_status==='PAID'?'paid':'pending')}>{row.payment_status==='PAID'?'Paid':row.payment_status==='COD'?'COD due':row.payment_status}</span></td><td><span className="tadm-tx-muted">Not tracked</span></td><td>{row.status}</td><td><strong>{money(row.total)}</strong></td></tr>)}</tbody></table></div>{!loading&&!data.rows?.length&&<p className="tadm-tx-empty">No transactions match your filters.</p>}{loading&&<p className="tadm-tx-empty">Loading transactions…</p>}
 <div className="tadm-tx-pager"><button type="button" disabled={!page||loading} onClick={()=>setPage(v=>v-1)}>Previous</button><span>Page {page+1} of {Math.max(1,Math.ceil((data.total||0)/PAGE_SIZE))}</span><button type="button" disabled={loading||(page+1)*PAGE_SIZE>=Number(data.total||0)} onClick={()=>setPage(v=>v+1)}>Next</button></div></section>
 </main>;
}
