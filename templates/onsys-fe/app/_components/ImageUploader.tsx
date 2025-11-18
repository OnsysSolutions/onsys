"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

// --------------- MOCK DO UPLOAD ---------------
async function mockUpload(relativePath: string, _file: File) {
  return new Promise<{ success: boolean; url: string; path: string }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          url: `https://cdn.mock.com/${relativePath}`,
          path: relativePath,
        });
      }, 1200); // simula atraso do upload
    },
  );
}
// ------------------------------------------------

export default function ImageUploaderMock({ userId }: { userId: string }) {
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

      // 🔥 usa mock em vez da função real de upload
      const res = await mockUpload(relativePath, file);

      if (res.success) {
        setUploadedUrl(res.url);

        toast.success(
          <div className="flex flex-col gap-1">
            <span>Arquivo enviado (mock) com sucesso!</span>
            <span className="text-xs text-gray-600 break-all">{res.path}</span>
            <a
              href={res.url}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              Abrir imagem mock
            </a>
          </div>,
        );
      }
    } catch (_err: unknown) {
      toast.error("Erro no mock de upload");
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

      {loading && <p className="text-blue-500">Simulando upload...</p>}

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg border"
          width={128}
          height={128}
        />
      )}

      {uploadedUrl && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-green-600">Imagem mock hospedada!</p>
          <a
            href={uploadedUrl}
            target="_blank"
            className="text-blue-600 underline mt-1"
          >
            Ver imagem mock
          </a>
        </div>
      )}
    </div>
  );
}
