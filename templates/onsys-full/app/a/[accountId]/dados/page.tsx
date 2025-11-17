// app/a/[accountId]/dados/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Button } from "@/_components/ui/button"
import { Input } from "@/_components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/_lib/prisma"
import DadosTable from "@/_components/DadosTable"

export default async function DadosPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params
  const id = Number(accountId)

  const [totalDados, dadosList] = await Promise.all([
    prisma.dados.count({ where: { accountId: id } }),
    prisma.dados.findMany({
      where: { accountId: id },
      include: { status: { select: { nome: true } } },
      orderBy: { criadoEm: "desc" },
    }),
  ])

  const stats = [{ label: "Total de Dados", value: totalDados }]

  return (
    <div className="grid grid-cols-1 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dados</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gerencie os dados registrados</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/a/${accountId}/dados/novo`}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Dado
          </Link>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Dados (Client Component) */}
      <Card>
        <CardHeader className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div>
            <CardTitle>Lista de Dados</CardTitle>
            <CardDescription>Todos os dados cadastrados no sistema</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar dados..." className="pl-9" />
          </div>
        </CardHeader>

        <CardContent>
          <DadosTable dadosList={dadosList} accountId={accountId} /> {/* ✅ */}
        </CardContent>
      </Card>
    </div>
  )
}
