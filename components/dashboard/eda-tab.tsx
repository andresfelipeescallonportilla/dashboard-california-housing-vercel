'use client'

import { useState } from 'react'
import { CartesianGrid, Cell, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { housing } from '@/lib/housing'
import { Histogram } from './histogram'

const VIEWS = [
  { id: 'uni', label: 'Distribuciones univariadas' },
  { id: 'bi', label: 'Ingreso vs valor' },
  { id: 'geo', label: 'Distribución geográfica' },
  { id: 'corr', label: 'Matriz de correlación' },
] as const
type View = (typeof VIEWS)[number]['id']

const valueColor = (v: number) => `oklch(0.72 0.16 ${(250 - (Math.min(v, 5) / 5) * 225).toFixed(0)})`

function Univariate() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Distribución del valor de la vivienda</h3>
        <Histogram data={housing.histHouseVal} color="var(--chart-1)" label="MedHouseVal ($100k)" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Distribución del ingreso medio</h3>
        <Histogram data={housing.histMedInc} color="var(--chart-2)" label="MedInc ($10k)" />
      </div>
    </div>
  )
}

function Bivariate() {
  const config = { y: { label: 'MedHouseVal', color: 'var(--chart-1)' } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className="aspect-auto h-[420px] w-full">
      <ScatterChart margin={{ top: 8, right: 16, bottom: 8 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="MedInc" tickLine={false} height={40}
          label={{ value: 'Ingreso medio ($10k)', position: 'insideBottom', offset: -2, className: 'fill-muted-foreground text-xs' }} />
        <YAxis type="number" dataKey="y" name="MedHouseVal" tickLine={false} width={40} />
        <ZAxis range={[12, 12]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter data={housing.scatter} fill="var(--color-y)" fillOpacity={0.35} isAnimationActive={false} />
      </ScatterChart>
    </ChartContainer>
  )
}

function Geographic() {
  const config = { v: { label: 'MedHouseVal' } } satisfies ChartConfig
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={config} className="mx-auto aspect-[10/9] max-h-[520px] w-full">
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="lon" name="Longitud" domain={[-124.5, -114]} tickLine={false} height={40}
            label={{ value: 'Longitud', position: 'insideBottom', offset: -2, className: 'fill-muted-foreground text-xs' }} />
          <YAxis type="number" dataKey="lat" name="Latitud" domain={[32, 42.5]} tickLine={false} width={40} />
          <ZAxis range={[14, 14]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Scatter data={housing.geo} isAnimationActive={false}>
            {housing.geo.map((p, i) => (
              <Cell key={i} fill={valueColor(p.v)} fillOpacity={0.6} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
      <div className="flex items-center justify-center gap-3 font-mono text-xs text-muted-foreground">
        <span>$0</span>
        <div
          className="h-2 w-48 rounded-full"
          style={{ background: `linear-gradient(to right, ${[0, 1.25, 2.5, 3.75, 5].map(valueColor).join(',')})` }}
          aria-hidden
        />
        <span>$500k+</span>
      </div>
    </div>
  )
}

function Correlation() {
  const cols = housing.columns
  const cellColor = (v: number) =>
    v >= 0 ? `oklch(0.65 0.17 25 / ${Math.abs(v)})` : `oklch(0.65 0.14 250 / ${Math.abs(v)})`
  return (
    <div className="overflow-x-auto">
      <table className="mx-auto border-separate border-spacing-1 font-mono text-xs">
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c} className="h-24 align-bottom font-normal text-muted-foreground">
                <span className="inline-block -rotate-45 origin-bottom-left translate-x-4 whitespace-nowrap">{c}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {housing.corr.map((row, i) => (
            <tr key={cols[i]}>
              <th className="pr-2 text-right font-normal text-muted-foreground">{cols[i]}</th>
              {row.map((v, j) => (
                <td key={j} className="size-12 rounded-sm text-center tabular-nums md:size-14"
                  style={{ backgroundColor: cellColor(v) }} title={`${cols[i]} × ${cols[j]}: ${v}`}>
                  {v.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const DESCRIPTIONS: Record<View, string> = {
  uni: 'Histogramas del valor de la vivienda y del ingreso medio. Nota el tope en $500k del valor.',
  bi: 'Relación entre ingreso medio y valor de la vivienda (muestra aleatoria de 2.500 bloques).',
  geo: 'Ubicación de cada bloque coloreada por su valor medio. La costa concentra los precios más altos.',
  corr: 'Coeficientes de correlación de Pearson entre todas las variables.',
}

export function EdaTab() {
  const [view, setView] = useState<View>('uni')
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Gráficos del análisis exploratorio</CardTitle>
          <CardDescription>{DESCRIPTIONS[view]}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Visualización">
          {VIEWS.map((v) => (
            <Button key={v.id} size="sm" variant={view === v.id ? 'default' : 'outline'}
              aria-pressed={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {view === 'uni' && <Univariate />}
        {view === 'bi' && <Bivariate />}
        {view === 'geo' && <Geographic />}
        {view === 'corr' && <Correlation />}
      </CardContent>
    </Card>
  )
}
