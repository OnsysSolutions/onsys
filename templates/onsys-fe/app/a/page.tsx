import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import CreateOrJoinAccount from "@/_components/create-or-join-account"

export default async function DashboardBasePage() {
  const session = await getServerSession(authOptions)

  console.log(session)

  if (!session?.user?.id) redirect("/")

  redirect("/a/1")

  return <CreateOrJoinAccount />
}
