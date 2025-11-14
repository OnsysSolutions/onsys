import { prisma } from "@/_lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Senha atual deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new Response(JSON.stringify({ error: "Usuário não autenticado" }), { status: 401 });

    const userId = Number(session.user.id);
    if (isNaN(userId)) return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });

    const body = await request.json();
    const parseResult = changePasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: "Dados inválidos", details: parseResult.error.issues.map(i => i.message) }), { status: 400 });
    }

    const { currentPassword, newPassword } = parseResult.data;

    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 });

    if (!user.senhaHash) return new Response(JSON.stringify({ error: "Usuário não possui senha definida" }), { status: 400 });

    const isMatch = await bcrypt.compare(currentPassword, user.senhaHash);
    if (!isMatch) return new Response(JSON.stringify({ error: "Senha atual incorreta" }), { status: 400 });

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.usuario.update({ where: { id: userId }, data: { senhaHash: newHash } });

    return new Response(JSON.stringify({ message: "Senha alterada com sucesso!" }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro interno", details: err.message }), { status: 500 });
  }
}
