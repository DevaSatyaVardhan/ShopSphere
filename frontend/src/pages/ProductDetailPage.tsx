import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ShoppingBag,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { StarRating } from '../components/common/StarRating'
import { ProductReviews } from '../components/product/ProductReviews'
import { ProductCard } from '../components/product/ProductCard'

interface ProductDetailPageProps {
  products: Product[]
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>()
  const { addToCart, openCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const productId = Number(id)
  const product = products.find((p) => p.id === productId)

  const [quantity, setQuantity] = useState(1)
  const [selectedImgIdx, setSelectedImgIdx] = useState(0)
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')

  if (!product) {
    return <Navigate to="/products" replace />
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image]
  const isSaved = isInWishlist(product.id)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedAnimation(true)
    setTimeout(() => {
      setAddedAnimation(false)
      openCart()
    }, 600)
  }

  return (
    <main className="detail-page-root">
      {/* Breadcrumbs */}
      <div className="breadcrumb-nav">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Collection</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="detail-grid">
        {/* Gallery Column */}
        <div className="detail-gallery-col">
          <div className="detail-main-image-wrap">
            <img
              src={images[selectedImgIdx]}
              alt={product.name}
              className="detail-hero-image"
            />
            {product.badge && <span className="detail-floating-badge">{product.badge}</span>}
          </div>

          {images.length > 1 && (
            <div className="detail-thumb-row">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`detail-thumb-btn ${selectedImgIdx === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImgIdx(idx)}
                >
                  <img src={img} alt={`View angle ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Copy & Purchase Column */}
        <div className="detail-info-col">
          <div className="detail-header-meta">
            <span className="eyebrow">{product.category} · Verified Authentic</span>
            <div className="detail-rating-pill" onClick={() => setActiveTab('reviews')}>
              <StarRating rating={product.rating} count={product.reviewCount} showScore size={14} />
            </div>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>

          <div className="detail-price-box">
            <span className="detail-main-price">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <del className="detail-old-price">${product.oldPrice.toFixed(2)}</del>
            )}
            {product.oldPrice && (
              <span className="save-percent-pill">
                Save ${(product.oldPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock-indicator">
            <span className={`stock-dot ${product.stock > 0 ? 'in' : 'out'}`} />
            {product.stock > 0 ? (
              <span>
                <strong>{product.stock} units</strong> in stock ready for dispatch
              </span>
            ) : (
              <span>Currently out of stock</span>
            )}
          </div>

          {/* Action Row */}
          <div className="detail-actions-row">
            <div className="detail-qty-selector">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className={`primary-button detail-add-cart-btn ${addedAnimation ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {addedAnimation ? (
                <>
                  <Check size={18} /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Bag · ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </button>

            <button
              className={`detail-wishlist-toggle ${isSaved ? 'selected' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="detail-guarantees">
            <div className="guarantee-row">
              <Truck size={17} />
              <span>Complimentary insured shipping over $75</span>
            </div>
            <div className="guarantee-row">
              <RotateCcw size={17} />
              <span>30-day hassle-free return window</span>
            </div>
            <div className="guarantee-row">
              <ShieldCheck size={17} />
              <span>Plastic-free recyclable archival packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <section className="detail-tabs-section">
        <div className="tab-buttons-bar">
          <button
            className={`detail-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Piece Details & Specifications
          </button>
          <button
            className={`detail-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="tab-content-container">
          {activeTab === 'details' ? (
            <div className="specs-tab-view">
              <div className="specs-description">
                <h3>Craftsmanship & Materials</h3>
                <p>{product.description}</p>
                <p>
                  Every piece in our catalog is created in small batches by specialized craft studios. We prioritize longevity, raw beauty, and ease of daily use over seasonal novelty.
                </p>
              </div>

              {product.specs && (
                <div className="specs-table-wrap">
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specs).map(([label, value]) => (
                        <tr key={label}>
                          <th>{label}</th>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <ProductReviews
              productId={product.id}
              overallRating={product.rating}
              reviewCount={product.reviewCount}
            />
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Complementary Pieces</p>
              <h2>You may also appreciate</h2>
            </div>
            <Link to={`/products?category=${product.category}`} className="text-link">
              More in {product.category} <ArrowRight size={15} />
            </Link>
          </div>

          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
