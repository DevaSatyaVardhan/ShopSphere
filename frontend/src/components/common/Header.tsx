import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Sparkles,
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  User,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { INITIAL_PRODUCTS } from '../../data/mockData'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, logout } = useAuth()
  const { cartCount, toggleCart } = useCart()
  const { wishlistCount } = useWishlist()

  const [query, setQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      setIsSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  // Quick suggestions based on search query
  const searchSuggestions = query.trim()
    ? INITIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left: Brand */}
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Sparkles size={16} />
          </span>
          <span className="brand-name">ShopSphere</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="desktop-nav">
          <Link
            to="/products"
            className={location.pathname === '/products' && !location.search ? 'active' : ''}
          >
            Collection
          </Link>
          <Link
            to="/products?category=Apparel"
            className={location.search.includes('Apparel') ? 'active' : ''}
          >
            Apparel
          </Link>
          <Link
            to="/products?category=Home"
            className={location.search.includes('Home') ? 'active' : ''}
          >
            Home
          </Link>
          <Link
            to="/products?category=Tech"
            className={location.search.includes('Tech') ? 'active' : ''}
          >
            Tech
          </Link>
          <Link
            to="/products?category=Wellness"
            className={location.search.includes('Wellness') ? 'active' : ''}
          >
            Wellness
          </Link>
          <Link
            to="/about"
            className={location.pathname === '/about' ? 'active' : ''}
          >
            Our Story
          </Link>
          <Link
            to="/contact"
            className={location.pathname === '/contact' ? 'active' : ''}
          >
            FAQ
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="header-actions">
          {/* Search bar */}
          <div className="search-wrap">
            <form onSubmit={handleSearchSubmit} className="search-box">
              <Search size={16} className="search-icon" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search pieces..."
                aria-label="Search collection"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setQuery('')
                    searchInputRef.current?.focus()
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Live search dropdown */}
            {isSearchOpen && searchSuggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                <span className="suggestions-label">Suggestions</span>
                {searchSuggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={() => {
                      setIsSearchOpen(false)
                      setQuery('')
                    }}
                    className="suggestion-item"
                  >
                    <img src={product.image} alt={product.name} />
                    <div className="suggestion-details">
                      <strong>{product.name}</strong>
                      <span>
                        {product.category} · ${product.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="icon-button header-wishlist-btn"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </Link>

          {/* User Account / Dropdown */}
          <div className="user-dropdown-container" ref={dropdownRef}>
            {user ? (
              <button
                className="user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User account menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-nav-avatar" />
                ) : (
                  <UserRound size={19} />
                )}
                <span className="user-firstname">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={userDropdownOpen ? 'rotated' : ''} />
              </button>
            ) : (
              <Link to="/login" className="icon-button" aria-label="Sign in">
                <UserRound size={20} />
              </Link>
            )}

            {/* Dropdown Menu */}
            {user && userDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  {isAdmin && <span className="admin-chip">Administrator</span>}
                </div>
                <hr />
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <LayoutDashboard size={16} /> Admin Portal
                  </Link>
                )}
                <Link to="/account" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                  <User size={16} /> Profile & Addresses
                </Link>
                <Link to="/orders" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                  <Package size={16} /> My Orders
                </Link>
                <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                  <Heart size={16} /> Saved Pieces ({wishlistCount})
                </Link>
                <hr />
                <button
                  className="dropdown-item logout-item"
                  onClick={() => {
                    logout()
                    setUserDropdownOpen(false)
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart Bag Button (opens drawer) */}
          <button
            className="bag-button"
            onClick={toggleCart}
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag size={20} />
            <span className="cart-badge-count">{cartCount}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="icon-button mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div className="mobile-search-bar">
            <form onSubmit={handleSearchSubmit}>
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all pieces..."
              />
            </form>
          </div>
          <div className="mobile-links">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
            <Link to="/products?category=Apparel" onClick={() => setMobileMenuOpen(false)}>Apparel</Link>
            <Link to="/products?category=Home" onClick={() => setMobileMenuOpen(false)}>Home & Living</Link>
            <Link to="/products?category=Tech" onClick={() => setMobileMenuOpen(false)}>Tech & Workspace</Link>
            <Link to="/products?category=Wellness" onClick={() => setMobileMenuOpen(false)}>Wellness & Notes</Link>
            <hr />
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>Saved Wishlist ({wishlistCount})</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>FAQ & Support</Link>
            {user ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Order History</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Portal</Link>}
                <button className="mobile-logout-btn" onClick={() => { logout(); setMobileMenuOpen(false) }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-login-link" onClick={() => setMobileMenuOpen(false)}>
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
