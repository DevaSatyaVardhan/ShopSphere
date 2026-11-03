import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Feather, Shield, HeartHandshake } from 'lucide-react'
import { ProductCard } from '../components/product/ProductCard'
import { CATEGORIES } from '../data/mockData'
import type { Product } from '../types'

interface HomePageProps {
  products: Product[]
}

export const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const trendingProducts = products.slice(0, 4)
  const newArrivals = products.slice(4, 8)

  return (
    <main className="home-page-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">The everyday edit · 2026</p>
          <h1>
            Good things,<br />
            <em>well chosen.</em>
          </h1>
          <p className="hero-text">
            Thoughtful objects and considered essentials for the way you live now. Pure materials, quiet functionality, and enduring craftsmanship.
          </p>
          <div className="hero-cta-group">
            <Link className="primary-button" to="/products">
              Explore the edit <ArrowRight size={17} />
            </Link>
            <Link className="outline-button" to="/about">
              Our philosophy
            </Link>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=90"
            alt="Curated lifestyle aesthetic space"
            className="hero-main-img"
          />
          <div className="hero-note">
            <span className="hero-note-num">01</span>
            <span>
              Curated for<br />the curious
            </span>
          </div>
        </div>
      </section>

      {/* Category Strip */}
      <section className="category-strip">
        <div className="category-strip-copy">
          <p className="eyebrow">Browse by mood</p>
          <h2>Find your next favorite piece.</h2>
          <p className="strip-desc">
            Organized around calm rituals: morning dressing, quiet spaces, digital focus, and mindful reflection.
          </p>
        </div>

        <div className="category-list">
          {CATEGORIES.slice(1).map((category, index) => (
            <Link
              to={`/products?category=${category}`}
              key={category}
              className="category-strip-link"
            >
              <span className="cat-num">0{index + 1}</span>
              <span className="cat-name">{category}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      {/* Value Pillars */}
      <section className="brand-pillars-strip">
        <div className="pillar-item">
          <Compass size={24} />
          <h3>Considered Design</h3>
          <p>Every object is vetted for durability, tactile comfort, and timeless simplicity.</p>
        </div>
        <div className="pillar-item">
          <Feather size={24} />
          <h3>Natural Fibers</h3>
          <p>Organic cotton, raw brass, Japanese paper, and unglazed ceramics that age gracefully.</p>
        </div>
        <div className="pillar-item">
          <Shield size={24} />
          <h3>Traceable Craft</h3>
          <p>Made in verified artisanal workshops across Portugal, Japan, and Italy.</p>
        </div>
        <div className="pillar-item">
          <HeartHandshake size={24} />
          <h3>Quiet Luxury</h3>
          <p>Fair, transparent pricing with direct workshop partnerships—no middlemen markups.</p>
        </div>
      </section>

      {/* Trending Now Products Section */}
      <section className="product-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A little inspiration</p>
            <h2>Trending right now</h2>
          </div>
          <Link to="/products" className="text-link">
            View entire collection <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Promo Banner */}
      <section className="promo-section">
        <div className="promo-copy">
          <p className="eyebrow">Made for the everyday</p>
          <h2>
            Less noise.<br />
            <em>More meaning.</em>
          </h2>
        </div>
        <p className="promo-body">
          We look for the pieces that truly earn their place: beautifully made, quietly useful, and designed to stay with you through years of daily rituals.
        </p>
        <Link className="light-button" to="/about">
          Read our story <ArrowRight size={16} />
        </Link>
      </section>

      {/* New Arrivals Section */}
      <section className="product-section new-arrivals-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fresh in the studio</p>
            <h2>New additions</h2>
          </div>
          <Link to="/products" className="text-link">
            Explore all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
