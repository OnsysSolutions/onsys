import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import {prisma} from "@/_lib/prisma"

import { DashboardSidebar } from "@/_components/dashboard-sidebar"
import { DashboardHeader } from "@/_components/dashboard-header"
import { SidebarProvider } from "@/_components/ui/sidebar"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ accountId: string }>
}) {
  const session = await getServerSession(authOptions)
  const { accountId: acId } = await params
  if (!session?.user?.id) redirect("/")

  const usuarioId = parseInt(session.user.id)
  const accountId = Number(acId)

  if (!accountId || isNaN(accountId)) redirect("/a")

  const userAccount = await prisma.usuarioAccount.findFirst({
    where: { usuarioId, accountId },
  })

  if (!userAccount) redirect("/a")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar accountId={accountId}/>
        <div className="flex flex-1 flex-col">
          <DashboardHeader accountId={accountId} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
