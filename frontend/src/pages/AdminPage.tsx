import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Product, Order, OrderStatus } from '../types'
import { INITIAL_ORDERS } from '../data/mockData'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { AdminOverview } from '../components/admin/AdminOverview'
import { AdminProducts } from '../components/admin/AdminProducts'
import { AdminOrders } from '../components/admin/AdminOrders'
import { AdminInventory } from '../components/admin/AdminInventory'

interface AdminPageProps {
  products: Product[]
  onAddProduct: (product: Omit<Product, 'id'>) => void
  onUpdateProduct: (product: Product) => void
  onDeleteProduct: (id: number) => void
  onUpdateStock: (productId: number, newStock: number) => void
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
}) => {
  const { user, isAdmin } = useAuth()

  // Persistent Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('shopsphere-orders')
      return stored ? JSON.parse(stored) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  useEffect(() => {
    localStorage.setItem('shopsphere-orders', JSON.stringify(orders))
  }, [orders])

  // Guard: Admin only
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  return (
    <div className="admin-page-layout">
      <AdminSidebar />
      <section className="admin-main-viewport">
        <Routes>
          <Route
            index
            element={<AdminOverview products={products} orders={orders} />}
          />
          <Route
            path="products"
            element={
              <AdminProducts
                products={products}
                onAddProduct={onAddProduct}
                onUpdateProduct={onUpdateProduct}
                onDeleteProduct={onDeleteProduct}
              />
            }
          />
          <Route
            path="orders"
            element={
              <AdminOrders
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            }
          />
          <Route
            path="inventory"
            element={
              <AdminInventory
                products={products}
                onUpdateStock={onUpdateStock}
              />
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </section>
    </div>
  )
}
