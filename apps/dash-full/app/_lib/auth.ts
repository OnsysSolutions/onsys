// lib/auth.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import {prisma} from "./prisma"

export async function getCurrentUser(req?: any, res?: any) {
  // req/res são opcionais, úteis no getServerSideProps
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) return null

  const usuario = await prisma.usuario.findUnique({
    where: { id: parseInt(session.user.id) },
  })

  return usuario
}
