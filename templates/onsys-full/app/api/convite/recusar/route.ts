import { prisma } from "@/_lib/prisma"

export async function POST(request: Request) {
  try {
    // Lê o corpo JSON enviado pelo cliente
    const body = await request.json()
    const { token } = body

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token não fornecido no corpo da requisição" }),
        { status: 400 }
      )
    }

    // Atualiza o convite com status recusado (ex: tipoStatusId = 3)
    const convite = await prisma.convite.update({
      where: { token },
      data: {
        tipoStatusid: 3, // <- confirme o nome do campo correto no schema
        aceito: false,
      },
      include: {
        criadoPor: true,
        tipoUsuario: true,
        account: true,
      },
    })

    return new Response(JSON.stringify(convite), { status: 200 })
  } catch (err: any) {
    console.error("Erro ao atualizar convite:", err)

    if (err?.code) {
      return new Response(
        JSON.stringify({ error: "Erro de banco de dados", details: err.message }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ error: "Erro interno do servidor", details: err?.message ?? null }),
      { status: 500 }
    )
  }
}
