import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <main className="about-page-root">
      {/* Editorial Hero */}
      <section className="about-hero-section">
        <div className="about-hero-content">
          <p className="eyebrow">Our Story · Est. 2026</p>
          <h1>
            Objects with<br />
            <em>a point of view.</em>
          </h1>
          <p className="about-lead">
            We started ShopSphere because we believe our spaces and daily rituals shape who we become. We design and curate pieces that earn their place—made from honest materials, crafted with quiet dignity, and built to outlast seasons.
          </p>
        </div>

        <div className="about-hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1500&q=85"
            alt="Artisanal ceramics and quiet design atelier"
          />
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="manifesto-section">
        <div className="manifesto-sidebar">
          <span className="eyebrow">The Manifesto</span>
          <h2>Four principles that govern what we make.</h2>
        </div>

        <div className="manifesto-grid">
          <div className="manifesto-card">
            <span className="manifesto-num">01</span>
            <h3>Permanence over novelty</h3>
            <p>
              We reject the planned obsolescence of modern consumerism. If a piece cannot withstand five years of regular use and develop a beautiful patina, we do not produce it.
            </p>
          </div>

          <div className="manifesto-card">
            <span className="manifesto-num">02</span>
            <h3>Material truth</h3>
            <p>
              Wood should feel warm and grain-rich; brass should age and oxidise; wool should regulate warmth naturally; linen should breathe and soften with every wash.
            </p>
          </div>

          <div className="manifesto-card">
            <span className="manifesto-num">03</span>
            <h3>Respect for makers</h3>
            <p>
              We partner with multi-generational workshops in Portugal, Japan, and northern Italy. Every craftsperson is guaranteed fair living compensation and safe working environments.
            </p>
          </div>

          <div className="manifesto-card">
            <span className="manifesto-num">04</span>
            <h3>Radical transparency</h3>
            <p>
              Direct workshop relationships allow us to deliver heirloom luxury without four-fold retail markups or hidden supplier compromises.
            </p>
          </div>
        </div>
      </section>

      {/* Sourcing & Sustainability */}
      <section className="sourcing-strip" id="sustainability">
        <div className="sourcing-banner">
          <div className="sourcing-copy">
            <p className="eyebrow">Mindful Footprint</p>
            <h2>Plastic-free from workshop to your doorway.</h2>
            <p>
              Every parcel leaves our fulfillment studio wrapped in recycled unbleached kraft paper, sealed with water-activated gummed tape, and cushioned with biodegradable cornstarch packing. We purchase verified carbon offsets for 100% of transport emissions.
            </p>
            <div className="sourcing-badges">
              <span>GOTS Certified Cotton</span>
              <span>FSC Certified Paper</span>
              <span>100% Recyclable Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note & CTA */}
      <section className="founder-section">
        <div className="founder-quote-box">
          <Sparkles size={24} className="sparkle-accent" />
          <blockquote>
            “When you surround yourself with fewer, better things, the noise of modern life quiets down. You create room for focus, conversation, and presence.”
          </blockquote>
          <div className="founder-signature">
            <strong>The ShopSphere Curation Collective</strong>
            <span>Porto · Tokyo · San Francisco</span>
          </div>
          <Link to="/products" className="primary-button cta-button">
            Explore the current collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}
