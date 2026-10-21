import React, {useEffect, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {useAuth} from './pages/AdminAuth';
import {apiGet} from './pages/api';
import './PortalFrame.css';

const MAIN = [
  {name:'Sales', path:'/sales', icon:'sales'},
  {name:'Transactions', path:'/transactions', icon:'transactions'},
  {name:'Bulk Upload', path:'/import', icon:'upload'},
  {name:'POS', path:'/pos', icon:'pos'},
  {name:'Stocks', path:'/stocks', icon:'stocks'},
  {name:'Customers', path:'/customers', icon:'customers'}
];
const PRODUCTS = [
  {name:'Add Product', path:'/products'},
  {name:'Update Product', path:'/products/update'},
  {name:'Delete Product', path:'/products/delete'}
];
const MORE = [
  {name:'Stock Movements',path:'/movements'},
  {name:'Account Settings',path:'/settings'}
];
const SUPER = [
  {name:'Branches',path:'/branches'}, {name:'Branch Admins',path:'/branch-admins'},
  {name:'Homepage Images',path:'/homepage-images'}, {name:'Order Issues',path:'/order-issues'},
  {name:'B2B Orders',path:'/b2b-orders'}, {name:'B2B Stock',path:'/b2b-stock'},
  {name:'Shipping',path:'/shipping'}, {name:'Rewards',path:'/coin-settings'},
  {name:'Audit',path:'/audit'}
];
function NavIcon({name}) {
  const shapes = {
    products:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9h16M9 5v15"/></>,
    sales:<><path d="M3 19h18M6 16V9m6 7V5m6 11v-6"/></>,
    transactions:<><path d="M4 7h16m-4-3 4 3-4 3M20 17H4m4-3-4 3 4 3"/></>,
    upload:<><path d="M12 16V3m-5 5 5-5 5 5M4 16v4h16v-4"/></>,
    pos:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h2m4 0h4M7 16h2m4 0h4"/></>,
    stocks:<><path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v10"/></>,
    customers:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m2-15a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5"/></>,
    category:<><path d="M4 5h7v7H4zM14 5h6v6h-6zM4 15h7v5H4zM14 14h6v6h-6z"/></>,
    more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>
  };
  return <svg className="tadm-nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}
class PageBoundary extends React.Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<section className="tadm-failure" role="alert"><h1>Unable to display this page</h1><p>Your records have not been changed. Reload the page or choose another section.</p><button onClick={()=>window.location.reload()}>Reload</button><Link to="/stocks">Stocks</Link></section>:this.props.children;}
}
export default function PortalFrame({children}) {
  const {user,token,setBranch,logout}=useAuth();
  const location=useLocation();
  const [branches,setBranches]=useState([]),[branchError,setBranchError]=useState(''),[menuOpen,setMenuOpen]=useState(false);
  const superAdmin=user?.role==='SUPER_ADMIN';
  const visible=Boolean(token&&user&&location.pathname!=='/login');
  useEffect(()=>{
    if(!visible)return;
    const abort=new AbortController();
    apiGet('/manage/branches',{}, {signal:abort.signal})
      .then(value=>{if(!abort.signal.aborted){setBranches(Array.isArray(value)?value:[]);setBranchError('');}})
      .catch(err=>{if(!abort.signal.aborted&&superAdmin)setBranchError(err.message);});
    return()=>abort.abort();
  },[visible,superAdmin]);
  useEffect(()=>setMenuOpen(false),[location.pathname]);
  const active=path=>location.pathname===path || (path==='/products'&&location.pathname.startsWith('/products/'));
  const navLink=({name,path,icon})=><NavLink key={path} to={path} end={true} className={({isActive})=>`tadm-nav-link ${isActive?'tadm-nav-current':''}`}>
    {icon&&<NavIcon name={icon}/>}<span>{name}</span>
  </NavLink>;
  const dropdown=(label,icon,items,current,role)=> <details key={`${role}-${location.pathname}`} className={`tadm-nav-dropdown ${current?'tadm-nav-dropdown-current':''}`}>
    <summary className="tadm-nav-link" aria-label={`${label} menu`}><NavIcon name={icon}/><span>{label}</span><span className="tadm-nav-chevron" aria-hidden="true">⌄</span></summary>
    <div className="tadm-dropdown-panel" role="group" aria-label={`${label} actions`}>{items.map(navLink)}</div>
  </details>;
  return <div className={`tadm-app ${visible?'tadm-signed':'tadm-guest'}`}>
    {visible&&<header className="tadm-site-header">
      <div className="tadm-topbar">
        <Link className="tadm-title" to="/stocks" aria-label="Go to stocks"><span className="tadm-wordmark">T</span><span className="tadm-wordmark-text">Taras Kart <small>ADMINISTRATION</small></span></Link>
        <div className="tadm-context">
          <label className="tadm-branch"><span>Branch</span>{superAdmin?
            <select aria-label="Select branch" value={user.branch_id||''} onChange={e=>setBranch(e.target.value)}><option value="">All branches</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name}{b.is_active?'':' (inactive)'}</option>)}</select>:
            <strong>{branches.find(b=>Number(b.id)===Number(user.branch_id))?.name||`Branch ${user.branch_id||'not assigned'}`}</strong>}</label>
          <span className="tadm-username">{user.username}</span>
          <button type="button" className="tadm-signout" onClick={logout}>Sign out</button>
          <button type="button" className="tadm-menu" aria-expanded={menuOpen} aria-controls="tadm-navigation" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?'Close':'Menu'}</button>
        </div>
      </div>
      <nav id="tadm-navigation" aria-label="Admin navigation" className={`tadm-topnav ${menuOpen?'tadm-topnav-expanded':''}`}>
        <div className="tadm-nav-scroll">
          {dropdown('Products','products',PRODUCTS,location.pathname.startsWith('/products'),'products')}
          {navLink({...MAIN[0]})}
          {navLink({...MAIN[1]})}
          {!superAdmin&&navLink({name:'New Category',path:'/categories/new',icon:'category'})}
          {MAIN.slice(2).map(navLink)}
          {dropdown('More','more',[...MORE,...(superAdmin?SUPER:[])],MORE.some(item=>active(item.path))||SUPER.some(item=>active(item.path)),'more')}
        </div>
      </nav>
    </header>}
    <div className={visible?'tadm-content':'tadm-login-content'}>
      {visible&&branchError&&<p className="tadm-branch-error" role="alert">Branch list: {branchError}</p>}
      <PageBoundary key={location.pathname}>{children}</PageBoundary>
    </div>
  </div>;
}
