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
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { FormSubmitButton } from "@/_components/form-submit-button"

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

  revalidatePath(`/a/${accountId}/dados`)
  redirect(`/a/${accountId}/dados`)
}

export default async function NovoLocalPage({
  params,
}: {
  params: Promise<{ accountId: string }>
}) {
  const { accountId } = await params

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
                    
                      <SelectItem value="1">
                        Ativo
                      </SelectItem>
                      <SelectItem value="2">
                        Arquivado
                      </SelectItem>
                   
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
