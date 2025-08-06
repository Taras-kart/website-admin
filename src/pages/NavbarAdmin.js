import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
//import { FaUser, FaHeart, FaShoppingBag, FaSearch, FaTimes } from 'react-icons/fa';
import './NavbarAdmin.css';

const NavbarAdmin = () => {
  //const { wishlistItems } = useWishlist();
  //const { cartItems } = useCart();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        !event.target.closest('.nav-toggle-final')
      ) {
        setIsMobileNavOpen(false);
      }
    };
    if (isMobileNavOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobileNavOpen]);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileNavOpen(false);
  };

  const navLinks = [
    { name: 'Products', path: '/' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Stocks', path: '/stocks' },
    { name: 'Sales', path: '/sales' },
    { name: 'Customers', path: '/customers' },
    //{ name: 'All Brands', path: '/brands' }
  ];

  return (
    <nav className="navbar-final">
      <div className="top-row-final">
        <div className="logo-final">
          <img src="/images/bg.jpg" alt="Logo" />
        </div>

        <div className="nav-toggle-final" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
          <div className="dot-grid-final">
            {[...Array(9)].map((_, i) => (
              <span key={i}></span>
            ))}
          </div>
        </div>

        <div className="nav-right-final desktop-tab-only-final">
          <div className="nav-links-final">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={handleNavClick}
                className={`nav-link-final Btn ${location.pathname === path ? 'active-final' : ''}`}
              >
                <span>{name}</span>
              </Link>
            ))}
          </div>

        </div>
      </div>

      <div className="bottom-row-final mobile-only-final">
        <div className="search-bar-final Btn">
          <input type="text" placeholder="search a product" />
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="mobile-drawer-final" ref={mobileNavRef}>
          <div className="close-btn-final" onClick={() => setIsMobileNavOpen(false)}>
          </div>
          <div className="nav-links-final">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={handleNavClick}
                className={`nav-link-final Btn ${location.pathname === path ? 'active-final' : ''}`}
              >
                {name}
              </Link>
            ))}
          </div>
         
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;
