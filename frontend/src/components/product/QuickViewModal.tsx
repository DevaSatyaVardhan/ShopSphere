import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, ArrowRight, Check } from 'lucide-react'
import type { Product } from '../../types'
import { Modal } from '../common/Modal'
import { StarRating } from '../common/StarRating'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

interface QuickViewModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [added, setAdded] = useState(false)

  const wishlisted = isInWishlist(product.id)
  const images = product.images && product.images.length > 0 ? product.images : [product.image]

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 900)
  }

  const handleViewFull = () => {
    onClose()
    navigate(`/products/${product.id}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="820px">
      <div className="quickview-grid">
        {/* Images */}
        <div className="quickview-gallery">
          <div className="quickview-main-img-wrap">
            <img src={selectedImage} alt={product.name} className="quickview-main-img" />
          </div>
          {images.length > 1 && (
            <div className="quickview-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`qv-thumb-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="quickview-details">
          <div className="qv-category-row">
            <span className="eyebrow">{product.category}</span>
            <span className="qv-stock-tag">
              {product.stock > 0 ? `● ${product.stock} in stock` : '○ Out of stock'}
            </span>
          </div>

          <h2 className="qv-title">{product.name}</h2>

          <div className="qv-rating-row">
            <StarRating rating={product.rating} count={product.reviewCount} showScore size={15} />
          </div>

          <div className="qv-price-row">
            <span className="qv-price">${product.price.toFixed(2)}</span>
            {product.oldPrice && <del className="qv-old-price">${product.oldPrice.toFixed(2)}</del>}
          </div>

          <p className="qv-description">{product.description}</p>

          {/* Quick Specs */}
          {product.specs && (
            <div className="qv-specs">
              {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                <div key={key} className="qv-spec-row">
                  <span className="spec-key">{key}:</span>
                  <span className="spec-val">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="qv-actions">
            <div className="qv-qty-picker">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase"
              >
                +
              </button>
            </div>

            <button
              className={`primary-button qv-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to Bag · ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </button>

            <button
              className={`qv-wishlist-btn ${wishlisted ? 'selected' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <button className="qv-view-detail-btn" onClick={handleViewFull}>
            View full piece details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Modal>
  )
}
