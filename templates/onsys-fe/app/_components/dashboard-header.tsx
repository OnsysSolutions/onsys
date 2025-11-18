"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { Input } from "@/_components/ui/input";
import { SidebarTrigger } from "@/_components/ui/sidebar";
import type { UserData } from "@/a/[accountId]/perfil/configuracoes/_tabs/profile-tab";

interface DashboardHeaderProps {
  accountId: number;
}

export function DashboardHeader({ accountId }: DashboardHeaderProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [avatarRes, userRes] = await Promise.all([
          fetch("/api/avatar"),
          fetch("/api/user", { credentials: "include" }),
        ]);

        if (!avatarRes.ok || !userRes.ok)
          throw new Error("Erro ao buscar dados");

        const avatarData = await avatarRes.json();
        const userData = await userRes.json();

        setAvatarUrl(avatarData.url);
        setUserData(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const searchParams = new URLSearchParams({
      q: query.trim(),
      status: "all",
      tipo: "all",
    });
    router.push(`/a/${accountId}/search?${searchParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-3 px-4 py-2 flex-row items-center justify-between sm:h-16 sm:px-6">
        {/* Seção Esquerda: menu + busca */}
        <div className="flex w-full items-center gap-3 sm:flex-1">
          <SidebarTrigger className="flex-shrink-0" />

          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center min-w-0"
          >
            <div className="relative flex-1 min-w-0 overflow-hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-9 w-full text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Seção Direita: tema + avatar */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={avatarUrl}
                    alt={userData?.nome ?? "Usuário"}
                  />
                  <AvatarFallback>
                    {userData?.nome?.slice(0, 2) ?? "??"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {loading ? (
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-40 animate-pulse" />
                </div>
              ) : (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium truncate">
                        {userData?.nome}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/a/${accountId}/perfil/configuracoes`}>
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sair
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
