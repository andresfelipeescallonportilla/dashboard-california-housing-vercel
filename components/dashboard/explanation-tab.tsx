import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const STEPS = [
  {
    title: 'Propósito',
    body: 'Modelar la compleja relación entre variables demográficas y de ubicación para predecir el valor medio de la vivienda por bloque censal.',
  },
  {
    title: 'Metodología',
    body: 'Red neuronal multicapa (MLP 64-64-32, ReLU, Adam) entrenada sobre el 80% de los datos tras normalizarlos con StandardScaler.',
  },
  {
    title: 'Dashboard integrado',
    body: 'Explora cada etapa del análisis: datos, estadísticas, visualizaciones, métricas del modelo y un simulador de predicción en tiempo real.',
  },
]

export function ExplanationTab() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <Card key={s.title}>
          <CardHeader>
            <CardDescription className="font-mono text-primary">{String(i + 1).padStart(2, '0')}</CardDescription>
            <CardTitle>{s.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">{s.body}</CardContent>
        </Card>
      ))}
    </div>
  )
}
