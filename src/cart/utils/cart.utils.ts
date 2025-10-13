import { Cart } from '../entities/cart.entity'
import { WEIGHT_CONVERSION_TO_GRAMS } from 'src/common/enums/weight-measurement.enum'

export function getTotalAndAmount(cart: Cart): {
  total: string
  amount: number
  weightKg: number
} {
  if (cart?.cart_items) {
    let amount = 0
    let total = 0
    let totalWeightGrams = 0

    cart.cart_items.forEach((item) => {
      if (!item.bundle_id) {
        const itemQuantity = Number(item.amount)
        amount += itemQuantity

        const price = parseFloat(String(item.product_id.price))
        const itemOriginalTotal = itemQuantity * price

        total += itemOriginalTotal

        const product = item.product_id
        const weightValue = product.weight
          ? parseFloat(String(product.weight))
          : 0
        const measure: string | null =
          product.measurement_id && product.measurement_id.title_short
            ? product.measurement_id.title_short
            : null

        if (weightValue && measure) {
          const conv = WEIGHT_CONVERSION_TO_GRAMS[measure] ?? 0
          const singleProductGrams = weightValue * conv

          totalWeightGrams += singleProductGrams * itemQuantity
        }
      }
    })

    return {
      total: total.toFixed(2),
      amount,
      weightKg: Number((totalWeightGrams / 1000).toFixed(3))
    }
  } else
    return {
      total: '0.00',
      amount: 0,
      weightKg: 0
    }
}
