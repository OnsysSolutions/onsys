"use server"

import { prisma } from "@/_lib/prisma"
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { get } from "./image_upload";

export async function getUser(id: number) {
    return prisma.usuario.findUnique({
        where: { id },
        include: {
            tipoUsuario: true,
        }
    })
}

export async function updateUser(id: number, data: { nome?: string; email?: string }) {
    return prisma.usuario.update({
        where: { id },
        data: {
            nome: data.nome,
            email: data.email,
        }
    })
}

export async function userAccountRole(accountId: string) {
    const session = await getServerSession(authOptions);

    const userAccount =  await prisma.usuarioAccount.findUnique({
        where: {
            usuarioId_accountId: {
                accountId: Number(accountId),
                usuarioId: Number(session?.user?.id)
            }
        },
        select: {
            tipoUsuarioAccount: true
        }
    })

    return {
        ...userAccount?.tipoUsuarioAccount
    }
}


export async function getUsersPaginated({
  accountId,
  page,
  pageSize,
  role,
}: {
  accountId: number
  page: number
  pageSize: number
  role: string
}) {
  const where: any = {
    accountId,
  }

  if (role !== "todos") {
    where.tipoUsuarioAccount = { nome: role }
  }

  const [users, total] = await Promise.all([
    prisma.usuarioAccount.findMany({
      where,
      include: {
        usuario: true,
        tipoUsuarioAccount: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.usuarioAccount.count({ where }),
  ])

  // 🔥 resolve URL do avatar no servidor
  const usersWithAvatar = await Promise.all(
    users.map(async (u) => {
      const avatarRes = await get(u.usuario.image || "")
      const avatarUrl = "url" in avatarRes ? avatarRes.url : "/placeholder.svg"
      return {
        ...u,
        usuario: {
          ...u.usuario,
          avatarUrl,
        },
      }
    })
  )

  return {
    users: usersWithAvatar,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}