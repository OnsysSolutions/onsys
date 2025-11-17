import { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/")
  }

  return <>{children}</>
}
