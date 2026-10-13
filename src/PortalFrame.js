import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './pages/AdminAuth';
import { apiGet } from './pages/api';
import './PortalFrame.css';

// Seven primary destinations, in the order requested. Category access is branch-only.
const primaryNavigation = [
  ['Sales', '/sales'], ['Transactions', '/transactions'], ['POS', '/pos'],
  ['Stocks', '/stocks'], ['Customers', '/customers'], ['Products', '/products']
];
const secondaryNavigation = [
  ['Import & Upload', '/import'], ['Stock Movements', '/movements'], ['Overview', '/'], ['Account', '/settings']
];
const superNavigation = [
  ['Branches', '/branches'], ['Admins', '/branch-admins'], ['Homepage Images', '/homepage-images'],
  ['Issues', '/order-issues'], ['B2B Orders', '/b2b-orders'], ['B2B Stock', '/b2b-stock'],
  ['Shipping', '/shipping'], ['Rewards', '/coin-settings'], ['Activity', '/audit']
];
const productTabs = [
  ['Add Product', '/products'], ['Update Product', '/products/update'],
  ['Delete Product', '/products/delete'], ['Bulk Upload', '/import']
];
class PageBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? (
      <section className="tadm-failure" role="alert">
        <h1>This page could not load</h1><p>Try reloading. Your saved records have not changed.</p>
        <button onClick={() => window.location.reload()}>Reload page</button>
        <Link to="/">Back to overview</Link>
      </section>
    ) : this.props.children;
  }
}

export default function PortalFrame({ children }) {
  const { user, token, setBranch, logout } = useAuth();
  const location = useLocation();
  const [branches, setBranches] = useState([]);
  const [branchError, setBranchError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const superAdmin = user?.role === 'SUPER_ADMIN';
  const visible = Boolean(token && user && location.pathname !== '/login');
  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    apiGet('/manage/branches', {}, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) { setBranches(Array.isArray(data) ? data : []); setBranchError(''); } })
      .catch(error => { if (!controller.signal.aborted) setBranchError(error.message); });
    return () => controller.abort();
  }, [visible]);
  useEffect(() => setMenuOpen(false), [location.pathname]);
  const links = [...(superAdmin ? [] : [['New Category', '/categories/new']]), ...primaryNavigation,
    ...secondaryNavigation, ...(superAdmin ? superNavigation : [])];
  const isProductArea = location.pathname.startsWith('/products') || location.pathname === '/import';
  const renderLinks = entries => entries.map(([label, url]) => (
    <NavLink key={url} to={url} end={url === '/'}
      className={({ isActive }) => `tadm-nav-link${isActive || (url === '/products' && isProductArea) ? ' tadm-nav-current' : ''}`} >
      {label}
    </NavLink>
  ));
  return <div className={`tadm-app ${visible ? 'tadm-signed' : 'tadm-guest'}`}>
    {visible && <header className="tadm-site-header">
      <div className="tadm-topbar">
        <Link className="tadm-title" to="/" aria-label="Go to admin overview">Store Admin <span>{superAdmin ? 'Super Admin' : 'Branch Admin'}</span></Link>
        <div className="tadm-context">
          <label className="tadm-branch"><span>Branch</span>
            {superAdmin ? <select aria-label="Select branch" value={user.branch_id || ''} onChange={event => setBranch(event.target.value)}>
              <option value="">All branches</option>
              {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}{branch.is_active ? '' : ' (inactive)'}</option>)}
            </select> : <strong>{branches.find(branch => Number(branch.id) === Number(user.branch_id))?.name || `Branch ${user.branch_id}`}</strong>}
          </label>
          <span className="tadm-username">{user.username}</span>
          <button type="button" className="tadm-signout" onClick={logout}>Sign out</button>
          <button type="button" className="tadm-menu" aria-expanded={menuOpen} aria-controls="tadm-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? 'Close' : 'More'}</button>
        </div>
      </div>
      <nav id="tadm-navigation" aria-label="Admin navigation" className={`tadm-topnav${menuOpen ? ' tadm-topnav-expanded' : ''}`}>
        <div className="tadm-nav-scroll">
          {!superAdmin && renderLinks([['New Category', '/categories/new']])}
          {renderLinks(primaryNavigation)}
          <div className={`tadm-more-links${menuOpen ? ' tadm-more-open' : ''}`}>
            {renderLinks([...secondaryNavigation, ...(superAdmin ? superNavigation : [])])}
          </div>
        </div>
      </nav>
      {isProductArea && <nav className="tadm-product-tabs" aria-label="Product actions">
        {productTabs.map(([label, path]) => <NavLink key={path} to={path} end={path === '/products'}
          className={({ isActive }) => `tadm-product-tab${isActive ? ' is-active' : ''}`}>{label}</NavLink>)}
      </nav>}
    </header>}
    <div className={visible ? 'tadm-content' : 'tadm-login-content'} data-page={links.find(([,url]) => url === location.pathname)?.[0] || location.pathname}>
      {visible && branchError && <p className="tadm-branch-error" role="alert">Branch list: {branchError}</p>}
      <PageBoundary key={location.pathname}>{children}</PageBoundary>
    </div>
  </div>;
}
