import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card"
import {
  MapPin,
  Layers,
  Package,
  FileText,
  TrendingUp,
} from "lucide-react"
import {prisma} from "@/_lib/prisma"
import Image from "next/image"
import HeroSection from "@/_components/hero-section"

export default async function DashboardPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params
  const id = Number(accountId)

  const agora = new Date()

  // ============================================
  // CONSULTAS BÁSICAS DE QUANTIDADE
  // ============================================
  const [
    totalUsuariosAtivos,
  ] = await Promise.all([
    prisma.usuarioAccount.count({ where: { accountId: id, statusId: 1 } }),
  ])

  const formatChange = (novos: number, total: number) => {
    if (novos === 0) return "Sem novos este mês"
    const percent = total > 0 ? ((novos / total) * 100).toFixed(1) : "100"
    return `+${novos} (${percent}%) este mês`
  }

  // ============================================
  // ESTATÍSTICAS
  // ============================================
  const stats = [
    {
      title: "Total de Dados",
      value: totalUsuariosAtivos,
      change: formatChange(totalUsuariosAtivos, totalUsuariosAtivos),
      icon: MapPin,
    },
    {
      title: "Dados Ativos",
      value: totalUsuariosAtivos,
      change: formatChange(totalUsuariosAtivos, totalUsuariosAtivos),
      icon: Layers,
    },
    {
      title: "Dados Registrados",
      value: totalUsuariosAtivos,
      change: formatChange(totalUsuariosAtivos, totalUsuariosAtivos),
      icon: Package,
    },
    {
      title: "Total de Usuarios",
      value: totalUsuariosAtivos,
      change: formatChange(totalUsuariosAtivos, totalUsuariosAtivos),
      icon: FileText,
    },
  ]

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
          <p className="text-muted-foreground">Visão geral do sistema de gestão de dados</p>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

       <HeroSection
        title="Sistema de Registro de Plantões"
        city="São Miguel do Guaporé"
        imageSrc="/dashboard.png"
        imageAlt="Sistema de registro de plantões médicos e funerários"
      />
    </div>
  )
}
