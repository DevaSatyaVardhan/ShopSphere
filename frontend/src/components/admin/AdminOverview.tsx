import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import type { Product, Order } from '../../types'

interface AdminOverviewProps {
  products: Product[]
  orders: Order[]
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ products, orders }) => {
  const lowStockProducts = products.filter((p) => p.stock < 12)
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 12840)
  const totalOrders = orders.length + 182

  const salesDays = [
    { day: 'Mon', value: '$1,420', height: '42%' },
    { day: 'Tue', value: '$2,150', height: '63%' },
    { day: 'Wed', value: '$1,840', height: '54%' },
    { day: 'Thu', value: '$2,690', height: '79%' },
    { day: 'Fri', value: '$2,320', height: '68%' },
    { day: 'Sat', value: '$3,140', height: '92%' },
    { day: 'Sun', value: '$2,520', height: '74%' },
  ]

  return (
    <div className="admin-content-inner">
      <div className="admin-top-bar">
        <div>
          <span className="eyebrow">Executive Summary</span>
          <h1 className="admin-page-title">Good afternoon, <em>Admin.</em></h1>
        </div>
        <span className="store-live-pill">
          <span className="live-indicator-dot" /> STORE LIVE
        </span>
      </div>

      {/* Metrics Row */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="stat-label">Total Revenue</span>
          <strong className="stat-value">${totalRevenue.toLocaleString()}</strong>
          <small className="stat-change positive">
            <ArrowUpRight size={14} /> +18.4% vs last month
          </small>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Orders</span>
          <strong className="stat-value">{totalOrders}</strong>
          <small className="stat-sub">14 awaiting fulfilment</small>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Active Pieces</span>
          <strong className="stat-value">{products.length}</strong>
          <small className="stat-change warning">
            {lowStockProducts.length} low stock warnings
          </small>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Total Customers</span>
          <strong className="stat-value">1,248</strong>
          <small className="stat-change positive">
            <ArrowUpRight size={14} /> +96 this month
          </small>
        </div>
      </div>

      {/* Panels Grid: Sales chart + Low Stock */}
      <div className="admin-panels-grid">
        {/* Sales Chart */}
        <section className="admin-panel sales-chart-panel">
          <div className="panel-header">
            <div>
              <h3>Weekly Sales Performance</h3>
              <p className="panel-sub">Daily revenue across the last 7 days</p>
            </div>
            <span className="panel-tag">Realtime</span>
          </div>

          <div className="interactive-bar-chart">
            {salesDays.map((item) => (
              <div key={item.day} className="chart-bar-col">
                <div className="bar-tooltip">{item.value}</div>
                <div className="bar-fill-track">
                  <div className="bar-fill" style={{ height: item.height }} />
                </div>
                <span className="bar-day">{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Low Stock Alerts */}
        <section className="admin-panel low-stock-panel">
          <div className="panel-header">
            <div>
              <h3>Inventory Alerts</h3>
              <p className="panel-sub">Items under 12 units</p>
            </div>
            <Link to="/admin/inventory" className="panel-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="low-stock-list">
            {lowStockProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="stock-alert-item">
                <img src={p.image} alt={p.name} />
                <div className="stock-item-info">
                  <strong>{p.name}</strong>
                  <span>{p.category}</span>
                </div>
                <div className="stock-count-col">
                  <span className={`stock-number ${p.stock < 10 ? 'critical' : 'warning'}`}>
                    {p.stock} units
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Orders Table */}
      <section className="admin-panel recent-orders-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Store Orders</h3>
            <p className="panel-sub">Latest customer transactions</p>
          </div>
          <Link to="/admin/orders" className="panel-link">
            Manage orders <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.orderNumber}</strong>
                  </td>
                  <td>{order.shippingAddress.fullName}</td>
                  <td>{order.items.length} pieces</td>
                  <td>
                    <strong>${order.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`status-tag status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
