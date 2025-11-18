"use client";

import { Loader2, Save, Shield } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Label } from "@/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Skeleton } from "@/_components/ui/skeleton";

interface TipoUsuarioAccount {
  id: number;
  nome: string;
}

interface RoleSelectProps {
  initialRole?: string;
  tiposUsuariosAccounts: TipoUsuarioAccount[];
  userId?: number;
}

export function RoleSelect({
  initialRole,
  tiposUsuariosAccounts,
  userId,
}: RoleSelectProps) {
  const [role, setRole] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { accountId } = useParams();

  useEffect(() => {
    if (initialRole) setRole(initialRole);
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [initialRole]);

  const handleRoleChange = (value: string) => {
    setRole(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!userId || !role) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/user/${userId}/update-role`, {
          method: "POST",
          body: JSON.stringify({ role, accountId }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const msg = await res.json();
          console.error("Erro ao atualizar role:", msg.error);
          toast.error(`Erro ao atualizar: ${msg.error}`);
          return;
        }

        toast.success("Alterações salvas");
        setHasChanges(false);
      } catch (err) {
        console.error("Erro inesperado:", err);
        toast.error("Erro inesperado");
      }
    });
  };

  // 🦴 Skeleton
  if (loading || !role) {
    return (
      <Card className="space-y-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48 mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  // 💎 Versão normal
  return (
    <Card className="space-y-2 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissões
        </CardTitle>
        <CardDescription>Gerencie o nível de acesso do usuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role">Tipo de Usuário</Label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tiposUsuariosAccounts.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.nome}>
                  {tipo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-muted/50 p-3 text-sm transition-all duration-300">
          <p className="font-medium mb-2">Permissões atuais:</p>
          <ul className="space-y-1 text-muted-foreground">
            {role === "Administrador" && (
              <>
                <li>• Acesso completo ao sistema</li>
                <li>• Gerenciar usuários e convites</li>
                <li>• Configurar a plataforma</li>
                <li>• Criar, editar e excluir registros</li>
              </>
            )}
            {role === "Editor" && (
              <>
                <li>• Criar e editar registros</li>
                <li>• Visualizar todos os dados</li>
                <li>• Mover arquivos e caixas</li>
                <li>• Gerar relatórios</li>
              </>
            )}
            {role === "Visitante" && (
              <>
                <li>• Visualizar registros</li>
                <li>• Realizar consultas</li>
                <li>• Gerar relatórios básicos</li>
              </>
            )}
          </ul>
        </div>

        {hasChanges && (
          <Button
            onClick={handleSave}
            className="w-full transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
