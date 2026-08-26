import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './NavbarAdmin.css'

const navLinks = [
  { name: 'Products', path: '/' },
  { name: 'Transactions', path: '/transactions' },
  { name: 'Stocks', path: '/stocks' },
  { name: 'Sales', path: '/sales' },
  { name: 'B2B Orders', path: '/b2b-orders' },
  { name: 'B2B Stock', path: '/b2b-stock' },
  { name: 'Customers', path: '/customers' },
  { name: 'POS', path: '/pos' },
  { name: 'Import', path: '/import' },
  { name: 'Categories', path: '/categories' },
  { name: 'Homepage Images', path: '/homepage-images' },
  { name: 'Cancellations', path: '/order-issues' }
]

export default function NavbarAdmin() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const location = useLocation()
  const mobileNavRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = event => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target) && !event.target.closest('.nav-toggle-final')) {
        setIsMobileNavOpen(false)
      }
    }

    if (isMobileNavOpen) document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isMobileNavOpen])

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileNavOpen(false)
  }

  const isActive = path => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="navbar-final">
      <div className="top-row-final">
        <button
          type="button"
          className="nav-toggle-final"
          aria-label="Toggle navigation"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen(open => !open)}
        >
          <span className="dot-grid-final">
            {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
          </span>
        </button>

        <div className="nav-right-final desktop-tab-only-final">
          <div className="nav-links-final">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={handleNavClick}
                className={`nav-link-final Btn ${isActive(path) ? 'active-final' : ''}`}
              >
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="mobile-drawer-final" ref={mobileNavRef}>
          <button type="button" className="close-btn-final" aria-label="Close navigation" onClick={() => setIsMobileNavOpen(false)} />
          <div className="nav-links-final">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={handleNavClick}
                className={`nav-link-final Btn ${isActive(path) ? 'active-final' : ''}`}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
