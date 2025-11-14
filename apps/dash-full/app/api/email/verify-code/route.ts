// pages/api/email/verify-code.ts
import { prisma } from "@/_lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, codigo } = await request.json()

    if (!email || !codigo) {
      return new Response(
        JSON.stringify({ error: "Email e código são obrigatórios" }),
        { status: 400 }
      )
    }

    // Busca verificação ativa no banco
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        codigo,
        expiracao: {
          gt: new Date(), // ainda não expirou
        },
      },
    })

    if (!verification) {
      return new Response(
        JSON.stringify({ error: "Código inválido ou expirado" }),
        { status: 400 }
      )
    }

    // Opcional: apagar o código usado
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: {
        verificado: true,
        usadoEm: new Date()
      }
    })

    return new Response(
      JSON.stringify({ message: "Código verificado com sucesso" }),
      { status: 200 }
    )
  } catch (err: any) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: err.message || "Erro ao verificar código" }),
      { status: 500 }
    )
  }
}
