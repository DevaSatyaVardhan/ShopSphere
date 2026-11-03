/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { CartItem, Product, PromoCode } from '../types'
import { INITIAL_PRODUCTS, PROMO_CODES } from '../data/mockData'
import { useToast } from './ToastContext'

interface CartContextType {
  items: CartItem[]
  cartCount: number
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  appliedPromo: PromoCode | null
  freeShippingThreshold: number
  amountUntilFreeShipping: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addToCart: (productOrId: Product | number, quantity?: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shopsphere-cart'
const PROMO_STORAGE_KEY = 'shopsphere-promo'
const FREE_SHIPPING_THRESHOLD = 75
const STANDARD_SHIPPING_FEE = 8

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast()

  const [rawCart, setRawCart] = useState<{ productId: number; quantity: number }[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : [
        { productId: 1, quantity: 1 },
        { productId: 3, quantity: 2 },
      ]
    } catch {
      return []
    }
  })

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() => {
    try {
      const stored = localStorage.getItem(PROMO_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(rawCart))
  }, [rawCart])

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo))
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY)
    }
  }, [appliedPromo])

  // Hydrate items with product details
  const items: CartItem[] = useMemo(() => {
    return rawCart
      .map((line) => {
        const product = INITIAL_PRODUCTS.find((p) => p.id === line.productId)
        if (!product) return null
        return {
          productId: line.productId,
          quantity: line.quantity,
          product,
        }
      })
      .filter((item): item is CartItem => item !== null)
  }, [rawCart])

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [items])

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0
    if (appliedPromo?.code === 'FREESHIP' || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0
    }
    return STANDARD_SHIPPING_FEE
  }, [subtotal, appliedPromo])

  const discount = useMemo(() => {
    if (!appliedPromo) return 0
    if (appliedPromo.minSubtotal && subtotal < appliedPromo.minSubtotal) return 0
    if (appliedPromo.discountPercent > 0) {
      return Math.round((subtotal * appliedPromo.discountPercent) / 100 * 100) / 100
    }
    return 0
  }, [subtotal, appliedPromo])

  const total = useMemo(() => {
    const rawTotal = subtotal - discount + shippingFee
    return Math.max(0, Math.round(rawTotal * 100) / 100)
  }, [subtotal, discount, shippingFee])

  const amountUntilFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  }, [subtotal])

  const addToCart = (productOrId: Product | number, quantity = 1) => {
    const targetId = typeof productOrId === 'number' ? productOrId : productOrId.id
    const product = typeof productOrId === 'number' ? INITIAL_PRODUCTS.find((p) => p.id === targetId) : productOrId

    setRawCart((prev) => {
      const existing = prev.find((i) => i.productId === targetId)
      if (existing) {
        return prev.map((i) => (i.productId === targetId ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { productId: targetId, quantity }]
    })

    const title = product ? product.name : 'Item'
    showToast(`Added to bag`, `${title} (${quantity}) is now in your bag`, 'success')
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setRawCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)))
  }

  const removeFromCart = (productId: number) => {
    const product = INITIAL_PRODUCTS.find((p) => p.id === productId)
    setRawCart((prev) => prev.filter((i) => i.productId !== productId))
    showToast('Removed from bag', product ? product.name : undefined, 'info')
  }

  const clearCart = () => {
    setRawCart([])
    setAppliedPromo(null)
  }

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase()
    const matched = PROMO_CODES.find((p) => p.code === cleanCode)
    if (!matched) {
      showToast('Invalid promo code', 'Please check the code and try again', 'error')
      return false
    }
    if (matched.minSubtotal && subtotal < matched.minSubtotal) {
      showToast('Minimum requirement not met', `Code requires a subtotal of at least $${matched.minSubtotal}`, 'warning')
      return false
    }
    setAppliedPromo(matched)
    showToast('Promo code applied!', matched.description, 'success')
    return true
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    showToast('Promo code removed', undefined, 'info')
  }

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        shippingFee,
        discount,
        total,
        appliedPromo,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
