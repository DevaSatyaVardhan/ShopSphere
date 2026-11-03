import React, { useState } from 'react'
import { CheckCircle2, MessageSquarePlus, Star } from 'lucide-react'
import type { Review } from '../../types'
import { StarRating } from '../common/StarRating'
import { INITIAL_REVIEWS } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'

interface ProductReviewsProps {
  productId: number
  overallRating: number
  reviewCount: number
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  overallRating,
  reviewCount,
}) => {
  const { showToast } = useToast()

  const [reviews, setReviews] = useState<Review[]>(() => {
    return (
      INITIAL_REVIEWS[productId] || [
        {
          id: `rev-${productId}-1`,
          productId,
          author: 'Devon K.',
          rating: 5,
          date: 'October 14, 2026',
          comment: 'Exceeded my expectations in both tactile feel and durability. Fits seamlessly into my daily routine.',
          verified: true,
        },
      ]
    )
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [userRating, setUserRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !comment.trim()) {
      showToast('Please fill out all fields', undefined, 'error')
      return
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author: authorName.trim(),
      rating: userRating,
      date: 'Today',
      comment: comment.trim(),
      verified: true,
    }

    setReviews([newRev, ...reviews])
    showToast('Review submitted!', 'Thank you for sharing your experience.', 'success')
    setAuthorName('')
    setComment('')
    setIsFormOpen(false)
  }

  // Calculate star distribution percentages
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, percentage }
  })

  return (
    <section className="product-reviews-section">
      <div className="reviews-header">
        <div>
          <span className="eyebrow">Customer Feedback</span>
          <h2>Reviews & Ratings</h2>
        </div>
        <button
          className="outline-button write-review-toggle-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <MessageSquarePlus size={16} /> {isFormOpen ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Metrics Card */}
      <div className="reviews-summary-card">
        <div className="summary-score-col">
          <span className="big-rating-number">{overallRating.toFixed(1)}</span>
          <StarRating rating={overallRating} size={18} />
          <span className="summary-total-text">Based on {Math.max(reviews.length, reviewCount)} reviews</span>
        </div>

        <div className="distribution-bars-col">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="dist-row">
              <span className="dist-star-label">
                {star} <Star size={11} fill="currentColor" />
              </span>
              <div className="dist-bar-track">
                <div className="dist-bar-fill" style={{ width: `${percentage}%` }} />
              </div>
              <span className="dist-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review collapsible form */}
      {isFormOpen && (
        <form onSubmit={handleReviewSubmit} className="review-form-card">
          <h3>Share your thoughts</h3>
          <p className="form-hint">Tell other collectors what you liked or how this piece fits into your life.</p>

          <div className="rating-select-group">
            <span className="input-label">Your Rating:</span>
            <StarRating
              rating={userRating}
              interactive
              onChange={(r) => setUserRating(r)}
              size={22}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <textarea
              placeholder="Write your review here... (e.g. material texture, fit, daily use)"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-button">
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-item">
            <div className="review-item-header">
              <div className="author-meta">
                <div className="author-avatar">{rev.author.charAt(0)}</div>
                <div>
                  <div className="author-name-row">
                    <strong>{rev.author}</strong>
                    {rev.verified && (
                      <span className="verified-badge">
                        <CheckCircle2 size={12} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="review-date">{rev.date}</span>
                </div>
              </div>
              <StarRating rating={rev.rating} size={14} />
            </div>
            <p className="review-body">{rev.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
