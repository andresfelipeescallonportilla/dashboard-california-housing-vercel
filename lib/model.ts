import weights from '@/lib/data/model.json'

type Weights = { mean: number[]; scale: number[]; W: number[][][]; b: number[][] }
const model = weights as Weights

export const FEATURES = [
  { key: 'MedInc', label: 'Ingreso medio (decenas de miles)', min: 0.5, max: 15, step: 0.1, default: 3.8 },
  { key: 'HouseAge', label: 'Edad media de la vivienda', min: 1, max: 52, step: 1, default: 28 },
  { key: 'AveRooms', label: 'Promedio de habitaciones', min: 1, max: 10, step: 0.1, default: 5.4 },
  { key: 'AveBedrms', label: 'Promedio de dormitorios', min: 0.5, max: 5, step: 0.1, default: 1 },
  { key: 'Population', label: 'Población del bloque', min: 3, max: 35000, step: 1, default: 1425 },
  { key: 'AveOccup', label: 'Ocupación promedio', min: 1, max: 10, step: 0.1, default: 3 },
  { key: 'Latitude', label: 'Latitud', min: 32.5, max: 42, step: 0.1, default: 35.6 },
  { key: 'Longitude', label: 'Longitud', min: -124.3, max: -114.3, step: 0.1, default: -119.5 },
] as const

/** Forward pass of the exported scikit-learn MLPRegressor (ReLU hidden layers, identity output). */
export function predict(inputs: number[]): number {
  let activations = inputs.map((x, i) => (x - model.mean[i]) / model.scale[i])
  model.W.forEach((layer, l) => {
    const isOutput = l === model.W.length - 1
    const bias = model.b[l]
    activations = bias.map((bj, j) => {
      let sum = bj
      for (let i = 0; i < activations.length; i++) sum += activations[i] * layer[i][j]
      return isOutput ? sum : Math.max(0, sum)
    })
  })
  return activations[0]
}
