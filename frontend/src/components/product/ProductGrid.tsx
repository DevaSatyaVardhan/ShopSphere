import React from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onResetFilters?: () => void
  isLoading?: boolean
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onResetFilters,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="product-skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-text short" />
            <div className="skeleton-text title" />
            <div className="skeleton-text price" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="catalog-empty-state">
        <span className="empty-sparkle">
          <Sparkles size={32} />
        </span>
        <h3>No matching pieces found</h3>
        <p>Try adjusting your search terms, changing categories, or clearing filters.</p>
        {onResetFilters && (
          <button className="primary-button" onClick={onResetFilters}>
            <RotateCcw size={15} /> Reset all filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
