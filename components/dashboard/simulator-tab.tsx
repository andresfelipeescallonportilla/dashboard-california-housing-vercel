'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { FEATURES, predict } from '@/lib/model'
import { housing, usd } from '@/lib/housing'
import { Histogram } from './histogram'

const defaults = FEATURES.map((f) => f.default)

export function SimulatorTab() {
  const [values, setValues] = useState<number[]>(defaults)
  const prediction = useMemo(() => predict(values), [values])
  const { metrics } = housing

  const metricList = [
    { label: 'MSE', value: metrics.mse.toFixed(4) },
    { label: 'RMSE', value: metrics.rmse.toFixed(4) },
    { label: 'MAE', value: metrics.mae.toFixed(4) },
    { label: 'MAPE', value: `${(metrics.mape * 100).toFixed(2)}%` },
    { label: 'R²', value: metrics.r2.toFixed(4) },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de predicción</CardTitle>
          <CardDescription>Ajusta los parámetros del bloque; la red neuronal predice en tu navegador.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-4" aria-live="polite">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Precio estimado</p>
            <p className="font-mono text-3xl font-semibold text-primary tabular-nums">
              {usd(Math.max(0, prediction) * 100000)}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {FEATURES.map((f, i) => (
              <div key={f.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <label id={`lbl-${f.key}`}>{f.label}</label>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {values[i].toLocaleString('en', { maximumFractionDigits: 1 })}
                  </span>
                </div>
                <Slider
                  aria-labelledby={`lbl-${f.key}`}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={[values[i]]}
                  onValueChange={(v) => {
                    const next = Array.isArray(v) ? v[0] : v
                    setValues((prev) => prev.map((p, j) => (j === i ? next : p)))
                  }}
                />
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setValues(defaults)} className="self-start">
            Restablecer valores
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de la red neuronal</CardTitle>
          <CardDescription>Evaluadas sobre el 20% de test (4.128 bloques).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {metricList.map((m) => (
              <div key={m.label} className="rounded-md border p-3">
                <dt className="text-xs text-muted-foreground">{m.label}</dt>
                <dd className="font-mono text-lg tabular-nums">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Distribución de errores (residuales)</h3>
            <Histogram data={housing.residuals} color="var(--chart-4)" label="y_real − y_pred" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
