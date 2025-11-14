"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog"
import { Button } from "@/_components/ui/button"
import { ArrowRight, PlusCircle, UserPlus } from "lucide-react"
import CreateOrJoinAccount from "./create-or-join-account"
import useSWRMutation from "swr/mutation"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

async function createAccount(url: string, { arg }: { arg: { nome: string } }) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Erro ao criar conta")
  return data
}

// Função para aceitar convite
async function joinAccount(url: string, { arg }: { arg: { token: string } }) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Erro ao aceitar convite")
  return data
}

export function CreateOrJoinAccountDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({ nome: "", token: "" })

  const { trigger: triggerCreate, isMutating: isCreating } = useSWRMutation("/api/account", createAccount)
  const { trigger: triggerJoin, isMutating: isJoining } = useSWRMutation("/api/account/join", joinAccount)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome.trim()) return toast.error("O nome da conta é obrigatório")

    try {
      const data = await triggerCreate({ nome: formData.nome })
      toast.success(`Conta "${formData.nome}" criada com sucesso!`)
      setOpen(false) // 👈 fecha o modal se foi passado
      router.push(`/a/${data.accountId}`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.token.trim()) return toast.error("O token de convite é obrigatório")

    try {
      const data = await triggerJoin({ token: formData.token })
      toast.success("Convite aceito com sucesso!")
      setOpen(false) // 👈 idem aqui
      router.push(`/a/${data.accountId}`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }


  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-xs"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        Criar ou Entrar em Conta
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle>Criar ou Entrar em Conta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader >
                <CardTitle>Criar nova conta</CardTitle>
                <CardDescription>Inicie uma nova organização no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Conta</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Minha Empresa Ltda"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      disabled
                    />
                  </div>
                  <Button type="submit" disabled={true} className="w-full">
                    {isCreating ? "Criando..." : "Criar Conta"}
                    {!isCreating && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Entrar por convite */}
            <Card>
              <CardHeader>
                <CardTitle>Entrar por Convite</CardTitle>
                <CardDescription>Use um token de convite para acessar uma conta existente</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Token de Convite</Label>
                    <Input
                      id="token"
                      placeholder="Cole o token de convite aqui"
                      value={formData.token}
                      onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" variant="secondary" disabled={isJoining} className="w-full">
                    {isJoining ? "Entrando..." : "Entrar com Token"}
                    {!isJoining && <UserPlus className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
