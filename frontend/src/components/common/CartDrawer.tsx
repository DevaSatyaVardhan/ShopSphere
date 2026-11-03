import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, ArrowRight, Trash2, Tag, Check, Truck } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export const CartDrawer: React.FC = () => {
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
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useCart()

  const navigate = useNavigate()
  const [promoInput, setPromoInput] = useState('')

  if (!isCartOpen) return null

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const success = applyPromoCode(promoInput)
    if (success) setPromoInput('')
  }

  const handleCheckoutClick = () => {
    closeCart()
    navigate('/checkout')
  }

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} />
            <h2>Shopping Bag</h2>
            <span className="drawer-count-pill">{cartCount}</span>
          </div>
          <button className="drawer-close-btn" onClick={closeCart} aria-label="Close bag drawer">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="free-shipping-meter">
          <div className="meter-label">
            <Truck size={15} />
            {amountUntilFreeShipping > 0 ? (
              <span>
                Add <strong>${amountUntilFreeShipping.toFixed(2)}</strong> more for <strong>FREE shipping</strong>
              </span>
            ) : (
              <span className="free-shipping-unlocked">
                <Check size={14} /> You've unlocked <strong>Free Standard Shipping!</strong>
              </span>
            )}
          </div>
          <div className="meter-track">
            <div className="meter-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Item List */}
        <div className="drawer-items">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={48} strokeWidth={1.2} />
              <p className="empty-title">Your bag is empty</p>
              <p className="empty-subtitle">Discover our collection of curated essentials.</p>
              <button
                className="primary-button"
                onClick={() => {
                  closeCart()
                  navigate('/products')
                }}
              >
                Explore Collection <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="drawer-item">
                <img src={product.image} alt={product.name} className="drawer-item-img" />
                <div className="drawer-item-info">
                  <div className="drawer-item-header">
                    <Link
                      to={`/products/${product.id}`}
                      onClick={closeCart}
                      className="drawer-item-name"
                    >
                      {product.name}
                    </Link>
                    <button
                      className="drawer-item-delete"
                      onClick={() => removeFromCart(product.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="drawer-item-category">{product.category}</span>
                  <div className="drawer-item-bottom">
                    <div className="drawer-qty-control">
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
                    <span className="drawer-item-price">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {items.length > 0 && (
          <div className="drawer-footer">
            {/* Promo code toggle */}
            {appliedPromo ? (
              <div className="drawer-promo-applied">
                <Tag size={14} />
                <span>
                  Promo <strong>{appliedPromo.code}</strong> applied ({appliedPromo.description})
                </span>
                <button onClick={removePromoCode} className="remove-promo-btn">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="drawer-promo-form">
                <input
                  type="text"
                  placeholder="Promo code (e.g. WELCOME10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" disabled={!promoInput.trim()}>
                  Apply
                </button>
              </form>
            )}

            {/* Price lines */}
            <div className="drawer-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total-row">
                <strong>Total</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <button className="primary-button checkout-btn" onClick={handleCheckoutClick}>
              Checkout · ${total.toFixed(2)} <ArrowRight size={16} />
            </button>

            <Link
              to="/cart"
              onClick={closeCart}
              className="view-full-bag-link"
            >
              View Full Bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}

