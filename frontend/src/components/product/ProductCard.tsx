import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { StarRating } from '../common/StarRating'
import { QuickViewModal } from './QuickViewModal'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const wishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  const isLowStock = product.stock > 0 && product.stock <= 8

  return (
    <>
      <article className="product-card">
        <div className="product-image-container">
          <Link to={`/products/${product.id}`} className="product-image-link">
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="product-badge-group">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {isLowStock && <span className="stock-alert-badge">Only {product.stock} left</span>}
          </div>

          {/* Wishlist button */}
          <button
            className={`wishlist-button ${wishlisted ? 'selected' : ''}`}
            onClick={handleWishlistClick}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick View Button on Hover */}
          <button
            className="quick-view-btn"
            onClick={handleQuickViewClick}
            aria-label="Quick preview"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>

        {/* Product Meta */}
        <div className="product-card-body">
          <div className="card-top-meta">
            <span className="product-category-label">{product.category}</span>
            <StarRating rating={product.rating} count={product.reviewCount} size={12} />
          </div>

          <Link to={`/products/${product.id}`} className="product-title-link">
            <h3 className="product-card-title">{product.name}</h3>
          </Link>

          <div className="product-card-price-row">
            <div className="product-prices">
              <strong className="current-price">${product.price.toFixed(2)}</strong>
              {product.oldPrice && (
                <del className="old-price">${product.oldPrice.toFixed(2)}</del>
              )}
            </div>

            <button
              className={`card-add-btn ${justAdded ? 'added' : ''}`}
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to bag`}
            >
              {justAdded ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Add to Bag
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  )
}
