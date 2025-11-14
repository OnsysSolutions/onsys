"use server"

import { prisma } from "@/_lib/prisma";

export async function getUserAccounts(usuarioId: number) {
  return prisma.usuarioAccount.findMany({
    where: { usuarioId },
    include: {
      account: true,
    },
  })
}

export async function getUserAccountByUserIdAndAccountId(usuarioId: number, accountId: number) {
  return prisma.usuarioAccount.findFirst({
    where: { usuarioId, accountId },
    include: {
      account: true,
      tipoUsuarioAccount: true,
      usuario: true
    },
  })
}

export async function getAllUsersAccountsFromAccountId(accountId: number) {
  return prisma.usuarioAccount.findMany({
    where: { accountId },
    include: {
      account: true,
      tipoUsuarioAccount: true,
      usuario: true
    }
  })
}
