import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CreditCard,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import type { Order, OrderStatus } from '../types'
import { useToast } from '../context/ToastContext'

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const { items, subtotal, shippingFee, discount, clearCart } = useCart()

  // Form states
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || 'Alex')
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || 'Morgan')
  const [email, setEmail] = useState(user?.email || 'alex@example.com')
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678')
  const [address, setAddress] = useState('42 Market Street, Apt 4B')
  const [city, setCity] = useState('San Francisco')
  const [state, setState] = useState('CA')
  const [postalCode, setPostalCode] = useState('94103')
  const [country, setCountry] = useState('United States')

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')

  // Payment method
  const [paymentType, setPaymentType] = useState<'card' | 'wallet'>('card')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvv, setCardCvv] = useState('842')

  // Simulation outcome
  const [simulatedResult, setSimulatedResult] = useState<'success' | 'failure'>('success')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const effectiveShipping = shippingMethod === 'express' ? shippingFee + 15 : shippingFee
  const finalTotal = Math.max(0, subtotal - discount + effectiveShipping)

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      showToast('Your bag is empty', 'Add items before proceeding to checkout', 'error')
      navigate('/products')
      return
    }

    if (simulatedResult === 'failure') {
      showToast('Payment Simulation Failed', 'Your card was declined by the simulated gateway.', 'error')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const orderNumber = `SS-${Date.now().toString().slice(-6)}`
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal,
        shippingFee: effectiveShipping,
        discount,
        total: finalTotal,
        status: 'CONFIRMED' as OrderStatus,
        paymentStatus: 'PAID',
        paymentMethod:
          paymentType === 'card' ? `Credit Card (${cardNumber.slice(-4)})` : 'Apple Pay / Digital Wallet',
        shippingAddress: {
          fullName: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          address,
          city: `${city}, ${state}`,
          postalCode,
          country,
        },
        createdAt: new Date().toISOString(),
        estimatedDelivery: shippingMethod === 'express' ? 'In 1-2 business days' : 'In 3-5 business days',
      }

      // Save order to history
      const existingOrders: Order[] = JSON.parse(
        localStorage.getItem('shopsphere-orders') || '[]'
      )
      localStorage.setItem('shopsphere-orders', JSON.stringify([newOrder, ...existingOrders]))
      localStorage.setItem('shopsphere-last-order', JSON.stringify(newOrder))

      clearCart()
      showToast('Order confirmed!', `Order #${orderNumber} placed successfully`, 'success')
      navigate('/confirmation')
    }, 600)
  }

  if (items.length === 0) {
    return (
      <main className="page-content">
        <div className="empty-panel">
          <h2>Nothing to checkout</h2>
          <p>Your bag is currently empty.</p>
          <Link to="/products" className="primary-button">
            Shop Collection
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-content checkout-page-root">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Almost yours</p>
          <h1>
            Complete <em>checkout.</em>
          </h1>
        </div>
        <p>Insured shipping, transparent taxes, and flexible payment methods.</p>
      </div>

      <div className="checkout-layout">
        {/* Checkout Form */}
        <form className="checkout-main-form" onSubmit={handlePlaceOrder}>
          {/* Contact Details */}
          <section className="checkout-section-block">
            <h2 className="checkout-step-title">1. Contact Information</h2>
            <div className="form-grid">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                required
                type="email"
                placeholder="Email address for receipt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="checkout-section-block">
            <h2 className="checkout-step-title">2. Delivery Address</h2>
            <div className="form-grid">
              <input
                required
                className="wide-input"
                placeholder="Street address & apartment/suite"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                required
                placeholder="State / Region"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <input
                required
                placeholder="Postal / ZIP code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <input
                required
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </section>

          {/* Shipping Method */}
          <section className="checkout-section-block">
            <h2 className="checkout-step-title">3. Shipping Speed</h2>
            <div className="shipping-option-cards">
              <label
                className={`shipping-card ${shippingMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('standard')}
              >
                <input
                  type="radio"
                  name="shippingSpeed"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                />
                <div className="shipping-card-info">
                  <strong>Standard Delivery</strong>
                  <span>Delivered in 3–5 business days</span>
                </div>
                <strong className="shipping-price">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </strong>
              </label>

              <label
                className={`shipping-card ${shippingMethod === 'express' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('express')}
              >
                <input
                  type="radio"
                  name="shippingSpeed"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                />
                <div className="shipping-card-info">
                  <strong>Express Priority Courier</strong>
                  <span>Delivered in 1–2 business days</span>
                </div>
                <strong className="shipping-price">+$15.00</strong>
              </label>
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section-block">
            <h2 className="checkout-step-title">4. Payment Method</h2>

            <div className="payment-type-pills">
              <button
                type="button"
                className={`payment-tab-pill ${paymentType === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentType('card')}
              >
                <CreditCard size={16} /> Credit / Debit Card
              </button>
              <button
                type="button"
                className={`payment-tab-pill ${paymentType === 'wallet' ? 'active' : ''}`}
                onClick={() => setPaymentType('wallet')}
              >
                Apple Pay / Google Wallet
              </button>
            </div>

            {paymentType === 'card' ? (
              <div className="card-input-box">
                <div className="form-grid">
                  <input
                    className="wide-input"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                  <input
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                  <input
                    placeholder="CVV / CVC"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="wallet-note-box">
                <CheckCircle2 size={18} />
                <span>Simulated Express Wallet is enabled and ready to authenticate.</span>
              </div>
            )}

            {/* Simulated Payment Outcome Toggle */}
            <div className="simulation-box">
              <span className="simulation-title">Payment Simulation Mode</span>
              <p className="form-hint">
                Choose the simulated outcome to test both success and card decline scenarios:
              </p>
              <div className="simulation-buttons">
                <button
                  type="button"
                  className={`sim-btn ${simulatedResult === 'success' ? 'selected success' : ''}`}
                  onClick={() => setSimulatedResult('success')}
                >
                  ✓ Payment Succeeds
                </button>
                <button
                  type="button"
                  className={`sim-btn ${simulatedResult === 'failure' ? 'selected failure' : ''}`}
                  onClick={() => setSimulatedResult('failure')}
                >
                  × Payment Fails / Declined
                </button>
              </div>
              {simulatedResult === 'failure' && (
                <div className="sim-warning">
                  <AlertCircle size={15} /> Payment will simulate a card decline. Switch to
                  "Succeeds" to finalize the order.
                </div>
              )}
            </div>
          </section>

          <button
            className="primary-button checkout-submit-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authorizing...' : `Place Order · $${finalTotal.toFixed(2)}`}
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Order Review Sidebar */}
        <aside className="checkout-summary-card">
          <p className="eyebrow">Review your bag</p>

          <div className="checkout-items-preview">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="preview-item-row">
                <img src={product.image} alt={product.name} />
                <div className="preview-meta">
                  <strong>{product.name}</strong>
                  <span>Qty: {quantity}</span>
                </div>
                <strong>${(product.price * quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <hr />

          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount Applied</span>
                <strong>−${discount.toFixed(2)}</strong>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping Speed</span>
              <strong>{effectiveShipping === 0 ? 'FREE' : `$${effectiveShipping.toFixed(2)}`}</strong>
            </div>
            <hr />
            <div className="summary-row summary-total">
              <span>Total Payable</span>
              <strong>${finalTotal.toFixed(2)}</strong>
            </div>
          </div>

          <div className="checkout-trust-perks">
            <div className="trust-item">
              <Lock size={15} />
              <span>Encrypted payment gateway</span>
            </div>
            <div className="trust-item">
              <Truck size={15} />
              <span>Fast tracked dispatch</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={15} />
              <span>Full purchase guarantee</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
