import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import type { Product } from './types'
import { INITIAL_PRODUCTS } from './data/mockData'

// Components
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { CartDrawer } from './components/common/CartDrawer'
import { Toast } from './components/common/Toast'

// Pages
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { WishlistPage } from './pages/WishlistPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { AccountPage } from './pages/AccountPage'
import { OrdersPage } from './pages/OrdersPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { AdminPage } from './pages/AdminPage'

import './App.css'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Products state (persists additions & stock updates in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('shopsphere-products')
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS
    } catch {
      return INITIAL_PRODUCTS
    }
  })

  useEffect(() => {
    localStorage.setItem('shopsphere-products', JSON.stringify(products))
  }, [products])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1
    const product: Product = {
      ...newProductData,
      id: nextId,
    }
    setProducts((prev) => [product, ...prev])
  }

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleUpdateStock = (productId: number, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    )
  }

  return (
    <div className={`site-shell ${isAdminRoute ? 'is-admin-view' : ''}`}>
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<HomePage products={products} />} />
        <Route path="/products" element={<ProductsPage products={products} />} />
        <Route path="/products/:id" element={<ProductDetailPage products={products} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <AdminPage
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateStock={handleUpdateStock}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute && <Footer />}

      <CartDrawer />
      <Toast />
    </div>
  )
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
