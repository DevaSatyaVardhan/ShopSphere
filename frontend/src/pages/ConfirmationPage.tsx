import React from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Printer, Package } from 'lucide-react'
import type { Order } from '../types'

export const ConfirmationPage: React.FC = () => {
  const lastOrder: Order | null = (() => {
    try {
      const stored = localStorage.getItem('shopsphere-last-order')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  const orderNum = lastOrder?.orderNumber || 'SS-DEMO99'
  const items = lastOrder?.items || []

  return (
    <main className="success-page confirmation-root">
      <div className="confirmation-header">
        <span className="success-icon-badge">
          <Check size={32} strokeWidth={2.5} />
        </span>
        <p className="eyebrow">Order Confirmed</p>
        <h1>
          Thank you for<br />
          <em>choosing well.</em>
        </h1>
        <p className="confirmation-sub">
          Your order <strong>#{orderNum}</strong> has been received and is being carefully prepared by our studio team.
        </p>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="order-stepper-card">
        <h3>Estimated Delivery: {lastOrder?.estimatedDelivery || 'In 3-5 business days'}</h3>
        <div className="stepper-track">
          <div className="stepper-step completed">
            <span className="step-dot">✓</span>
            <span className="step-label">Order Placed</span>
          </div>
          <div className="stepper-step completed">
            <span className="step-dot">✓</span>
            <span className="step-label">Payment Confirmed</span>
          </div>
          <div className="stepper-step active">
            <span className="step-dot">●</span>
            <span className="step-label">Studio Packing</span>
          </div>
          <div className="stepper-step">
            <span className="step-dot">○</span>
            <span className="step-label">Shipped</span>
          </div>
          <div className="stepper-step">
            <span className="step-dot">○</span>
            <span className="step-label">Delivered</span>
          </div>
        </div>
      </div>

      {/* Order Details Receipt Box */}
      {lastOrder && (
        <div className="confirmation-receipt-card">
          <div className="receipt-header">
            <div>
              <span className="receipt-tag">RECEIPT</span>
              <h4>Order #{lastOrder.orderNumber}</h4>
              <span className="receipt-date">
                {new Date(lastOrder.createdAt).toLocaleString()}
              </span>
            </div>
            <button
              className="receipt-print-btn"
              onClick={() => window.print()}
              title="Print Receipt"
            >
              <Printer size={16} /> Print Receipt
            </button>
          </div>

          <div className="receipt-items-list">
            {items.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <img src={item.image} alt={item.productName} />
                <div className="receipt-item-meta">
                  <strong>{item.productName}</strong>
                  <span>Quantity: {item.quantity}</span>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="receipt-totals">
            <div>
              <span>Subtotal</span>
              <span>${lastOrder.subtotal.toFixed(2)}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div>
                <span>Discount</span>
                <span>−${lastOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div>
              <span>Shipping</span>
              <span>{lastOrder.shippingFee === 0 ? 'Free' : `$${lastOrder.shippingFee.toFixed(2)}`}</span>
            </div>
            <hr />
            <div className="receipt-grand-total">
              <strong>Total Paid</strong>
              <strong>${lastOrder.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="receipt-shipping-summary">
            <strong>Delivery Destination:</strong>
            <p>
              {lastOrder.shippingAddress.fullName} · {lastOrder.shippingAddress.address},{' '}
              {lastOrder.shippingAddress.city} {lastOrder.shippingAddress.postalCode}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="confirmation-actions">
        <Link className="primary-button" to="/orders">
          <Package size={16} /> View in My Orders
        </Link>
        <Link className="text-link" to="/products">
          Continue shopping <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
