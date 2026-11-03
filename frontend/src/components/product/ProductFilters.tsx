import React from 'react'
import { Search, X, ArrowUpDown } from 'lucide-react'
import { CATEGORIES } from '../../data/mockData'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'
export type PriceRange = 'all' | 'under-50' | '50-100' | '100-150' | 'over-150'

interface ProductFiltersProps {
  selectedCategory: string
  onSelectCategory: (cat: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedSort: SortOption
  onSortChange: (sort: SortOption) => void
  selectedPriceRange: PriceRange
  onPriceRangeChange: (range: PriceRange) => void
  inStockOnly: boolean
  onToggleInStock: (val: boolean) => void
  totalCount: number
  filteredCount: number
  onClearAll: () => void
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  selectedPriceRange,
  onPriceRangeChange,
  inStockOnly,
  onToggleInStock,
  totalCount,
  filteredCount,
  onClearAll,
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All pieces' ||
    searchQuery.trim() !== '' ||
    selectedPriceRange !== 'all' ||
    inStockOnly

  return (
    <div className="catalog-controls">
      {/* Category Pills & Search Row */}
      <div className="filter-primary-bar">
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-filter-input">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Bar: Price Range, Stock Toggle, Sort by, and Counters */}
      <div className="filter-secondary-bar">
        <div className="secondary-left-group">
          {/* Price Range Filter */}
          <div className="dropdown-filter-item">
            <span className="filter-label">Price:</span>
            <select
              value={selectedPriceRange}
              onChange={(e) => onPriceRangeChange(e.target.value as PriceRange)}
              className="styled-select"
            >
              <option value="all">All Prices</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 to $100</option>
              <option value="100-150">$100 to $150</option>
              <option value="over-150">Over $150</option>
            </select>
          </div>

          {/* In-stock toggle */}
          <label className="checkbox-toggle">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
            />
            <span className="toggle-label">In stock only</span>
          </label>
        </div>

        <div className="secondary-right-group">
          {/* Sort By */}
          <div className="dropdown-filter-item">
            <ArrowUpDown size={14} className="sort-icon" />
            <span className="filter-label">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="styled-select"
            >
              <option value="featured">Featured Edit</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          <span className="count-label">
            Showing <strong>{filteredCount}</strong> of {totalCount}
          </span>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <span className="active-filter-prefix">Active filters:</span>

          {selectedCategory !== 'All pieces' && (
            <span className="active-filter-tag">
              Category: {selectedCategory}
              <button onClick={() => onSelectCategory('All pieces')}>
                <X size={12} />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="active-filter-tag">
              "{searchQuery}"
              <button onClick={() => onSearchChange('')}>
                <X size={12} />
              </button>
            </span>
          )}

          {selectedPriceRange !== 'all' && (
            <span className="active-filter-tag">
              Price: {selectedPriceRange.replace('-', '–')}
              <button onClick={() => onPriceRangeChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="active-filter-tag">
              In Stock Only
              <button onClick={() => onToggleInStock(false)}>
                <X size={12} />
              </button>
            </span>
          )}

          <button className="clear-all-filters-btn" onClick={onClearAll}>
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
