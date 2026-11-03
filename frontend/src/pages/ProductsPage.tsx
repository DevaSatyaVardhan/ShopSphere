import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product } from '../types'
import { ProductGrid } from '../components/product/ProductGrid'
import {
  ProductFilters,
  type SortOption,
  type PriceRange,
} from '../components/product/ProductFilters'

interface ProductsPageProps {
  products: Product[]
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get('category') || 'All pieces'
  const searchQuery = searchParams.get('search') || ''

  const [selectedSort, setSelectedSort] = useState<SortOption>('featured')
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('all')
  const [inStockOnly, setInStockOnly] = useState(false)

  const handleCategoryChange = (cat: string) => {
    const next = new URLSearchParams(searchParams)
    if (cat === 'All pieces') {
      next.delete('category')
    } else {
      next.set('category', cat)
    }
    setSearchParams(next)
  }

  const handleSearchChange = (query: string) => {
    const next = new URLSearchParams(searchParams)
    if (!query.trim()) {
      next.delete('search')
    } else {
      next.set('search', query)
    }
    setSearchParams(next)
  }

  const handleClearAll = () => {
    setSelectedSort('featured')
    setSelectedPriceRange('all')
    setInStockOnly(false)
    setSearchParams({})
  }

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'All pieces' && product.category !== selectedCategory) {
          return false
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchName = product.name.toLowerCase().includes(q)
          const matchCat = product.category.toLowerCase().includes(q)
          const matchDesc = product.description.toLowerCase().includes(q)
          if (!matchName && !matchCat && !matchDesc) return false
        }

        // Price range filter
        if (selectedPriceRange === 'under-50' && product.price >= 50) return false
        if (selectedPriceRange === '50-100' && (product.price < 50 || product.price > 100)) return false
        if (selectedPriceRange === '100-150' && (product.price < 100 || product.price > 150)) return false
        if (selectedPriceRange === 'over-150' && product.price <= 150) return false

        // Stock filter
        if (inStockOnly && product.stock <= 0) return false

        return true
      })
      .sort((a, b) => {
        if (selectedSort === 'price-asc') return a.price - b.price
        if (selectedSort === 'price-desc') return b.price - a.price
        if (selectedSort === 'rating') return b.rating - a.rating
        if (selectedSort === 'name') return a.name.localeCompare(b.name)
        return 0 // 'featured' keeps natural catalog ordering
      })
  }, [products, selectedCategory, searchQuery, selectedPriceRange, inStockOnly, selectedSort])

  return (
    <main className="page-content catalog-page-root">
      <div className="page-heading">
        <div>
          <p className="eyebrow">The collection · {products.length} Items</p>
          <h1>
            Find your <em>everyday.</em>
          </h1>
        </div>
        <p>
          Good design, useful details, and pieces with room to become yours over time.
        </p>
      </div>

      <ProductFilters
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
        inStockOnly={inStockOnly}
        onToggleInStock={setInStockOnly}
        totalCount={products.length}
        filteredCount={filteredProducts.length}
        onClearAll={handleClearAll}
      />

      <ProductGrid
        products={filteredProducts}
        onResetFilters={handleClearAll}
      />
    </main>
  )
}
