import { Button } from "@/_components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select"
import { Textarea } from "@/_components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs"
import { Badge } from "@/_components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { revalidatePath } from "next/cache"
import { FormSubmitButton } from "@/_components/form-submit-button"

// ======================================
// Server Action: Atualizar Dado
// ======================================
async function updateDadoAction(formData: FormData) {
  "use server"

  const id = Number(formData.get("id"))
  const accountId = Number(formData.get("accountId"))
  const titulo = String(formData.get("titulo") ?? "")
  const descricao = String(formData.get("descricao") ?? "")
  const conteudo = String(formData.get("conteudo") ?? "")
  const statusId = Number(formData.get("statusId"))
  const usuarioId = Number(formData.get("usuarioId"))

  if (!id || !accountId || !titulo || !statusId)
    throw new Error("Campos obrigatórios ausentes")

  await prisma.dados.update({
    where: { id },
    data: { titulo, descricao, conteudo, statusId },
  })

  await prisma.historico.create({
    data: {
      usuarioAccountUsuarioId: usuarioId,
      accountId,
      dadoId: id,
      acao: "EDITADO",
      descricao: "Dado atualizado com sucesso",
    },
  })

  revalidatePath(`/a/${accountId}/dados/${id}`)
}

// ======================================
// Página: Detalhes do Dado
// ======================================
export default async function DadoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string; accountId: string }>
}) {
  const { id, accountId } = await params
  const dadoId = Number(id)
  const accId = Number(accountId)
  const session = await getServerSession(authOptions)

  const dado = await prisma.dados.findUnique({
    where: { id: dadoId },
    include: {
      status: true,
      historico: {
        include: { usuarioAccount: { include: { usuario: true } } },
        orderBy: { criadoEm: "desc" },
      },
    },
  })

  const statusItems = await prisma.tipoStatus.findMany()

  if (!dado) return <p>Dado não encontrado.</p>

  return (
    <div className="space-y-6">
      {/* Cabeçalho adaptável */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/a/${accountId}/dados`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words">
                {dado.titulo}
              </h1>
              <Badge variant="default" className="whitespace-nowrap">
                {dado.status.nome}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Visualize e edite as informações do dado
            </p>
          </div>
        </div>

        <FormSubmitButton form="formDado">
          Salvar Alterações
        </FormSubmitButton>
      </div>

      <Tabs defaultValue="informacoes" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Aba: Informações */}
        <TabsContent value="informacoes" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Dados Cadastrais</CardTitle>
              <CardDescription className="text-sm">
                Edite as informações deste dado
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form id="formDado" className="space-y-6" action={updateDadoAction}>
                <input type="hidden" name="id" value={dado.id} />
                <input type="hidden" name="accountId" value={accountId} />
                <input type="hidden" name="usuarioId" value={session?.user?.id ?? ""} />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input id="titulo" name="titulo" defaultValue={dado.titulo} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statusId">Status *</Label>
                    <Select name="statusId" defaultValue={String(dado.statusId)}>
                      <SelectTrigger id="statusId">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusItems.map((status) => (
                          <SelectItem key={status.id} value={String(status.id)}>
                            {status.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    defaultValue={dado.descricao ?? ""}
                    placeholder="Resumo ou breve descrição"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conteudo">Conteúdo Completo</Label>
                  <Textarea
                    id="conteudo"
                    name="conteudo"
                    defaultValue={dado.conteudo ?? ""}
                    placeholder="Texto completo ou detalhes técnicos"
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Criado em</Label>
                    <Input
                      value={new Date(dado.criadoEm).toLocaleString("pt-BR")}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Atualizado em</Label>
                    <Input
                      value={new Date(dado.atualizadoEm).toLocaleString("pt-BR")}
                      disabled
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Histórico de Alterações</CardTitle>
              <CardDescription className="text-sm">
                Registro de todas as modificações deste dado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dado.historico.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col gap-1 border-l-2 border-primary pl-4"
                >
                  <p className="font-medium">{h.acao}</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {h.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.criadoEm).toLocaleString("pt-BR")} —{" "}
                    {h.usuarioAccount?.usuario?.nome ?? "Usuário desconhecido"}
                  </p>
                </div>
              ))}

              {dado.historico.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum histórico registrado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
