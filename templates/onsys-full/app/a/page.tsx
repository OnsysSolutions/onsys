import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import {prisma} from "@/_lib/prisma"
import CreateOrJoinAccount from "@/_components/create-or-join-account"

export default async function DashboardBasePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/")

  const usuarioId = parseInt(session.user.id)
  const userAccount = await prisma.usuarioAccount.findFirst({
    where: { usuarioId },
    include: { account: true },
    orderBy: { criadoEm: "asc" },
  })

  if (userAccount) {
    redirect(`/a/${userAccount.account.id}`)
  }

  return <CreateOrJoinAccount />
}
