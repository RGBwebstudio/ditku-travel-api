import { Cart } from '../entities/cart.entity'
// Product import intentionally omitted; CartItem provides the product reference
import { ProductWithoutRatings } from 'src/common/utils/apply-rating'
import { CartItem } from '../entities/cart-item.entity'

export type TransformedPromocode = {
  title: string
  type: string
  itemId: number
  discount: number
} | null

export interface CartItemResponse extends CartItem {
  unavailable?: boolean
  recomended_to_swap?: ProductWithoutRatings[]
}

export interface CartData {
  cart: (Cart & { cart_items?: CartItemResponse[] }) | null
  amount: number
  total: string
  weightKg: number
}
