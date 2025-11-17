import EmptyData from "@/_components/empty-data-1";
import { PropsWithChildren } from "react";

export default async function Layout({
  children,
  params,
}: PropsWithChildren & { params: Promise<{ accountId: string }> }) {


  // MOCK de role do usuário
  const userRole = { id: 1, nome: "Administrador" }; // <-- Ajuste aqui

  if (!userRole || userRole.id !== 1) {
    return (
      <EmptyData
        message="Acesso negado"
        description="Você não possui permissão para acessar este conteúdo, entre em contato com sua administração caso acredite que seja um engano."
      />
    );
  }

  return children;
}
