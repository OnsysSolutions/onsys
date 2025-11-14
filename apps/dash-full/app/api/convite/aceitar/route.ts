import { prisma } from "@/_lib/prisma"
import { Convite } from "@prisma/client"
import { getServerSession } from "next-auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    // 📌 Lê o corpo JSON enviado pelo cliente
    const body = await request.json()
    const { convite } = body as { convite: Convite }

    // 🛑 Validação: sessão inexistente
    if (!session || !session.user?.email) {
      return new Response(
        JSON.stringify({
          error_code: "unauthorized",
          name: "Usuário não autenticado",
          message: "Você precisa estar logado para realizar esta ação.",
        }),
        { status: 401 }
      )
    }

    // 🛑 Validação: corpo inválido
    if (!convite) {
      return new Response(
        JSON.stringify({
          error_code: "missing_invite",
          name: "Convite não fornecido",
          message: "O corpo da requisição deve conter um objeto 'convite'.",
        }),
        { status: 400 }
      )
    }

    // 🛑 Validação: e-mail diferente
    if (session.user.email !== convite.email) {
      return new Response(
        JSON.stringify({
          error_code: "email_mismatch",
          name: "E-mail diferente",
          message:
            "O e-mail da sua conta não corresponde ao e-mail deste convite.",
        }),
        { status: 403 }
      )
    }

    const novoConvite = await prisma.convite.update({
      where: {
        id: convite.id
      },
      data: {
        aceito: true,
        usuarioId: Number(session.user.id)
      },
      include: {
        usuario: true
      }
    })

    const novoUsuarioAccount = await prisma.usuarioAccount.create({
      data: {
        tipoUsuarioAccountId: novoConvite.tipoUsuarioId,
        usuarioId: Number(session.user.id),
        accountId: novoConvite.accountId,
      },
      include: {
        tipoUsuarioAccount: true,
      },
    })


    await prisma.historico.create({
      data: {
        conviteId: convite.id,
        usuarioId: Number(session.user.id),
        acao: "CRIADO",
        descricao: `Usuário ${novoConvite.usuario?.nome} (${session.user.email}) entrou dentro do grupo como ${novoUsuarioAccount.tipoUsuarioAccount.nome}`
      }
    })

    // ✅ Caso todas as verificações passem
    return new Response(JSON.stringify(convite), { status: 200 })



  } catch (err: any) {
    console.error("Erro ao atualizar convite:", err)

    // 🧩 Erros de banco de dados
    if (err?.code) {
      return new Response(
        JSON.stringify({
          error_code: "database_error",
          name: "Erro de Banco de Dados",
          message: err.message,
        }),
        { status: 500 }
      )
    }

    // ⚠️ Erros genéricos
    return new Response(
      JSON.stringify({
        error_code: "internal_error",
        name: "Erro Interno do Servidor",
        message: err?.message ?? "Erro desconhecido.",
      }),
      { status: 500 }
    )
  }
}
