import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  showScore?: boolean
  count?: number
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 14,
  interactive = false,
  onChange,
  showScore = false,
  count,
}) => {
  return (
    <div className="star-rating-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div className="stars" style={{ display: 'inline-flex', gap: '2px' }}>
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1
          const isFilled = rating >= starValue
          const isHalf = !isFilled && rating >= starValue - 0.5

          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: interactive ? 'pointer' : 'default',
                color: isFilled || isHalf ? '#e5a93b' : '#d2d7d9',
                display: 'inline-flex',
                alignItems: 'center',
              }}
              aria-label={`${starValue} star`}
            >
              <Star
                size={size}
                fill={isFilled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={isFilled ? 1 : 1.5}
              />
            </button>
          )
        })}
      </div>
      {showScore && <span className="star-score" style={{ fontSize: '12px', fontWeight: 600, color: '#17212b', marginLeft: '4px' }}>{rating.toFixed(1)}</span>}
      {count !== undefined && (
        <span className="star-count" style={{ fontSize: '11px', color: '#78848c', marginLeft: '2px' }}>
          ({count})
        </span>
      )}
    </div>
  )
}

