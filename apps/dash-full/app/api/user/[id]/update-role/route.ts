import { prisma } from "@/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🚀 [update-role] Iniciando rota de atualização de role...")

  try {
    const session = await getServerSession(authOptions)
    console.log("👤 Sessão atual:", session?.user ?? "Nenhuma sessão encontrada")

    const { id: paramsId } = await params
    const body = await request.json()
    const { role, accountId } = body

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
      })
    }

    const id = Number(paramsId)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), {
        status: 400,
      })
    }

    if (!role || !accountId) {
      return new Response(JSON.stringify({ error: "Role ou AccountId ausente" }), {
        status: 400,
      })
    }

    // 🔍 Busca o tipo de usuário correspondente ao nome informado
    const tipo = await prisma.tipoUsuarioAccount.findUnique({
      where: { nome: role },
    })

    if (!tipo) {
      return new Response(JSON.stringify({ error: "Tipo de usuário inválido" }), {
        status: 400,
      })
    }

    // 🚫 Se o usuário for o último admin, não permitir remover permissão
    const usuarioAtual = await prisma.usuarioAccount.findUnique({
      where: {
        usuarioId_accountId: {
          usuarioId: id,
          accountId: Number(accountId),
        },
      },
      include: { tipoUsuarioAccount: true },
    })

    if (!usuarioAtual) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado na conta" }), {
        status: 404,
      })
    }

    const ehAdminAtual = usuarioAtual.tipoUsuarioAccountId === 1
    const vaiDeixarDeSerAdmin = ehAdminAtual && tipo.id !== 1

    if (vaiDeixarDeSerAdmin) {
      // Verificar quantos admins existem nesta conta
      const totalAdmins = await prisma.usuarioAccount.count({
        where: {
          accountId: Number(accountId),
          tipoUsuarioAccountId: 1, // 1 = admin
        },
      })

      if (totalAdmins <= 1) {
        console.warn("⚠️ Tentativa de remover o último administrador")
        return new Response(
          JSON.stringify({
            error: "Não é possível remover o último administrador desta conta",
          }),
          { status: 403 }
        )
      }
    }

    // ✅ Atualiza o tipo de usuário
    const usuarioAtualizado = await prisma.usuarioAccount.update({
      where: {
        usuarioId_accountId: {
          usuarioId: id,
          accountId: Number(accountId),
        },
      },
      data: {
        tipoUsuarioAccount: {
          connect: { id: tipo.id },
        },
      },
      include: { tipoUsuarioAccount: true },
    })

    console.log("✅ Usuário atualizado com sucesso:", usuarioAtualizado)

    return new Response(JSON.stringify(usuarioAtualizado), { status: 200 })
  } catch (error: any) {
    console.error("🔥 Erro ao atualizar role:", error)
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        details: error?.message ?? null,
      }),
      { status: 500 }
    )
  }
}
