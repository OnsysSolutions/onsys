// app/api/usuario/[id]/route.ts
import { prisma } from "@/_lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

const updateUserSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), { status: 401 });
    }

    const id = Number(session.user.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        image: true,
        tipoUsuario: { select: { nome: true } },
      },
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify(usuario), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro interno", details: err.message }), { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id: userId} = await params
    const session = await getServerSession(authOptions);
    if (!session?.user) return new Response(JSON.stringify({ error: "Usuário não autenticado" }), { status: 401 });

    const id = Number(userId);
    if (isNaN(id)) return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });

    const body = await request.json();
    const parseResult = updateUserSchema.safeParse(body); // agora envia direto { nome, email }

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(i => i.message);
      return new Response(JSON.stringify({ error: "Dados inválidos", details: errors }), { status: 400 });
    }

    const { nome, email } = parseResult.data;

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== id) {
      return new Response(JSON.stringify({ error: "Email já cadastrado" }), { status: 409 });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: { nome, email },
      select: { id: true, nome: true, email: true, image: true, tipoUsuario: { select: { nome: true } } },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro interno", details: err.message }), { status: 500 });
  }
}
