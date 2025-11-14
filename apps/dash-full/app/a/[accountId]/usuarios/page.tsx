import { getAllValidConvites, recusarConvite } from "@/actions/convite"
import { revalidatePath } from "next/cache"

import UsuariosHeader from "./UsuariosHeader"
import UsuariosStats from "./UsuariosStats"
import ConvitesPendentes from "./ConvitesPendentes"
import UsuariosTable from "./UsuariosTable"
import { getUsersPaginated } from "@/actions/user"
import { prisma } from "@/_lib/prisma"

export default async function UsuariosPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>
  searchParams: Promise<{ page?: string; role?: string }>
}) {
  const { accountId } = await params
  const { page: paramsPage, role: paramsRole } = await searchParams
  const page = Number(paramsPage) || 1
  const role = paramsRole || "todos"

  const { users, totalPages } = await getUsersPaginated({
    accountId: Number(accountId),
    page,
    pageSize: 10,
    role,
  })

  const [convitesPendentes, total, totalAdmins, totalEditores, totalVisitantes] = await Promise.all([
    await getAllValidConvites(Number(accountId)),
     await prisma.usuarioAccount.count({
      where: {
        accountId: Number(accountId),
      }
    }),
    await prisma.usuarioAccount.count({
      where: {
        accountId: Number(accountId),
        tipoUsuarioAccountId: 1
      }
    }),
    await prisma.usuarioAccount.count({
      where: {
        accountId: Number(accountId),
        tipoUsuarioAccountId: 2
      }
    }),
    await prisma.usuarioAccount.count({
      where: {  
        accountId: Number(accountId),
        tipoUsuarioAccountId: 3
      }
    }),
  ])

  const handleDecline = async (token: string, accountId: number) => {
    "use server"
    const result = await recusarConvite(token)
    if (result.success) revalidatePath(`/a/${accountId}/usuarios`)
    return result
  }

  const stats = [
    { label: "Total de Usuários", value: total },
    { label: "Administradores", value: totalAdmins },
    { label: "Editores", value: totalEditores },
    { label: "Visitantes", value: totalVisitantes },
  ]

  return (
    <div className="grid grid-cols-1 space-y-6">
      <UsuariosHeader accountId={Number(accountId)} />
      <UsuariosStats stats={stats} />
      {convitesPendentes.length > 0 && (
        <ConvitesPendentes
          convites={convitesPendentes}
          accountId={Number(accountId)}
          handleDecline={handleDecline}
        />
      )}
      <UsuariosTable
        users={users}
        totalPages={totalPages}
        currentPage={page}
        role={role}
        accountId={Number(accountId)}
      />
    </div>
  )
}
