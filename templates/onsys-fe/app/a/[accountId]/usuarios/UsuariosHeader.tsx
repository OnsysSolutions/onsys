import { UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/_components/ui/button";

export default function UsuariosHeader({ accountId }: { accountId: number }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Usuários
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie os usuários e permissões do sistema
        </p>
      </div>
      <Button asChild className="w-full sm:w-auto">
        <Link href={`/a/${accountId}/usuarios/convidar`}>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar Usuário
        </Link>
      </Button>
    </div>
  );
}
