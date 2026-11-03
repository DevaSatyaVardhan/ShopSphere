import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  Truck,
  Check,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import { useCart } from '../context/CartContext'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    cartCount,
    subtotal,
    shippingFee,
    discount,
    total,
    appliedPromo,
    freeShippingThreshold,
    amountUntilFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const success = applyPromoCode(promoInput)
    if (success) setPromoInput('')
  }

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  if (items.length === 0) {
    return (
      <main className="page-content">
        <div className="empty-panel cart-empty-panel">
          <div className="empty-icon-wrap">
            <ShoppingBag size={42} strokeWidth={1.3} />
          </div>
          <h2>Your bag is waiting.</h2>
          <p>You haven't chosen any pieces yet. Explore our curated edit for your home and lifestyle.</p>
          <Link className="primary-button" to="/products">
            Discover the Collection <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-content cart-page-root">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1>
            Shopping <em>bag.</em>
          </h1>
        </div>
        <p>{cartCount} {cartCount === 1 ? 'piece' : 'pieces'} curated and ready for dispatch.</p>
      </div>

      {/* Free Shipping Progress */}
      <div className="cart-shipping-banner">
        <div className="shipping-text-row">
          <Truck size={17} />
          {amountUntilFreeShipping > 0 ? (
            <span>
              Add <strong>${amountUntilFreeShipping.toFixed(2)}</strong> more to unlock{' '}
              <strong>FREE delivery</strong>
            </span>
          ) : (
            <span className="unlocked">
              <Check size={16} /> You qualify for <strong>FREE insured delivery!</strong>
            </span>
          )}
        </div>
        <div className="shipping-progress-track">
          <div className="shipping-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="cart-layout">
        {/* Items Column */}
        <div className="cart-lines-container">
          <div className="cart-table-header">
            <span>Piece</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          <div className="cart-lines-list">
            {items.map(({ product, quantity }) => (
              <div className="cart-line-card" key={product.id}>
                <Link to={`/products/${product.id}`} className="cart-img-link">
                  <img src={product.image} alt={product.name} />
                </Link>

                <div className="cart-line-info">
                  <Link to={`/products/${product.id}`} className="cart-line-title">
                    <h3>{product.name}</h3>
                  </Link>
                  <p className="cart-line-cat">{product.category}</p>
                  <span className="cart-line-unit-price">${product.price.toFixed(2)} each</span>
                  <button
                    className="cart-remove-link"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>

                <div className="cart-line-qty">
                  <div className="quantity-control">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-line-total">
                  <strong>${(product.price * quantity).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions-bar">
            <Link to="/products" className="text-link">
              ← Continue shopping
            </Link>
            <button className="clear-cart-text-btn" onClick={clearCart}>
              Clear all items
            </button>
          </div>
        </div>

        {/* Order Summary Aside */}
        <aside className="summary-card">
          <p className="eyebrow">Order summary</p>

          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount</span>
                <strong>−${discount.toFixed(2)}</strong>
              </div>
            )}

            <div className="summary-row">
              <span>Estimated Delivery</span>
              <strong>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</strong>
            </div>

            <hr />

            <div className="summary-row summary-total">
              <span>Total Payable</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Promo Code Box */}
          <div className="cart-promo-container">
            {appliedPromo ? (
              <div className="applied-promo-badge">
                <div>
                  <Tag size={14} />
                  <strong>{appliedPromo.code}</strong>
                  <span>({appliedPromo.description})</span>
                </div>
                <button onClick={removePromoCode} className="remove-promo-x">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="promo-input-row">
                <input
                  type="text"
                  placeholder="Promo code (WELCOME10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" disabled={!promoInput.trim()}>
                  Apply
                </button>
              </form>
            )}
          </div>

          <button
            className="primary-button full-button"
            onClick={() => navigate('/checkout')}
          >
            Continue to checkout <ArrowRight size={16} />
          </button>

          <div className="cart-security-perks">
            <div>
              <Lock size={14} /> 256-bit SSL encrypted checkout
            </div>
            <div>
              <ShieldCheck size={14} /> 30-day satisfaction guarantee
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

