import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar"
import { Badge } from "@/_components/ui/badge"
import { Button } from "@/_components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Trash } from "lucide-react"
import Link from "next/link"

export default function UsuariosTableRow({
  userAccount,
  accountId,
}: {
  userAccount: any
  accountId: number
}) {
  const userAvatar = userAccount.usuario.avatarUrl || "/placeholder.svg"

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Administrador":
        return "default"
      case "Editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (nome: string) =>
    nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const getStatusVariant = (statusId: number) =>
    statusId === 1 ? "default" : "secondary"

  return (
    <tr className="hover:bg-muted/40 transition-colors text-sm">
      <td className="py-3 px-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userAvatar} alt={userAccount.usuario.nome} />
            <AvatarFallback>{getInitials(userAccount.usuario.nome)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{userAccount.usuario.nome}</span>
        </div>
      </td>
      <td className="py-3 px-4">{userAccount.usuario.email}</td>
      <td className="py-3 px-4">
        <Badge variant={getTipoColor(userAccount.tipoUsuarioAccount?.nome || "Servidor")}>
          {userAccount.tipoUsuarioAccount?.nome || "—"}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Badge variant={getStatusVariant(userAccount.usuario.statusId)}>
          {userAccount.usuario.statusId === 1 ? "Ativo" : "Inativo"}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right">
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
              <Link href={`/a/${accountId}/usuarios/${userAccount.usuario.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver/Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Remover da Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}
