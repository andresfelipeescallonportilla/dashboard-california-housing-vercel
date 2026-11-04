import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { housing, usd } from '@/lib/housing'

export function ConclusionsTab() {
  const { r2, mae, mape } = housing.metrics
  const medIncCorr = housing.corr[0][housing.columns.indexOf('MedHouseVal')]
  const items = [
    {
      title: 'Fuerte correlación',
      body: `El factor individual más determinante del precio es el ingreso medio (MedInc), con una correlación de ${medIncCorr.toFixed(2)}.`,
    },
    {
      title: 'Distribución geográfica',
      body: 'Los precios son significativamente más altos a lo largo de la costa, en especial cerca del Área de la Bahía y Los Ángeles.',
    },
    {
      title: 'Rendimiento del modelo',
      body: `R² de ${r2.toFixed(4)} (explica ~${(r2 * 100).toFixed(1)}% de la variabilidad), MAE de ${mae.toFixed(4)} (≈ ${usd(mae * 100000)}) y MAPE de ${(mape * 100).toFixed(2)}%.`,
    },
    {
      title: 'Efectividad',
      body: 'La red neuronal captura relaciones no lineales que superan a una regresión lineal clásica, mostrando robustez en sus predicciones.',
    },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conclusiones del EDA y del ejercicio</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((it) => (
            <li key={it.title} className="flex flex-col gap-1 border-l-2 border-primary pl-4">
              <h3 className="font-medium">{it.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
