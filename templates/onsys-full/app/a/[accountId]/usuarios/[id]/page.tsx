import { prisma } from "@/_lib/prisma"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card"
import { Button } from "@/_components/ui/button"
import { Badge } from "@/_components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/table"
import { ArrowLeft, Mail, Calendar, Activity, Trash, Clock, FileText } from "lucide-react"
import { RoleSelect } from "./RoleSelect"
import { get } from "@/actions/image_upload"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/_components/ui/tooltip"

interface Props {
  params: Promise<{ id: string; accountId: string }>
}

export default async function UsuarioDetalhePage({ params }: Props) {
  const { accountId, id } = await params;

  const session = await getServerSession(authOptions);

  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(id) },
    include: {
      accounts: { include: { account: true, tipoUsuarioAccount: true } },
      status: true,
      tipoUsuario: true,
      convitesCriados: true,
    },
  })

  if (!usuario) return <div>Usuário não encontrado</div>

  const avatarRes = await get(usuario?.image || "")
  const userAvatar = "url" in avatarRes ? avatarRes.url : "/placeholder.svg"

  const atividadesRecentes = await prisma.historico.findMany({
    where: { usuarioId: usuario?.id },
    orderBy: { criadoEm: "desc" },
    take: 5,
  })

  const dadosCriadosCount = await prisma.historico.count({
    where: {
      acao: "CRIADO",
      usuarioId: Number(id),
      accountId: Number(accountId),
      NOT: {
        dadoId: null,
      },
    },
  })

  const estatisticas = [
    { label: "Dados criados", value: dadosCriadosCount, icon: FileText },
  ]

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "CRIADO":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
      case "EDITADO":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
      case "MOVIMENTADO":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
    }
  }
  const tiposUsuariosAccounts = await prisma.tipoUsuarioAccount.findMany()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/a/${accountId}/usuarios`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Usuário</h1>
          <p className="text-muted-foreground">Visualize e gerencie as informações e permissões</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {Number(session?.user?.id) === Number(id) ? (
              // O próprio usuário — botão desativado e explicação
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" disabled>
                    <Trash className="mr-2 h-4 w-4" />
                    Remover da Conta
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Você não pode remover a si mesmo</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              // Outro usuário — botão ativo
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Remover da Conta
                </Button>
              </AlertDialogTrigger>
            )}


          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover usuário da conta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação removerá o acesso de <strong>{usuario.nome}</strong> a esta conta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remover Usuário
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userAvatar || "/placeholder.svg"} alt={usuario.nome} />
                  <AvatarFallback className="text-2xl">{getInitials(usuario.nome)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{usuario.nome}</h3>
                  <p className="text-sm text-muted-foreground">{usuario.email}</p>
                </div>
                <Badge variant="default" className="text-sm">
                  {usuario.status.nome}
                </Badge>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{usuario.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Membro desde</p>
                    <p className="font-medium">{usuario.criadoEm.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Último acesso</p>
                    <p className="font-medium">--</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <RoleSelect userId={usuario.id} tiposUsuariosAccounts={tiposUsuariosAccounts} initialRole={usuario.accounts[0]?.tipoUsuarioAccount.nome} />
          </div>


        </div>

        <div className=" lg:col-span-2">
          <Tabs defaultValue="atividade" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="atividade">Atividade Recente</TabsTrigger>
              <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="atividade" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações realizadas pelo usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ação</TableHead>
                          <TableHead>Entidade</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {atividadesRecentes.map((atividade) => (
                          <TableRow key={atividade.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${getTipoIcon(
                                    atividade.acao
                                  )}`}
                                >
                                  <Activity className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{atividade.descricao || atividade.acao}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="rounded bg-muted px-2 py-1 text-sm">--</code>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {atividade.criadoEm.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>

              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {estatisticas.map((stat) => (
                  <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
