import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'lime' | 'mint' | 'rust' | 'navy' | 'gray'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'lime', className = '' }) => {
  return (
    <span className={`custom-badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}

