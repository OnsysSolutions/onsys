"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/_components/ui/button"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/_components/ui/card"
import { Checkbox } from "@/_components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Separator } from "./ui/separator"
import FeitoPor from "./feito-por"
import OnsysIcon from "./icons/onsys"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/a",
      remember: rememberMe,

    })

    setLoading(false)

    if (res?.error) {
      toast.error("Email ou senha inválidos")
      return
    }

    toast.success("Login realizado com sucesso!")
    router.push(res?.url || "/a")
  }

  return (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Lembrar de mim
            </label>
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div>
          <OnsysIcon className="w-6 h-fit mx-auto"/>
<Separator className="my-4" />
<FeitoPor/>
        </div>
      </CardFooter>
    </Card>
  )
}
