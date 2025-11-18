import Image from "next/image";

type StoredImageProps = {
  path: string; // ex: "avatar/123/foto.png"
};

export default function StoredImage({ path }: StoredImageProps) {
  const publicUrl = `https://api.onsys-solutions.com.br/uploads/${path}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src={publicUrl}
        alt="Imagem armazenada"
        className="w-40 h-40 object-cover rounded-xl border shadow-sm"
      />
      <p className="text-xs text-gray-600 break-all">{publicUrl}</p>
    </div>
  );
}
