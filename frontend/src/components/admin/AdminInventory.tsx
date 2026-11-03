import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, PackageX, Plus, Minus, RotateCw } from 'lucide-react'
import type { Product } from '../../types'
import { useToast } from '../../context/ToastContext'

interface AdminInventoryProps {
  products: Product[]
  onUpdateStock: (productId: number, newStock: number) => void
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ products, onUpdateStock }) => {
  const { showToast } = useToast()
  const [filter, setFilter] = useState<'all' | 'low' | 'healthy'>('all')

  const lowStockThreshold = 12

  const lowStockCount = products.filter((p) => p.stock < lowStockThreshold).length
  const healthyCount = products.filter((p) => p.stock >= lowStockThreshold).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const handleAdjust = (productId: number, delta: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    const newStock = Math.max(0, product.stock + delta)
    onUpdateStock(productId, newStock)
    showToast(`Stock updated`, `${product.name}: ${newStock} units available`, 'info')
  }

  const handleRestock = (productId: number, target = 30) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    onUpdateStock(productId, target)
    showToast(`Restocked`, `${product.name} restocked to ${target} units`, 'success')
  }

  const filtered = products.filter((p) => {
    if (filter === 'low') return p.stock < lowStockThreshold
    if (filter === 'healthy') return p.stock >= lowStockThreshold
    return true
  })

  return (
    <div className="admin-content-inner">
      <div className="admin-section-header">
        <div>
          <span className="eyebrow">Warehouse & Reserves</span>
          <h1 className="admin-page-title">Inventory Controls</h1>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-stat-grid inventory-stat-grid">
        <div
          className={`admin-stat-card clickable ${filter === 'all' ? 'active-card' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span className="stat-label">Total SKUs</span>
          <strong className="stat-value">{products.length}</strong>
          <small className="stat-sub">Across 4 categories</small>
        </div>

        <div
          className={`admin-stat-card clickable ${filter === 'low' ? 'active-card' : ''}`}
          onClick={() => setFilter('low')}
        >
          <span className="stat-label">Low Stock Alerts</span>
          <strong className="stat-value" style={{ color: '#b66b5b' }}>
            {lowStockCount}
          </strong>
          <small className="stat-sub">&lt; {lowStockThreshold} units remaining</small>
        </div>

        <div
          className={`admin-stat-card clickable ${filter === 'healthy' ? 'active-card' : ''}`}
          onClick={() => setFilter('healthy')}
        >
          <span className="stat-label">Healthy Supply</span>
          <strong className="stat-value" style={{ color: '#315d4a' }}>
            {healthyCount}
          </strong>
          <small className="stat-sub">Sufficient inventory</small>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Out of Stock</span>
          <strong className="stat-value">{outOfStockCount}</strong>
          <small className="stat-sub">Requires urgent restocking</small>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU / Product</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Stock Status</th>
              <th>Current Stock</th>
              <th className="align-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const isLow = product.stock < lowStockThreshold
              const isOut = product.stock === 0
              const stockPercent = Math.min(100, Math.round((product.stock / 50) * 100))

              return (
                <tr key={product.id}>
                  <td>
                    <div className="table-product-cell">
                      <img src={product.image} alt={product.name} className="table-thumbnail" />
                      <div>
                        <strong>{product.name}</strong>
                        <span className="sku-code">SKU-00{product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    {isOut ? (
                      <span className="status-tag status-cancelled">
                        <PackageX size={12} /> Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="status-tag status-warning">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="status-tag status-delivered">
                        <CheckCircle size={12} /> Healthy
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="stock-level-cell">
                      <strong>{product.stock} units</strong>
                      <div className="stock-micro-bar">
                        <div
                          className={`stock-micro-fill ${isLow ? 'low' : ''}`}
                          style={{ width: `${stockPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="align-right">
                    <div className="stock-adjust-actions">
                      <button
                        className="adjust-btn"
                        onClick={() => handleAdjust(product.id, -5)}
                        title="Reduce by 5"
                        disabled={product.stock < 5}
                      >
                        -5
                      </button>
                      <button
                        className="adjust-btn"
                        onClick={() => handleAdjust(product.id, -1)}
                        title="Reduce by 1"
                        disabled={product.stock <= 0}
                      >
                        <Minus size={13} />
                      </button>
                      <button
                        className="adjust-btn"
                        onClick={() => handleAdjust(product.id, 1)}
                        title="Add 1"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        className="adjust-btn"
                        onClick={() => handleAdjust(product.id, 10)}
                        title="Add 10"
                      >
                        +10
                      </button>
                      <button
                        className="restock-pill-btn"
                        onClick={() => handleRestock(product.id, 40)}
                        title="Restock to 40"
                      >
                        <RotateCw size={12} /> Fill to 40
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
