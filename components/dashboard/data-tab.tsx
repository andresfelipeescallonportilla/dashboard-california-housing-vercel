import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { housing } from '@/lib/housing'

function DataTable({ rows, first }: { rows: Record<string, number | string>[]; first?: string }) {
  const cols = first ? [first, ...housing.columns] : housing.columns
  return (
    <div className="max-h-[420px] overflow-auto rounded-md border">
      <Table className="font-mono text-xs">
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            {cols.map((c) => (
              <TableHead key={c} className={c === first ? '' : 'text-right'}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {cols.map((c) => {
                const v = row[c]
                return (
                  <TableCell key={c} className={c === first ? 'text-muted-foreground' : 'text-right tabular-nums'}>
                    {typeof v === 'number' ? v.toLocaleString('en', { maximumFractionDigits: 3 }) : v}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function DataTab() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Muestra de datos</CardTitle>
          <CardDescription>Primeras 20 filas del dataset. MedHouseVal está en cientos de miles de USD.</CardDescription>
        </CardHeader>
        <CardContent><DataTable rows={housing.head} /></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumen estadístico</CardTitle>
          <CardDescription>Equivalente a df.describe() sobre los 20.640 registros.</CardDescription>
        </CardHeader>
        <CardContent><DataTable rows={housing.describe} first="stat" /></CardContent>
      </Card>
    </div>
  )
}
