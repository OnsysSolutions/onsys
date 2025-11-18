import { Shield, UserCheck, Users } from "lucide-react";
import type { JSX } from "react";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { prisma } from "@/_lib/prisma";

const icons: Record<string, JSX.Element> = {
  tipoStatus: <Shield className="h-5 w-5 text-blue-500" />,
  tipoUsuario: <Users className="h-5 w-5 text-emerald-500" />,
  tipoUsuarioAccount: <UserCheck className="h-5 w-5 text-amber-500" />,
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    tipo?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, tipo, page: p } = await searchParams;
  const query = q || "";
  const tipoFiltro = tipo || "all";
  const page = Number(p || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  // Faz a busca em cada tabela, dependendo do filtro
  const busca = async () => {
    const where = {
      OR: [{ nome: { contains: query } }, { descricao: { contains: query } }],
    };

    if (tipoFiltro === "tipoStatus") {
      const items = await prisma.tipoStatus.findMany({
        where,
        select: { id: true, nome: true, descricao: true },
      });
      return items.map((i) => ({
        id: i.id,
        nome: i.nome,
        descricao: i.descricao,
        tipo: "tipoStatus",
      }));
    }

    if (tipoFiltro === "tipoUsuario") {
      const items = await prisma.tipoUsuario.findMany({
        where,
        select: { id: true, nome: true, descricao: true },
      });
      return items.map((i) => ({
        id: i.id,
        nome: i.nome,
        descricao: i.descricao,
        tipo: "tipoUsuario",
      }));
    }

    if (tipoFiltro === "tipoUsuarioAccount") {
      const items = await prisma.tipoUsuarioAccount.findMany({
        where,
        select: { id: true, nome: true, descricao: true },
      });
      return items.map((i) => ({
        id: i.id,
        nome: i.nome,
        descricao: i.descricao,
        tipo: "tipoUsuarioAccount",
      }));
    }

    // Se nenhum filtro for aplicado, traz de todos
    const [status, usuarios, usuariosAcc] = await Promise.all([
      prisma.tipoStatus.findMany({
        where,
        select: { id: true, nome: true, descricao: true },
      }),
      prisma.tipoUsuario.findMany({
        where,
        select: { id: true, nome: true, descricao: true },
      }),
      prisma.tipoUsuarioAccount.findMany({
        where,
        select: { id: true, nome: true, descricao: true },
      }),
    ]);

    return [
      ...status.map((i) => ({
        id: i.id,
        nome: i.nome,
        descricao: i.descricao,
        tipo: "tipoStatus",
      })),
      ...usuarios.map((i) => ({
        id: i.id,
        nome: i.nome,
        descricao: i.descricao,
        tipo: "tipoUsuario",
      })),
      ...usuariosAcc.map((i) => ({
        id: i.id,
        nome: i.nome,
        descricao: i.descricao,
        tipo: "tipoUsuarioAccount",
      })),
    ];
  };

  const resultados = await busca();

  const total = resultados.length;
  const paginated = resultados.slice(skip, skip + limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Tipos Cadastrados</h1>
        </div>

        <div className="flex gap-4">
          <Select value={tipoFiltro}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Tipo de registro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="tipoStatus">TipoStatus</SelectItem>
              <SelectItem value="tipoUsuario">TipoUsuario</SelectItem>
              <SelectItem value="tipoUsuarioAccount">
                TipoUsuarioAccount
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3">
        {paginated.map((item) => (
          <Card
            key={`${item.tipo}-${item.id}`}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="flex items-center gap-4 py-4">
              {icons[item.tipo]}
              <div className="flex-1">
                <p className="font-medium text-base hover:underline flex items-center gap-2">
                  {item.nome}
                  <Badge className="bg-muted text-muted-foreground capitalize">
                    {item.tipo}
                  </Badge>
                </p>

                {item.descricao && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.descricao}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {total === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Nenhum tipo encontrado.
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6">
          <Button variant="outline" size="sm" disabled={page <= 1}>
            Anterior
          </Button>
          <span className="text-sm">
            Página {page} de {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages}>
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
