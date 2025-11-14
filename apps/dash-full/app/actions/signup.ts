"use server"

import bcrypt from "bcryptjs"
import { ProviderType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import {prisma} from "@/_lib/prisma"
import { SignupData } from "@/_lib/types"



export async function signupAction(data: SignupData) {
  try {
    const { nome, email, senha } = data

    if (!nome || !email || !senha) {
      throw new Error("Todos os campos são obrigatórios.")
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    })
    if (existingUser) throw new Error("Este email já está em uso.")

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        tipoUsuarioId: 2,
        identities: {
          create: {
            provider: "EMAIL" as ProviderType,
            providerId: email,
            senhaHash,
          },
        },
      },
    })

    // Opcional: atualizar cache ou redirecionar depois
    revalidatePath("/")

    return {
      success: true,
      message: "Usuário criado com sucesso!",
      usuarioId: usuario.id,
    }
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, message: error.message || "Erro ao criar conta." }
  }
}
