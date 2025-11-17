import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Button } from "@/_components/ui/button"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { Textarea } from "@/_components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select"
import { ArrowLeft, Mail, UserPlus, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/_components/ui/alert"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { FormSubmitButton } from "@/_components/form-submit-button"

// ✅ Nova Server Action local
async function handleSendInvite(formData: FormData) {
  "use server"

  const email = formData.get("email") as string
  const role = formData.get("role") as string
  const mensagem = formData.get("mensagem") as string
  const accountId = formData.get("accountId") as string

  console.log("[Server Action] Enviando convite:", { email, role, mensagem })

  // Opcional: revalida a página após enviar
  revalidatePath("/")
}

export default async function ConvidarUsuarioPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/a/${accountId}/usuarios`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convidar Usuário</h1>
          <p className="text-muted-foreground">Envie um convite para um novo usuário participar da conta</p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          O usuário receberá um email com um link para aceitar o convite e criar sua conta na plataforma. O convite
          expira em 7 dias.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Convite</CardTitle>
              <CardDescription>Preencha os dados para enviar o convite</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ✅ Formulário Server Action */}
              <form action={handleSendInvite} className="space-y-6">
                <input type="hidden" name="accountId" value={accountId} />

                <div className="space-y-2">
                  <Label htmlFor="email">Email do Usuário *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="usuario@exemplo.com"
                      required
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    O convite será enviado para este endereço de email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de Usuário *</Label>
                  <Select name="role" defaultValue="2" required>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                           Admin
                          </SelectItem>
                          <SelectItem value="2">
                           Editor
                          </SelectItem>
                          <SelectItem value="2">
                        Convidado
                          </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-y-2 rounded-lg border bg-muted/50 p-3 text-sm">
                    <p className="font-medium">Permissões por tipo:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>
                        <strong>Administrador:</strong> Acesso completo ao sistema, incluindo configurações e
                        gerenciamento de usuários
                      </li>
                      <li>
                        <strong>Editor:</strong> Pode criar, editar e visualizar todos os registros do arquivo
                      </li>
                      <li>
                        <strong>Visitante:</strong> Pode apenas visualizar registros e realizar consultas
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem Personalizada (Opcional)</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    placeholder="Adicione uma mensagem personalizada ao convite..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Esta mensagem será incluída no email de convite
                  </p>
                </div>

                <div className="flex gap-3">
                  <FormSubmitButton>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Enviar Convite
                  </FormSubmitButton>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/a/${accountId}/usuarios`}>Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Envio do Convite</p>
                    <p className="text-muted-foreground">
                      Um email será enviado para o endereço informado com um link único
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Aceitação</p>
                    <p className="text-muted-foreground">
                      O usuário clica no link e cria sua conta na plataforma
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Acesso Liberado</p>
                    <p className="text-muted-foreground">
                      Após criar a conta, o usuário terá acesso imediato ao sistema
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Convites expiram após 7 dias</p>
              <p>• Você pode reenviar convites pendentes</p>
              <p>• O usuário pode usar qualquer provedor de autenticação (Google, email/senha)</p>
              <p>• Você pode alterar as permissões do usuário após ele aceitar o convite</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
