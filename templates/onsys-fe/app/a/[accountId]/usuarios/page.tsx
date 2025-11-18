import UsuariosHeader from "./UsuariosHeader";
import UsuariosStats from "./UsuariosStats";
import UsuariosTable from "./UsuariosTable";

export default async function UsuariosPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ page?: string; role?: string }>;
}) {
  const { accountId } = await params;
  const { page: paramsPage, role: paramsRole } = await searchParams;

  const page = Number(paramsPage) || 1;
  const role = paramsRole || "todos";

  const users = [
    { id: 1, nome: "Administrador", email: "admin@teste.com", role: "admin" },
    { id: 2, nome: "Maria Silva", email: "maria@teste.com", role: "editor" },
    { id: 3, nome: "João Pedro", email: "joao@teste.com", role: "viewer" },
    {
      id: 4,
      nome: "Fernanda Lima",
      email: "fernanda@teste.com",
      role: "editor",
    },
  ];

  const _convitesPendentes = [
    {
      id: 101,
      email: "novo.usuario@teste.com",
      role: "viewer",
      enviadoEm: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  ];

  const total = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalEditores = users.filter((u) => u.role === "editor").length;
  const totalVisitantes = users.filter((u) => u.role === "viewer").length;

  const totalPages = 1;

  const stats = [
    { label: "Total de Usuários", value: total },
    { label: "Administradores", value: totalAdmins },
    { label: "Editores", value: totalEditores },
    { label: "Visitantes", value: totalVisitantes },
  ];

  return (
    <div className="grid grid-cols-1 space-y-6">
      <UsuariosHeader accountId={Number(accountId)} />
      <UsuariosStats stats={stats} />

      <UsuariosTable
        users={users}
        totalPages={totalPages}
        currentPage={page}
        role={role}
        accountId={Number(accountId)}
      />
    </div>
  );
}
