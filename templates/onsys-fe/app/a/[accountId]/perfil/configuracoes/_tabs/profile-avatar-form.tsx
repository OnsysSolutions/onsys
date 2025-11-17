'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Upload, X } from "lucide-react";

interface ProfileAvatarFormProps {
  initialAvatarUrl?: string;
}

export default function ProfileAvatarForm({ initialAvatarUrl }: ProfileAvatarFormProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Para preview
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Pega a URL completa do avatar via API
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch("/api/avatar");
        if (!res.ok) throw new Error("Erro ao buscar avatar");
        const data = await res.json();
        setAvatarUrl(data.url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvatar();
  }, []);

  const handleFileChange = () => {
    if (!inputFileRef.current?.files?.[0]) return;

    const file = inputFileRef.current.files[0];
    const objectUrl = URL.createObjectURL(file); // preview
    setPreviewUrl(objectUrl);
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = inputFileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Falha no upload da imagem.");

      const result = await response.json(); // { url: "..." }
      setAvatarUrl(result.url); // substitui a imagem
      setPreviewUrl(null); // limpa preview
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex items-center gap-6">
      {loading ? (
        <div className="h-24 w-24 rounded-full bg-gray-300 animate-pulse" />
      ) : (
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl ?? avatarUrl} />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      )}

      <div className="space-y-2">
        <Input
          type="file"
          ref={inputFileRef}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          id="avatar-upload"
          onChange={handleFileChange}
        />

        <Label htmlFor="avatar-upload">
          <Button
            type="button"
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={previewUrl ? handleCancel : () => inputFileRef.current?.click()}
            disabled={uploading}
          >
            {previewUrl ? <X/> : <Upload className="h-4 w-4" />}
            {previewUrl ? "Cancelar Alteração" : uploading ? "Enviando..." : "Alterar Foto"}
          </Button>
        </Label>

        <Button type="submit" disabled={uploading || !previewUrl}>
          {uploading ? "Salvando..." : "Salvar Imagem"}
        </Button>

        <p className="text-sm text-muted-foreground">JPG, PNG ou WEBP. Máx. 2MB.</p>
      </div>
    </form>
  );
}
