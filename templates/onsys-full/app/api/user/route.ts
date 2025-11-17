// app/api/user/[id]/route.ts

import { prisma } from "@/_lib/prisma";
import { formSchemaSignup } from "@/_lib/schemas";
import { authOptions } from "@/auth";
import { Convite, ProviderType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import z from "zod";

/**
 * GET /api/usuario/[id]
 * Retorna os dados do usuário logado.
 */
export async function GET(request: Request) {
  try {
    // Obtém a sessão do usuário
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        { status: 401 }
      );
    }

    const id = Number(session.user.id);

    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: "ID do usuário inválido" }),
        { status: 400 }
      );
    }

    // Busca usuário no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { tipoUsuario: true },
    });

    if (!usuario) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(usuario), { status: 200 });

  } catch (err: any) {
    console.error("Erro ao buscar usuário:", err);

    // Verifica se é um erro do Prisma
    if (err?.code) {
      return new Response(
        JSON.stringify({ error: "Erro de banco de dados", details: err.message }),
        { status: 500 }
      );
    }

    // Erro genérico
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor", details: err?.message ?? null }),
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body) {
      return new Response(
        JSON.stringify({
          error_code: "bad_request",
          name: "Corpo inválido",
          message: "Nenhum dado foi enviado na requisição.",
        }),
        { status: 400 }
      )
    }

    const { convite, signupData } = body as {
      convite?: Convite
      signupData: z.infer<typeof formSchemaSignup>
    }

    // valida os dados do signup via zod
    const parsed = formSchemaSignup.safeParse(signupData)
    if (!parsed.success) {
      const validationErrors = parsed.error.issues.map((issue) => issue.message)

      return new Response(
        JSON.stringify({
          error_code: "validation_error",
          name: "Erro de validação",
          message: validationErrors.join(", "),
        }),
        { status: 400 }
      )
    }

    // checa se email já está cadastrado
    const existingUser = await prisma.usuario.findUnique({
      where: { email: parsed.data.email },
    })
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error_code: "email_already_used",
          name: "Email já cadastrado",
          message: "Este email já está em uso por outro usuário.",
        }),
        { status: 409 } // conflito
      )
    }

    // cria o hash da senha
    const senhaHash = await bcrypt.hash(parsed.data.password, 10)

    // cria o usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome: parsed.data.nome,
        email: parsed.data.email,
        senhaHash,
        identities: {
          create: {
            provider: "EMAIL" as ProviderType,
            providerId: parsed.data.email,
            senhaHash,
          },
        },
      },
    })

    if (convite) {
      try {
        await prisma.usuarioAccount.create({
          data: {
            accountId: Number(convite.accountId),
            usuarioId: usuario.id,
            tipoUsuarioAccountId: Number(convite.tipoUsuarioId),
          },
        })

        await prisma.convite.update({
          where: {
            id: convite.id
          },
          data: {
            aceito: true,
            usuarioId: usuario.id
          }
        })
      } catch (err) {
        console.error("Erro ao vincular usuário ao account:", err)
        return new Response(
          JSON.stringify({
            error_code: "invite_link_error",
            name: "Erro ao vincular convite",
            message:
              "O usuário foi criado, mas não foi possível vinculá-lo ao convite.",
          }),
          { status: 500 }
        )
      }
    }

    // sucesso
    return new Response(JSON.stringify({ usuario }), { status: 201 })
  } catch (err: any) {
    console.error("Erro no endpoint /signup:", err)

    // erro genérico
    return new Response(
      JSON.stringify({
        error_code: "internal_error",
        name: "Erro interno do servidor",
        message:
          err?.message ||
          "Ocorreu um erro inesperado ao processar sua solicitação.",
      }),
      { status: 500 }
    )
  }
}
