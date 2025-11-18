"use client";

import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import DataTable from "@/_components/DataTable";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";

export default function DadosTable({
  dadosList,
  accountId,
}: {
  dadosList: any[];
  accountId: string;
}) {
  const columns = [
    {
      key: "titulo",
      label: "Título",
      render: (item: any) => <span className="font-medium">{item.titulo}</span>,
    },
    {
      key: "descricao",
      label: "Descrição",
      render: (item: any) => item.descricao || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.status.nome === "Ativo" ? "default" : "secondary"}>
          {item.status.nome}
        </Badge>
      ),
    },
  ];

  const renderActions = (item: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/a/${accountId}/dados/${item.id}`}>Ver/Editar</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Arquivar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DataTable columns={columns} data={dadosList} actions={renderActions} />
  );
}
