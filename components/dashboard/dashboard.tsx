'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { housing } from '@/lib/housing'
import { ExplanationTab } from './explanation-tab'
import { DataTab } from './data-tab'
import { EdaTab } from './eda-tab'
import { SimulatorTab } from './simulator-tab'
import { ConclusionsTab } from './conclusions-tab'

const TABS = [
  { value: 'intro', label: 'Explicación' },
  { value: 'data', label: 'Datos y estadísticas' },
  { value: 'eda', label: 'Análisis exploratorio' },
  { value: 'sim', label: 'Simulador' },
  { value: 'end', label: 'Conclusiones' },
]

export function Dashboard() {
  const { metrics, rows } = housing
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">California Housing · MLP 64-64-32</p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Análisis y predicción del valor de vivienda
          </h1>
        </div>
        <dl className="flex gap-6 font-mono text-sm">
          <div>
            <dt className="text-muted-foreground">Registros</dt>
            <dd className="text-lg">{rows.toLocaleString('es')}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">R²</dt>
            <dd className="text-lg text-primary">{metrics.r2.toFixed(3)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">RMSE</dt>
            <dd className="text-lg">{metrics.rmse.toFixed(3)}</dd>
          </div>
        </dl>
      </header>

      <Tabs defaultValue="intro" className="gap-6">
        <div className="overflow-x-auto">
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-3">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="intro"><ExplanationTab /></TabsContent>
        <TabsContent value="data"><DataTab /></TabsContent>
        <TabsContent value="eda"><EdaTab /></TabsContent>
        <TabsContent value="sim"><SimulatorTab /></TabsContent>
        <TabsContent value="end"><ConclusionsTab /></TabsContent>
      </Tabs>
    </main>
  )
}
