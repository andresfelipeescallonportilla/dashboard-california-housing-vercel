'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

type Props = { data: { x: number; count: number }[]; color: string; label: string; className?: string }

export function Histogram({ data, color, label, className }: Props) {
  const config = { count: { label: 'Frecuencia', color } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={className ?? 'aspect-auto h-64 w-full'}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }} barCategoryGap={1}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => v.toFixed(1)}
          minTickGap={24}
          label={{ value: label, position: 'insideBottom', offset: -2, className: 'fill-muted-foreground text-xs' }}
          height={40}
        />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(_, p) => `${label} ≈ ${p?.[0]?.payload?.x}`} />}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
