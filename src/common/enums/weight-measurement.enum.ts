export enum WeightMeasurementType {
  KG = 'kg',
  G = 'g',

  L = 'l',
  ML = 'ml',
}

export const WEIGHT_CONVERSION_TO_GRAMS: Record<WeightMeasurementType, number> = {
  [WeightMeasurementType.G]: 1,
  [WeightMeasurementType.KG]: 1000,

  [WeightMeasurementType.ML]: 1,
  [WeightMeasurementType.L]: 1000,
}
