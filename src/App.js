import React from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './pages/AdminAuth'
import { LoadingProvider } from './pages/LoadingContext'
import AdminHomepageImages from './pages/AdminHomepageImages'
import B2BOrders from './pages/B2BOrders'
import B2BStock from './pages/B2BStock'
import CategoryManagement from './pages/CategoryManagement'
import Customers from './pages/Customers'
import HomePage from './pages/HomePage'
import ImportStock from './pages/ImportStock'
import LoginAdmin from './pages/LoginAdmin'
import OrderIssues from './pages/OrderIssues'
import POS from './pages/POS'
import ReturnReview from './pages/ReturnReview'
import Sales from './pages/Sales'
import Stocks from './pages/Stocks'
import Transaction from './pages/Transaction'

function RequireAuth({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

const protectedPage = page => <RequireAuth>{page}</RequireAuth>

export default function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginAdmin />} />
            <Route path="/" element={protectedPage(<HomePage />)} />
            <Route path="/transactions" element={protectedPage(<Transaction />)} />
            <Route path="/stocks" element={protectedPage(<Stocks />)} />
            <Route path="/sales" element={protectedPage(<Sales />)} />
            <Route path="/customers" element={protectedPage(<Customers />)} />
            <Route path="/pos" element={protectedPage(<POS />)} />
            <Route path="/import" element={protectedPage(<ImportStock />)} />
            <Route path="/categories" element={protectedPage(<CategoryManagement />)} />
            <Route path="/homepage-images" element={protectedPage(<AdminHomepageImages />)} />
            <Route path="/order-issues" element={protectedPage(<OrderIssues />)} />
            <Route path="/returns/:id" element={protectedPage(<ReturnReview />)} />
            <Route path="/b2b-orders" element={protectedPage(<B2BOrders />)} />
            <Route path="/b2b-stock" element={protectedPage(<B2BStock />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </AuthProvider>
  )
}
