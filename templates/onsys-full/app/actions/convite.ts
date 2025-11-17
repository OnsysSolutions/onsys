"use server";

import { prisma } from "@/_lib/prisma";

/**
 * Retorna todos os convites válidos de uma conta específica.
 * Convite é considerado válido se:
 *  - Ainda não foi aceito (aceito = false)
 *  - Não expirou (expiracao > agora OU expiracao é null)
 */
export async function getAllValidConvites(accountId: number) {
  const now = new Date();

  return await prisma.convite.findMany({
    where: {
      accountId,
      aceito: false,
      tipoStatusid: 1,
      OR: [
        { expiracao: null },
        { expiracao: { gt: now } }, // gt = greater than (maior que)
      ],
    },
    orderBy: { criadoEm: "desc" }, // opcional: mais recentes primeiro
    include: {
      tipoUsuario: true,
      criadoPor: true,
      usuario: true,
    },
  });
}

export async function getConviteByToken(token: string) {
    return await prisma.convite.findUnique({
        where: {
            token,
            tipoStatusid: 1,
            aceito: false
        }
    })
}

export async function recusarConvite(token: string) {
  try {
    if (!token) {
      throw new Error("Token não fornecido")
    }

    // Atualiza o convite com status 'recusado' (tipoStatusId = 3)
    const convite = await prisma.convite.update({
      where: { token },
      data: {
        tipoStatusid: 3, // ✅ ajuste para o nome correto do campo
        aceito: false,
      },
      include: {
        criadoPor: true,
        tipoUsuario: true,
        account: true,
      },
    })

    return {
      success: true,
      convite,
    }
  } catch (err: any) {
    console.error("[recusarConvite] Erro:", err)

    return {
      success: false,
      error:
        err?.message ||
        "Erro interno ao tentar recusar o convite.",
    }
  }
}