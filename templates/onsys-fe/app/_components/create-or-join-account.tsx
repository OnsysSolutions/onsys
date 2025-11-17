"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWRMutation from "swr/mutation"
import { Button } from "@/_components/ui/button"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Building2, UserPlus, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { signOut } from "next-auth/react"

// Função para criar conta
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

export default function CreateOrJoinAccount() {

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
    router.push(`/a/${data.accountId}`)
  } catch (err: any) {
    toast.error(err.message)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-2xl space-y-10">
        {/* Cabeçalho */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Arquivo Digital</h1>
          <p className="text-gray-600">Crie uma nova conta ou entre com um token de convite para começar</p>
        </div>

        {/* Criar nova conta */}
        <Card>
          <CardHeader>
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
              <Button type="submit" disabled className="w-full">
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

        {/* Logout */}
        <p className="text-center text-sm text-gray-600">
          Deseja sair?{" "}
          <Button onClick={() => signOut({ callbackUrl: "/" })} variant="link" className="text-blue-600">
            Fazer logout
          </Button>
        </p>
      </div>
    </div>
  )
}
