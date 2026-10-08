import PortalFrame from './PortalFrame';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/AdminAuth';
import { LoadingProvider } from './pages/LoadingContext';
import { Dashboard, StockPage, ProductEditor, SalesPage, ManagementPage, MovementsPage, AuditPage, SettingsPage, ShippingPage } from './pages/Operations';
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
  "ops-password": ["tadm-operations-ops-password"]
})[name] || ["tadm-app-" + name]).join(' ');
const SUPER_PORTAL = false;
const Login = lazy(() => import('./pages/LoginAdmin'));
const ImportStock = lazy(() => import('./pages/ImportStock'));
const POS = lazy(() => import('./pages/POS'));
const Categories = lazy(() => import('./pages/CategoryManagement'));
const Customers = lazy(() => import('./pages/Customers'));
const Homepage = lazy(() => import('./pages/AdminHomepageImages'));
const OrderIssues = lazy(() => import('./pages/OrderIssues'));
const Returns = lazy(() => import('./pages/ReturnReview'));
const B2BOrders = lazy(() => import('./pages/B2BOrders'));
const B2BStock = lazy(() => import('./pages/B2BStock'));
const Coins = lazy(() => import('./pages/CoinsSettings'));
function Guard({
  children,
  superOnly = false
}) {
  const {
    token,
    user,
    ready
  } = useAuth();
  if (!ready) return <div className={portalClass("ops-empty")}>Checking your session...</div>;
  if (!token || !user) return <Navigate to="/login" replace />;
  if ((SUPER_PORTAL || superOnly) && user.role !== 'SUPER_ADMIN') return <div className={portalClass("ops-empty")}>This page requires super admin access. <a href="/login" className="tadm-app-node-0">Sign in with another account</a></div>;
  return children;
}
const protect = (page, superOnly = false) => <Guard superOnly={superOnly}>{page}</Guard>;
export default function App() {
  return <AuthProvider><LoadingProvider><BrowserRouter><PortalFrame><Suspense fallback={<div className={portalClass("ops-empty")}>Loading page...</div>}><Routes><Route path="/login" element={<Login />} /><Route path="/" element={protect(<Dashboard />)} /><Route path="/stocks" element={protect(<StockPage />)} /><Route path="/products" element={protect(<ProductEditor />)} /><Route path="/sales" element={protect(<SalesPage />)} /><Route path="/transactions" element={protect(<MovementsPage />)} /><Route path="/pos" element={protect(<POS />)} /><Route path="/import" element={protect(<ImportStock />)} /><Route path="/branches" element={protect(<ManagementPage kind="branches" />, true)} /><Route path="/branch-admins" element={protect(<ManagementPage kind="admins" />, true)} /><Route path="/categories" element={protect(<Categories />, true)} /><Route path="/customers" element={protect(<Customers />, true)} /><Route path="/homepage-images" element={protect(<Homepage />, true)} /><Route path="/order-issues" element={protect(<OrderIssues />, true)} /><Route path="/returns/:id" element={protect(<Returns />, true)} /><Route path="/b2b-orders" element={protect(<B2BOrders />, true)} /><Route path="/b2b-stock" element={protect(<B2BStock />, true)} /><Route path="/shipping" element={protect(<ShippingPage />, true)} /><Route path="/coin-settings" element={protect(<Coins />, true)} /><Route path="/audit" element={protect(<AuditPage />, true)} /><Route path="/settings" element={protect(<SettingsPage />)} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></Suspense></PortalFrame></BrowserRouter></LoadingProvider></AuthProvider>;
}
