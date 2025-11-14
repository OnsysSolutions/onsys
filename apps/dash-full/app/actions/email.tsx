"use server"

import { resend } from "@/_lib/resend"
import { env, fromEmail as from } from "@/_lib/const"
import VercelInviteUserEmail from "../../react-email-starter/emails/vercel-invite-user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/_lib/prisma"
import crypto from "crypto"

export const sendConviteEmail = async ({
  to,
  subject,
  message,
  accountId,
  tipoUsuarioId,
}: {
  to: string
  subject: string
  message: string | null
  accountId: number
  tipoUsuarioId: number
}) => {
  try {
    if (!to || !subject) {
      throw new Error("Parâmetros obrigatórios ausentes: 'to' e 'subject'")
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error("Usuário não autenticado ou sessão inválida.")
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    })
    if (!account) {
      throw new Error("Usuário não possui conta associada.")
    }

    // 🔍 Verifica se já existe convite ativo (não expirado)
    const conviteExistente = await prisma.convite.findFirst({
      where: {
        email: to,
        accountId,
        OR: [
          {expiracao: { gt: new Date() }},
          {aceito: true}
        ]
      },
      orderBy: { criadoEm: "desc" },
    })

    // 🚫 Bloqueia SOMENTE se o convite ainda estiver ativo E tipoStatusId === 1
    if (conviteExistente && conviteExistente.tipoStatusid === 1) {
      throw new Error(
        `Já existe um convite ativo para este e-mail (${to}) que ainda não expirou.`
      )
    }

    // 🔑 Gera token único
    const token = crypto.randomBytes(24).toString("hex")
    const expiracao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

    // 💾 Cria novo convite
    const convite = await prisma.convite.create({
      data: {
        email: to,
        tipoUsuarioId,
        token,
        criadoPorId: Number(session.user.id),
        accountId: account.id,
        expiracao,
        tipoStatusid: 1, // define status inicial como "ativo"
        mensagem: message
      },
    })

    const inviteLink = `${env.NEXTAUTH_URL}/convite/${convite.token}`

    const response = await resend.emails.send({
      from,
      to,
      subject,
      react: (
        <VercelInviteUserEmail
          invitedByEmail={session.user.email}
          invitedByUsername={session.user.name || "Administrador"}
          inviteFromIp="127.0.0.1"
          inviteFromLocation="Brasil"
          inviteLink={inviteLink}
          teamName={account.nome}
          teamImage={`${process.env.BLOB_BASE_URL}/${account.image}`}
          userImage={`${process.env.BLOB_BASE_URL}/${session.user.image}`}
          username={to.split("@")[0]}
          customMessage={message}
        />
      ),
    })

    if (response.error) {
      throw new Error(response.error.message || "Erro ao enviar o e-mail")
    }

    // 🧾 Histórico
    await prisma.historico.create({
      data: {
        usuarioId: Number(session.user.id),
        conviteId: convite.id,
        acao: "CRIADO",
        descricao: `Convite enviado para ${to}`,
      },
    })

    return {
      success: true,
      messageId: response.data?.id || null,
      message: "Convite enviado e registrado com sucesso.",
    }
  } catch (error: unknown) {
    console.error("[sendConviteEmail] Erro:", error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao tentar enviar o e-mail",
    }
  }
}

export const reenviarConviteEmail = async (conviteId: number) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error("Usuário não autenticado ou sessão inválida.")
    }

    const convite = await prisma.convite.findUnique({
      where: { id: conviteId },
      include: {
        account: true,
        tipoUsuario: true,
      },
    })

    if (!convite) {
      throw new Error("Convite não encontrado.")
    }

    // Gera novo token e nova expiração
    const token = crypto.randomBytes(24).toString("hex")
    const expiracao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

    const conviteAtualizado = await prisma.convite.update({
      where: { id: conviteId },
      data: {
        token,
        expiracao,
        tipoStatusid: 1, // reativa o convite
      },
    })

    const inviteLink = `${env.NEXTAUTH_URL}/convite/${token}`

    // Envia o e-mail novamente
    const response = await resend.emails.send({
      from,
      to: convite.email,
      subject: "Reenvio de Convite - Plataforma",
      react: (
        <VercelInviteUserEmail
          invitedByEmail={session.user.email}
          invitedByUsername={session.user.name || "Administrador"}
          inviteFromIp="127.0.0.1"
          inviteFromLocation="Brasil"
          inviteLink={inviteLink}
          teamName={convite.account.nome}
          teamImage={`${process.env.BLOB_BASE_URL}/${convite.account.image}`}
          userImage={`${process.env.BLOB_BASE_URL}/${session.user.image}`}
          username={convite.email.split("@")[0]}
          customMessage={convite.mensagem}
        />
      ),
    })

    if (response.error) {
      throw new Error(response.error.message || "Erro ao reenviar o e-mail.")
    }

    // Registra no histórico
    await prisma.historico.create({
      data: {
        usuarioId: Number(session.user.id),
        conviteId: convite.id,
        acao: "REENVIADO",
        descricao: `Convite reenviado para ${convite.email}`,
      },
    })

    return {
      success: true,
      messageId: response.data?.id || null,
      message: "Convite reenviado com sucesso.",
    }
  } catch (error: unknown) {
    console.error("[reenviarConviteEmail] Erro:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao tentar reenviar o e-mail.",
    }
  }
}