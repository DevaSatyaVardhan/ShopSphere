/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Product } from '../types'
import { INITIAL_PRODUCTS } from '../data/mockData'
import { useToast } from './ToastContext'
import { useCart } from './CartContext'

interface WishlistContextType {
  wishlistIds: number[]
  wishlistProducts: Product[]
  wishlistCount: number
  isInWishlist: (productId: number) => boolean
  toggleWishlist: (productOrId: Product | number) => void
  removeFromWishlist: (productId: number) => void
  clearWishlist: () => void
  moveToBag: (productId: number) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const STORAGE_KEY = 'shopsphere-wishlist'

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast()
  const { addToCart } = useCart()

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : [2, 4]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds))
  }, [wishlistIds])

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => INITIAL_PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined)
  }, [wishlistIds])

  const isInWishlist = (productId: number) => wishlistIds.includes(productId)

  const toggleWishlist = (productOrId: Product | number) => {
    const id = typeof productOrId === 'number' ? productOrId : productOrId.id
    const product = typeof productOrId === 'number' ? INITIAL_PRODUCTS.find((p) => p.id === id) : productOrId

    if (wishlistIds.includes(id)) {
      setWishlistIds((prev) => prev.filter((item) => item !== id))
      showToast('Removed from wishlist', product ? product.name : undefined, 'info')
    } else {
      setWishlistIds((prev) => [...prev, id])
      showToast('Saved to wishlist', product ? product.name : undefined, 'success')
    }
  }

  const removeFromWishlist = (productId: number) => {
    const product = INITIAL_PRODUCTS.find((p) => p.id === productId)
    setWishlistIds((prev) => prev.filter((item) => item !== productId))
    showToast('Removed from wishlist', product ? product.name : undefined, 'info')
  }

  const clearWishlist = () => {
    setWishlistIds([])
    showToast('Wishlist cleared', undefined, 'info')
  }

  const moveToBag = (productId: number) => {
    const product = INITIAL_PRODUCTS.find((p) => p.id === productId)
    if (product) {
      addToCart(product, 1)
      removeFromWishlist(productId)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToBag,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
