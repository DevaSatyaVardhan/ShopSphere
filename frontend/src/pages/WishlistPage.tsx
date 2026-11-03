import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, removeFromWishlist, clearWishlist, moveToBag } = useWishlist()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product, 1)
    })
    clearWishlist()
    showToast('Moved all pieces to bag', `${wishlistProducts.length} items added`, 'success')
  }

  if (wishlistProducts.length === 0) {
    return (
      <main className="page-content wishlist-page-root">
        <div className="empty-panel">
          <div className="empty-icon-wrap">
            <Heart size={42} strokeWidth={1.3} />
          </div>
          <h2>Your wishlist is waiting.</h2>
          <p>Tap the heart on any piece to save it here for later consideration or seasonal planning.</p>
          <Link className="primary-button" to="/products">
            Explore the Collection <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-content wishlist-page-root">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Personal Curation</p>
          <h1>
            Saved <em>pieces.</em>
          </h1>
        </div>
        <p>{wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later consideration.</p>
      </div>

      <div className="wishlist-toolbar">
        <button className="primary-button" onClick={handleMoveAllToBag}>
          <ShoppingBag size={16} /> Move all to bag
        </button>
        <button className="outline-button" onClick={clearWishlist}>
          <Trash2 size={16} /> Clear all
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="wishlist-item-card">
            <Link to={`/products/${product.id}`} className="wishlist-image-wrap">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="product-badge">{product.badge}</span>}
            </Link>

            <div className="wishlist-card-content">
              <span className="wishlist-category">{product.category}</span>
              <Link to={`/products/${product.id}`} className="wishlist-title-link">
                <h3>{product.name}</h3>
              </Link>

              <div className="wishlist-price-row">
                <strong className="current-price">${product.price.toFixed(2)}</strong>
                {product.oldPrice && (
                  <del className="old-price">${product.oldPrice.toFixed(2)}</del>
                )}
              </div>

              <div className="wishlist-stock-info">
                {product.stock > 0 ? (
                  <span className="stock-ok">● In stock ({product.stock} available)</span>
                ) : (
                  <span className="stock-out">○ Backorder soon</span>
                )}
              </div>

              <div className="wishlist-actions">
                <button
                  className="primary-button wishlist-move-btn"
                  onClick={() => moveToBag(product.id)}
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag size={15} /> Move to Bag
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
