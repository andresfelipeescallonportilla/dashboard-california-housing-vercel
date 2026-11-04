import raw from '@/lib/data/housing.json'

type Bin = { x: number; count: number }
type Row = Record<string, number>

export type HousingData = {
  columns: string[]
  rows: number
  head: Row[]
  describe: (Row & { stat: string })[]
  histHouseVal: Bin[]
  histMedInc: Bin[]
  scatter: { x: number; y: number }[]
  geo: { lon: number; lat: number; v: number }[]
  corr: number[][]
  residuals: Bin[]
  metrics: { mse: number; rmse: number; mae: number; mape: number; r2: number }
}

export const housing = raw as unknown as HousingData

export const usd = (v: number) =>
  new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
