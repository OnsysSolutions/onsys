import { prisma } from "@/_lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const token = url.searchParams.get("token")

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido na URL" }), { status: 400 })
    }

    const convite = await prisma.convite.findUnique({
      where: { token },
      include: {
        criadoPor: true,
        tipoUsuario: true,
        account: true,
      },
    })

    if (!convite) {
      return new Response(JSON.stringify({ error: "Convite não encontrado" }), { status: 404 })
    }

    return new Response(JSON.stringify(convite), { status: 200 })
  } catch (err: any) {
    console.error("Erro ao buscar convite:", err)

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
