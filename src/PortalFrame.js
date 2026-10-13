import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './pages/AdminAuth';
import { apiGet } from './pages/api';
import './PortalFrame.css';

const workspace = [
  ['Overview', '/'], ['Stock', '/stocks'], ['Add Product', '/products'],
  ['Update Product', '/products/update'], ['Delete Product', '/products/delete'],
  ['Excel & Images', '/import'], ['Sales', '/sales'], ['Counter Sale', '/pos'],
  ['Movements', '/transactions']
];
const management = [
  ['Branches', '/branches'], ['Admins', '/branch-admins'],
  ['Categories', '/categories'], ['Add Category', '/categories/new'],
  ['Customers', '/customers'], ['Homepage', '/homepage-images'],
  ['Order Issues', '/order-issues'], ['B2B Orders', '/b2b-orders'],
  ['B2B Stock', '/b2b-stock'], ['Shipping', '/shipping'],
  ['Rewards', '/coin-settings'], ['Activity', '/audit']
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
  const links = superAdmin ? [...workspace, ...management, ['Account', '/settings']] : [...workspace, ['Account', '/settings']];
  const renderLinks = entries => entries.map(([label, url]) => (
    <NavLink key={url} to={url} end={url === '/'}
      className={({ isActive }) => `tadm-nav-link${isActive ? ' tadm-nav-current' : ''}`}>
      {label}
    </NavLink>
  ));
  return <div className={`tadm-app ${visible ? 'tadm-signed' : 'tadm-guest'}`}>
    {visible && <header className="tadm-site-header">
      <div className="tadm-topbar">
        <Link className="tadm-title" to="/" aria-label="Go to admin overview">Admin workspace <span>{superAdmin ? 'Super Admin' : 'Branch Admin'}</span></Link>
        <div className="tadm-context">
          <label className="tadm-branch"><span>Branch</span>
            {superAdmin ? <select aria-label="Select branch" value={user.branch_id || ''} onChange={event => setBranch(event.target.value)}>
              <option value="">All branches</option>
              {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}{branch.is_active ? '' : ' (inactive)'}</option>)}
            </select> : <strong>{branches.find(branch => Number(branch.id) === Number(user.branch_id))?.name || `Branch ${user.branch_id}`}</strong>}
          </label>
          <span className="tadm-username">{user.username}</span>
          <button type="button" className="tadm-signout" onClick={logout}>Sign out</button>
          <button type="button" className="tadm-menu" aria-expanded={menuOpen} aria-controls="tadm-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? 'Hide links' : 'All links'}</button>
        </div>
      </div>
      <nav id="tadm-navigation" aria-label="Admin navigation" className={`tadm-topnav${menuOpen ? ' tadm-topnav-expanded' : ''}`}>
        <div className="tadm-nav-scroll">
          {renderLinks(workspace)}
          {superAdmin && <><span className="tadm-nav-divider" aria-hidden="true" />{renderLinks(management)}</>}
          <span className="tadm-nav-divider" aria-hidden="true" />{renderLinks([['Account', '/settings']])}
        </div>
      </nav>
    </header>}
    <div className={visible ? 'tadm-content' : 'tadm-login-content'} data-page={links.find(([,url]) => url === location.pathname)?.[0] || location.pathname}>
      {visible && branchError && <p className="tadm-branch-error" role="alert">Branch list: {branchError}</p>}
      <PageBoundary key={location.pathname}>{children}</PageBoundary>
    </div>
  </div>;
}
