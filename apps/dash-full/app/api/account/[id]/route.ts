import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/_lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const accountId = Number(id)
    if (isNaN(accountId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // 🔍 Busca a conta pelo ID, incluindo informações relacionadas
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        status: true, // inclui dados da tabela status
        usuarios: {
          include: {
            usuario: true,
            tipoUsuarioAccount: true,
          },
        },
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(account, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar conta:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
