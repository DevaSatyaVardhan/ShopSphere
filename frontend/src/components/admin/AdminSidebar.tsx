import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles,
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  ArrowLeft,
} from 'lucide-react'

export const AdminSidebar: React.FC = () => {
  const location = useLocation()
  const path = location.pathname

  const isOverview = path === '/admin' || path === '/admin/'
  const isProducts = path.startsWith('/admin/products')
  const isOrders = path.startsWith('/admin/orders')
  const isInventory = path.startsWith('/admin/inventory')

  return (
    <aside className="admin-sidebar">
      <Link className="brand admin-brand" to="/">
        <span className="brand-mark">
          <Sparkles size={16} />
        </span>
        <span>ShopSphere</span>
      </Link>

      <span className="admin-portal-badge">ADMIN CONSOLE</span>

      <nav className="admin-nav-links">
        <Link to="/admin" className={`admin-link ${isOverview ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link
          to="/admin/products"
          className={`admin-link ${isProducts ? 'active' : ''}`}
        >
          <Package size={18} /> Products
        </Link>
        <Link
          to="/admin/orders"
          className={`admin-link ${isOrders ? 'active' : ''}`}
        >
          <ShoppingBag size={18} /> Orders
        </Link>
        <Link
          to="/admin/inventory"
          className={`admin-link ${isInventory ? 'active' : ''}`}
        >
          <BarChart3 size={18} /> Inventory
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-exit-btn">
          <ArrowLeft size={16} /> Return to Storefront
        </Link>
      </div>
    </aside>
  )
}

