import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import {prisma} from "@/_lib/prisma";
import { UserAccountsDashboard } from "@/_lib/types";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const usuarioId = parseInt(session.user.id);

  const contas = await prisma.usuarioAccount.findMany({
    where: { usuarioId },
    include: { account: true },
  });

  const userAccounts: UserAccountsDashboard[] = contas.map((ua) => ({
    id: ua.account.id,
    name: ua.account.nome,
    initials: ua.account.nome
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase(),
  }));

  return NextResponse.json(userAccounts);
}
