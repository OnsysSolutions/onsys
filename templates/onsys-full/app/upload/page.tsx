import ImageUploader from "@/_components/ImageUploader";
import StoredImage from "@/_components/StoredImage";

export default async function UploadPage() {
  // Isso normalmente viria da sessão (ex: session.user.id)
  const userId = "123";

  // Exemplo de imagem já salva
  const storedImagePath = `avatar/${userId}/Frame_1__4_.png`;

  return (
    <main className="max-w-md mx-auto p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Upload e Visualização de Imagem
      </h1>

      <ImageUploader userId={userId} />

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-medium mb-2 text-gray-700">
          Imagem armazenada no servidor:
        </h2>
        <StoredImage path={storedImagePath} />
      </div>
    </main>
  );
}
