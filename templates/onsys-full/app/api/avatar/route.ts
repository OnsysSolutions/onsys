import { NextResponse } from "next/server";
import { prisma } from "@/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { put } from "@/actions/image_upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const session = await getServerSession(authOptions);

    if (!file || !session?.user?.id) {
      return NextResponse.json({ error: "Arquivo ou userId ausente." }, { status: 400 });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const safeFileName = `${timestamp}-${encodeURIComponent(file.name)}`;

    const blob = await put(`onsys-default-project/avatar/${session.user.id}/${filename}`, file);

    await prisma.usuario.update({
      where: { id: Number(session.user.id) },
      data: { image: `avatar/${session.user.id}/${safeFileName}` },
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json({ error: "Falha no upload da imagem." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 });
    }

    const blobBaseUrl = process.env.BLOB_BASE_URL;
    const avatarUrl = `${blobBaseUrl}/${usuario.image}`; 

    return new Response(JSON.stringify({ url: avatarUrl }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao buscar avatar" }), { status: 500 });
  }
}
