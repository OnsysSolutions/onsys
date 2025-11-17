"use client";

import { useState } from "react";
import { put } from "../actions/image_upload";
import { toast } from "sonner";

export default function ImageUploader({ userId }: { userId: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const relativePath = `avatar/${userId}/${file.name}`;
      const res = await put(relativePath, file);

      if (res.success) {
        setUploadedUrl(res.url);

        toast.success(
          <div className="flex flex-col gap-1">
            <span>Arquivo enviado com sucesso!</span>
            <span className="text-xs text-gray-600 break-all">{res.path}</span>
            <a
              href={res.url}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              Ver imagem
            </a>
          </div>
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Erro ao enviar arquivo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-white shadow-sm">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="cursor-pointer"
      />

      {loading && <p className="text-blue-500">Enviando imagem...</p>}

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg border"
        />
      )}

      {uploadedUrl && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-green-600">Imagem enviada com sucesso!</p>
          <a
            href={uploadedUrl}
            target="_blank"
            className="text-blue-600 underline mt-1"
          >
            Ver imagem hospedada
          </a>
        </div>
      )}
    </div>
  );
}
