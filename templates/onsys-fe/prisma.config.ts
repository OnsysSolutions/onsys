import path from "node:path";
import { config as loadEnv } from "dotenv"; // 👈 importa dotenv
import type { PrismaConfig } from "prisma";

loadEnv();

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  views: {
    path: path.join("prisma", "views"),
  },
  typedSql: {
    path: path.join("prisma", "queries"),
  },
} satisfies PrismaConfig;
