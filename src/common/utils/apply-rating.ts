import { Product } from 'src/modules/product/entities/product.entity'

export type ProductWithoutRatings = Omit<Product, 'ratings'>

export function calcRating(entities: Product[]): ProductWithoutRatings[] {
  return entities.map((entity) => {
    let rating = 0
    let rating_count = 0

    if (entity?.ratings?.length) {
      const avgRating =
        entity.ratings
          .map((rating) => rating.rating)
          .reduce((acc, rating) => {
            return acc + Number(rating)
          }, 0) / entity.ratings.length

      rating = Math.round(avgRating * 10) / 10
      rating_count = entity.ratings.length
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ratings, ...productWithoutRatings } = entity

    return { ...productWithoutRatings, rating, rating_count }
  })
}
