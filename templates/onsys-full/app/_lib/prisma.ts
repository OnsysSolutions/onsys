import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// ✅ Singleton seguro + compatível com Vercel + Supabase Pooler
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],

    // 🔒 Importante para PgBouncer (modo pooler)
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
