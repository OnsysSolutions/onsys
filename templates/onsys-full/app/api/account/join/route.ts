// app/api/account/join/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import {prisma} from "@/_lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const usuarioId = parseInt(session.user.id)
  const { token } = await req.json()

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 })
  }

  // Busca convite válido
  const convite = await prisma.convite.findFirst({
    where: {
      token,
      aceito: false,
      expiracao: { gte: new Date() }, // só convites não expirados
    },
    include: { account: true },
  })

  if (!convite) {
    return NextResponse.json({ error: "Convite inválido ou expirado" }, { status: 404 })
  }

  // Verifica se usuário já está vinculado à conta
  const existing = await prisma.usuarioAccount.findUnique({
    where: {
      usuarioId_accountId: {
        usuarioId,
        accountId: convite.accountId,
      },
    },
  })
  if (existing) {
    return NextResponse.json({ error: "Você já tem acesso a esta conta" }, { status: 400 })
  }

  // Cria vínculo usuário → account
  await prisma.usuarioAccount.create({
    data: {
      usuarioId,
      accountId: convite.accountId,
      tipoUsuarioAccountId: convite.tipoUsuarioId,
      podeCriar: false,
      podeEditar: false,
      podeDeletar: false,
      podeConvidar: false,
      podeArquivar: false,
    },
  })

  // Marca convite como aceito e associa ao usuário
  await prisma.convite.update({
    where: { id: convite.id },
    data: {
      aceito: true,
      usuarioId,
    },
  })

  return NextResponse.json({
    success: true,
    accountId: convite.account.id,
  })
}
