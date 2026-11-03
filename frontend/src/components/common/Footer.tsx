import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export const Footer: React.FC = () => {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', undefined, 'error')
      return
    }
    setSubscribed(true)
    showToast('Subscribed!', 'Thank you for joining our weekly edit.', 'success')
    setEmail('')
  }

  return (
    <footer className="site-footer">
      {/* Value props banner */}
      <div className="footer-perks">
        <div className="perk-item">
          <Truck size={22} />
          <div>
            <strong>Complimentary Delivery</strong>
            <p>On all domestic orders over $75</p>
          </div>
        </div>
        <div className="perk-item">
          <RotateCcw size={22} />
          <div>
            <strong>30-Day Thoughtful Returns</strong>
            <p>Simple, prepaid return shipping</p>
          </div>
        </div>
        <div className="perk-item">
          <ShieldCheck size={22} />
          <div>
            <strong>Ethically Crafted</strong>
            <p>Certified mills & sustainable materials</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        {/* Brand & Newsletter */}
        <div className="footer-brand-col">
          <Link className="brand" to="/">
            <span className="brand-mark">
              <Sparkles size={16} />
            </span>
            <span className="brand-name">ShopSphere</span>
          </Link>
          <p className="brand-bio">
            Objects with a point of view. Thoughtful materials, honest craft, and considered essentials designed for modern daily rituals.
          </p>

          <div className="newsletter-wrap">
            <span className="newsletter-title">Subscribe to The Edit</span>
            <p className="newsletter-desc">
              Weekly arrivals, studio essays, and private seasonal previews.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <Check size={16} /> You're on the list. Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link Columns */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Catalog</h4>
            <Link to="/products">All Pieces</Link>
            <Link to="/products?category=Apparel">Apparel</Link>
            <Link to="/products?category=Home">Home & Living</Link>
            <Link to="/products?category=Tech">Tech Accessories</Link>
            <Link to="/products?category=Wellness">Wellness & Paper</Link>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/about#sustainability">Sustainability</Link>
            <Link to="/about#craftsmanship">Craftsmanship</Link>
            <Link to="/contact">Journal & Press</Link>
          </div>

          <div className="footer-col">
            <h4>Customer Care</h4>
            <Link to="/contact">Help & FAQ</Link>
            <Link to="/orders">Track Order</Link>
            <Link to="/contact#shipping">Shipping Info</Link>
            <Link to="/contact#returns">Returns & Exchanges</Link>
            <Link to="/account">My Account</Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <span>© 2026 ShopSphere Ltd. All rights reserved.</span>
          <span className="dot-sep">·</span>
          <Link to="/about">Privacy Policy</Link>
          <span className="dot-sep">·</span>
          <Link to="/about">Terms of Service</Link>
        </div>
        <div className="payment-badges">
          <span className="payment-pill">VISA</span>
          <span className="payment-pill">Mastercard</span>
          <span className="payment-pill">Apple Pay</span>
          <span className="payment-pill">PayPal</span>
        </div>
      </div>
    </footer>
  )
}

