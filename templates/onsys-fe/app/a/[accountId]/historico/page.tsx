import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Button } from "@/_components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/table"
import { Badge } from "@/_components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/_components/ui/dropdown-menu"
import { Download, MoreVertical, Clock, User, FileText } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_components/ui/dialog"

const actionColors = {
  CRIADO: "bg-green-500/10 text-green-500 border-green-500/20",
  EDITADO: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ARQUIVADO: "bg-red-500/10 text-red-500 border-red-500/20",
  DESCARTADO: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  MOVIMENTADO: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

// ----------------------
// 📌 MOCK DATA
// ----------------------

const historicos = [
  {
    id: 1,
    acao: "CRIADO",
    descricao: "Documento criado no sistema",
    criadoEm: new Date(Date.now() - 1000 * 60 * 30),
    usuarioAccount: { usuario: { nome: "Administrador" } },
    convite: null,
  },
  {
    id: 2,
    acao: "EDITADO",
    descricao: "Dados atualizados pelo usuário",
    criadoEm: new Date(Date.now() - 1000 * 60 * 30),

    usuarioAccount: { usuario: { nome: "Maria Silva" } },
    convite: null,
  },
  {
    id: 3,
    acao: "ARQUIVADO",
    descricao: "Arquivo movido para área de arquivamento",
    criadoEm: new Date(Date.now() - 1000 * 60 * 30),

    usuarioAccount: { usuario: { nome: "Administrador" } },
    convite: null,
  },
  {
    id: 4,
    acao: "MOVIMENTADO",
    descricao: "Documento transferido para outro setor",
    criadoEm: new Date(Date.now() - 1000 * 60 * 30),

    usuarioAccount: { usuario: { nome: "João Pedro" } },
    convite: null,
  }
]

const totalAcoes = historicos.length
const usuariosAtivos = new Set(historicos.map(h => h.usuarioAccount?.usuario?.nome)).size
const hoje = new Date()
const acoesHoje = historicos.filter(h => {
  const d = new Date(h.criadoEm)
  return (
    d.getDate() === hoje.getDate() &&
    d.getMonth() === hoje.getMonth() &&
    d.getFullYear() === hoje.getFullYear()
  )
}).length

// ----------------------
// PAGE COMPONENT
// ----------------------

export default async function HistoricoPage({
  params,
}: { params: Promise<{ accountId: string }> }) {

  return (
    <div className="grid grid-cols-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Ações</h1>
        <p className="text-muted-foreground">Visualize todas as ações realizadas no sistema</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Ações</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAcoes}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuariosAtivos}</div>
            <p className="text-xs text-muted-foreground">Realizaram ações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ações Hoje</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acoesHoje}</div>
            <p className="text-xs text-muted-foreground">+0% em relação a ontem</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Registro de Atividades</CardTitle>
            <CardDescription>Visualize o histórico completo de ações</CardDescription>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportar Histórico</DialogTitle>
                <DialogDescription>Escolha o formato de arquivo desejado.</DialogDescription>
              </DialogHeader>

              <div className="flex justify-center gap-4 py-4">
                <Button variant="outline" asChild>
                  <Link href="/api/historico/export?formato=json">
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">JSON</span>
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/api/historico/export?formato=csv">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" />
                      <path d="M8 8h8M8 12h8M8 16h5" />
                    </svg>
                    <span className="text-xs">CSV</span>
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/api/historico/export?formato=excel">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" />
                      <path d="M7 8l4 8m0-8l-4 8m9-8v8" />
                    </svg>
                    <span className="text-xs">Excel</span>
                  </Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicos.map(h => (
                  <TableRow key={h.id}>
                    <TableCell>{new Date(h.criadoEm).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={actionColors[h.acao as keyof typeof actionColors]}>
                        {h.acao}
                      </Badge>
                    </TableCell>
                    <TableCell>{h.convite ? "Convite" : h.usuarioAccount ? "Usuário" : "Outro"}</TableCell>
                    <TableCell className="font-mono">{h.id}</TableCell>
                    <TableCell>{h.usuarioAccount?.usuario?.nome ?? "-"}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{h.descricao}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
