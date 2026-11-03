import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  Package,
  ArrowRight,
  Eye,
  RotateCw,
  Truck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import type { Order } from '../types'
import { INITIAL_ORDERS } from '../data/mockData'
import { Modal } from '../components/common/Modal'
import { useToast } from '../context/ToastContext'

export const OrdersPage: React.FC = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [orders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('shopsphere-orders')
      return stored ? JSON.parse(stored) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.productId, item.quantity)
    })
    showToast('Items added to bag', `Re-ordered pieces from #${order.orderNumber}`, 'success')
  }

  if (orders.length === 0) {
    return (
      <main className="page-content orders-page-root">
        <div className="empty-panel">
          <div className="empty-icon-wrap">
            <Package size={42} strokeWidth={1.3} />
          </div>
          <h2>No orders yet.</h2>
          <p>Once you purchase pieces from our collection, their tracking and history will appear here.</p>
          <Link to="/products" className="primary-button">
            Explore Collection <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-content orders-page-root">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1>
            My <em>orders.</em>
          </h1>
        </div>
        <p>{orders.length} orders recorded in your history.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="customer-order-card" key={order.id}>
            <div className="order-card-header">
              <div className="order-header-left">
                <span className={`status-tag status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
                <h2>Order #{order.orderNumber}</h2>
                <span className="order-date-text">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="order-header-right">
                <span className="order-price-label">Order Total</span>
                <strong className="order-price-val">${order.total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Items row */}
            <div className="order-card-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-card-item">
                  <img src={item.image} alt={item.productName} />
                  <div className="order-item-desc">
                    <Link to={`/products/${item.productId}`}>
                      <strong>{item.productName}</strong>
                    </Link>
                    <span>Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking snippet */}
            <div className="order-tracking-preview">
              <div className="tracking-info">
                <Truck size={16} />
                <span>
                  Estimated Delivery: <strong>{order.estimatedDelivery || 'In 3-5 business days'}</strong>
                </span>
              </div>

              <div className="order-card-actions">
                <button
                  className="outline-button reorder-btn"
                  onClick={() => handleReorder(order)}
                >
                  <RotateCw size={14} /> Buy Again
                </button>
                <button
                  className="primary-button view-details-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye size={14} /> View Tracking & Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details & Tracking Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          maxWidth="640px"
        >
          <div className="order-details-modal">
            {/* Visual stepper */}
            <div className="modal-tracking-stepper">
              <span className="eyebrow">Realtime Logistics Tracking</span>
              <div className="stepper-track mini">
                <div className="stepper-step completed">
                  <span className="step-dot">✓</span>
                  <span className="step-label">Placed</span>
                </div>
                <div
                  className={`stepper-step ${
                    selectedOrder.status !== 'CANCELLED' ? 'completed' : ''
                  }`}
                >
                  <span className="step-dot">✓</span>
                  <span className="step-label">Paid</span>
                </div>
                <div
                  className={`stepper-step ${
                    ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status)
                      ? 'completed'
                      : 'active'
                  }`}
                >
                  <span className="step-dot">●</span>
                  <span className="step-label">Preparing</span>
                </div>
                <div
                  className={`stepper-step ${
                    ['SHIPPED', 'DELIVERED'].includes(selectedOrder.status)
                      ? 'completed'
                      : ''
                  }`}
                >
                  <span className="step-dot">
                    {['SHIPPED', 'DELIVERED'].includes(selectedOrder.status) ? '✓' : '○'}
                  </span>
                  <span className="step-label">Shipped</span>
                </div>
                <div
                  className={`stepper-step ${
                    selectedOrder.status === 'DELIVERED' ? 'completed' : ''
                  }`}
                >
                  <span className="step-dot">
                    {selectedOrder.status === 'DELIVERED' ? '✓' : '○'}
                  </span>
                  <span className="step-label">Delivered</span>
                </div>
              </div>
            </div>

            {/* Ordered Pieces */}
            <div className="modal-items-section">
              <h4>Ordered Items</h4>
              <div className="modal-items-list">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="modal-item-row">
                    <img src={item.image} alt={item.productName} />
                    <div className="modal-item-meta">
                      <strong>{item.productName}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="modal-cost-breakdown">
              <div>
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div>
                  <span>Discount</span>
                  <span>−${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div>
                <span>Shipping</span>
                <span>
                  {selectedOrder.shippingFee === 0
                    ? 'Free'
                    : `$${selectedOrder.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <hr />
              <div className="modal-total-row">
                <strong>Total Paid</strong>
                <strong>${selectedOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Destination */}
            <div className="modal-info-columns">
              <div className="modal-info-col">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress.fullName}</p>
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>
                  {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}
                </p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>

              <div className="modal-info-col">
                <h4>Payment Method</h4>
                <p>{selectedOrder.paymentMethod}</p>
                <p>Status: {selectedOrder.paymentStatus}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}
