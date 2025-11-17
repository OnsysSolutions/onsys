import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

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

  const accountId = Number(acId)

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
