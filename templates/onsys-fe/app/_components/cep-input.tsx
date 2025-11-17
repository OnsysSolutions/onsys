"use client"

import { useState } from "react"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"

export function CEPInput() {
  const [cep, setCep] = useState("")

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
      // Remove tudo que não for número
      .replace(/\D/g, "")
      // Limita a 8 dígitos
      .slice(0, 8)
      // Aplica a máscara 00000-000
      .replace(/(\d{5})(\d{1,3})/, "$1-$2")

    setCep(value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="cep">CEP</Label>
      <Input
        id="cep"
        name="cep"
        placeholder="00000-000"
        value={cep}
        onChange={handleCepChange}
      />
    </div>
  )
}
