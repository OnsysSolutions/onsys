"use server"

import { prisma } from "@/_lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export type UploadResponse = {
    success: boolean;
    url: string;
    path: string;
};

export async function put(relativePath: string, file: File): Promise<UploadResponse> {
    const form = new FormData();
    form.append("file", file, file.name);
    form.append("path", relativePath);

    try {
        const res = await fetch(process.env.ONSYS_API_URL as string, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            },
            body: form,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || `Erro desconhecido (${res.status})`);
        }

        return data as UploadResponse;
    } catch (err: any) {
        throw new Error(err.message || "Falha ao enviar arquivo");
    }
}

export async function get(relativePath: string): Promise<{ url: string } | { error: string }> {
    try {
        if (!relativePath) {
            return { error: "Usuário não possui avatar" }
        }

        const avatarUrl = `${process.env.BLOB_BASE_URL}/${relativePath}`

        return { url: avatarUrl }
    } catch (err) {
        console.error("Erro em get:", err)
        return { error: "Erro ao buscar arquivo" }
    }
}