"use client";

import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";
import UsuariosPagination from "./UsuariosPagination";
import UsuariosTableRow from "./UsuariosTableRow";

export default function UsuariosTable({
  users,
  accountId,
  totalPages,
  currentPage,
  role,
}: {
  users: any[];
  accountId: number;
  totalPages: number;
  currentPage: number;
  role: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const handleRoleChange = (value: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set("role", value);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", page.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <div>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              Todos os usuários cadastrados nesta conta
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-9 w-full text-sm"
              />
            </div>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Visitante">Visitante</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-full overflow-x-auto">
        <Table className="min-w-[700px] border-separate border-spacing-y-1">
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-muted-foreground p-4"
                >
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UsuariosTableRow
                  key={u.id}
                  userAccount={u}
                  accountId={accountId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <UsuariosPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}
