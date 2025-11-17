"use client"

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/_components/ui/dropdown-menu";
import { reenviarConviteEmail } from "@/actions/email";
import { Convite, TipoUsuario, Usuario } from "@prisma/client";
import { Mail, MoreHorizontal, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function ConvitesEnviados({
  convite,
  dataEnvio,
  accountId,
  handleDecline
}: {
  convite: Convite & { criadoPor: Usuario | null; tipoUsuario: TipoUsuario };
  dataEnvio: string;
  accountId: number;
  handleDecline: (token: string, accountId: number) => Promise<any>;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleReenviar() {
    setLoading("reenviar");
    const id = toast.loading("Reenviando convite...");
    try {
      await reenviarConviteEmail(convite.id);
      toast.success("Convite reenviado com sucesso!", { id });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao reenviar convite.", { id });
    } finally {
      setLoading(null);
    }
  }

  async function handleCancelar() {
    setLoading("cancelar");
    const id = toast.loading("Cancelando convite...");
    try {
      await handleDecline(convite.token, accountId);
      toast.success("Convite cancelado!", { id });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cancelar convite.", { id });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      key={convite.id}
      className="flex items-center justify-between rounded-lg border bg-background p-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-medium">{convite.email}</p>
          <p className="text-sm text-muted-foreground">
            {convite.tipoUsuario.nome} • Enviado por {convite.criadoPor?.nome} • {dataEnvio}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Pendente</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleReenviar}
              disabled={loading === "reenviar"}
            >
              {loading === "reenviar" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Reenviar Convite
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleCancelar}
              disabled={loading === "cancelar"}
              className="text-destructive"
            >
              {loading === "cancelar" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Cancelar Convite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
