export interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  badge?: string
  stock: number
  image: string
  images?: string[]
  description: string
  specs?: Record<string, string>
  rating: number
  reviewCount: number
}

export interface Review {
  id: string
  productId: number
  author: string
  rating: number
  date: string
  comment: string
  verified: boolean
}

export interface CartLine {
  productId: number
  quantity: number
}

export interface CartItem extends CartLine {
  product: Product
}

export interface User {
  id?: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
  phone?: string
  avatar?: string
}

export interface Address {
  id: string
  label: string
  recipientName: string
  lineOne: string
  lineTwo?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  image: string
}

export type OrderStatus = 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED'
  paymentMethod: string
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: string
  estimatedDelivery?: string
}

export interface PromoCode {
  code: string
  discountPercent: number
  minSubtotal?: number
  description: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message?: string
}

