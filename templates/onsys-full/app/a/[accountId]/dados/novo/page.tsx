import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Button } from "@/_components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select"
import { Textarea } from "@/_components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { FormSubmitButton } from "@/_components/form-submit-button"

// ==========================================
// Server Action
// ==========================================
async function createLocalAction(formData: FormData) {
  "use server"

  const accountId = Number(formData.get("accountId"))
  const titulo = String(formData.get("titulo"))
  const descricao = String(formData.get("descricao"))
  const statusId = Number(formData.get("statusId"))
  const conteudo = String(formData.get("conteudo") || "")
  const usuarioId = Number(formData.get("usuarioId"))

  if (!titulo || !descricao || !accountId || !conteudo) {
    throw new Error("Campos obrigatórios ausentes")
  }

  const dado = await prisma.dados.create({
    data: {
      titulo,
      descricao,
      conteudo,
      accountId,
      statusId,
    },
  })

  // Registra a ação no histórico
  await prisma.historico.create({
    data: {
      usuarioAccountUsuarioId: usuarioId,
      accountId,
      dadoId: dado.id,
      acao: "CRIADO",
      descricao: `Dado ${dado.titulo} criado com sucesso`,
    },
  })

  revalidatePath(`/a/${accountId}/dados`)
  redirect(`/a/${accountId}/dados`)
}

// ==========================================
// Página
// ==========================================
export default async function NovoLocalPage({
  params,
}: {
  params: Promise<{ accountId: string }>
}) {
  const { accountId } = await params

  const statusItems = await prisma.tipoStatus.findMany()

  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/a/${accountId}/dados`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Dado</h1>
          <p className="text-muted-foreground">Cadastre um novo dado</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Local</CardTitle>
          <CardDescription>Preencha os dados do novo dado</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createLocalAction} className="space-y-6">
            <input type="hidden" name="accountId" value={accountId} />
            <input type="hidden" name="usuarioId" value={session?.user?.id ?? ""} />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Título *</Label>
                <Input id="nome" name="titulo" placeholder="Ex: Arquivo Central" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusId">Status *</Label>
                <Select name="statusId" defaultValue="1">
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
            
             <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="cidade">Descrição</Label>
                <Input id="cidade" name="descricao" placeholder="Ex: Detalhamento resumido" required />
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Conteúdo Completo *</Label>
              <Textarea
                id="endereco"
                name="conteudo"
                placeholder="Rua, número, complemento, bairro..."
                rows={3}
                required
              />
            </div>

           

            <div className="flex justify-end gap-4">
              <Link href={`/a/${accountId}/dados`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <FormSubmitButton>Salvar Dado</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
