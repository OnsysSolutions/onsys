import EmptyData from "@/_components/empty-data-1";
import { userAccountRole } from "@/actions/user";
import { PropsWithChildren } from "react";

export default async function Layout({
  children,
  params,
}: PropsWithChildren & { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;

  const userRole = await userAccountRole(accountId);

  if (!userRole || userRole.id !== 1) {
    return <EmptyData message="Acesso negado" description="Você não possui permissão para acessar este conteúdo, entre em contato com sua administração caso acredite que seja um engano." />;
  }

  return children;
}
