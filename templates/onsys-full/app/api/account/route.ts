import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/_lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const usuarioId = parseInt(session.user.id)

    // Pega o corpo da requisição
    const body = await req.json()
    const { nome } = body

    if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
      return NextResponse.json(
        { error: "Nome da conta inválido" },
        { status: 400 }
      )
    }

    // 🔍 Verifica se já existe uma conta com esse nome
    const existing = await prisma.account.findUnique({
      where: { nome },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma conta com esse nome." },
        { status: 400 }
      )
    }

    // 🏗️ Cria a nova conta
    const newAccount = await prisma.account.create({
      data: {
        nome,
        statusId: 1,
        usuarios: {
          create: {
            usuarioId,
            tipoUsuarioAccountId: 1,       // papel principal
            podeCriar: true,
            podeEditar: true,
            podeDeletar: true,
            podeConvidar: true,
            podeArquivar: true,
          },
        },

      },
    })

    return NextResponse.json(
      { success: true, accountId: newAccount.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar conta:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}


