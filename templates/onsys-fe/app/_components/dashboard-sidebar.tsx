import { History, LayoutDashboard, MapPin, Users } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/_components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/_components/ui/sidebar";
import { siteName } from "@/_lib/const";
import FeitoPor from "./feito-por";
import OnsysIcon from "./icons/onsys";

export async function DashboardSidebar({ accountId }: { accountId: number }) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const navigationItems = [
    {
      title: "Visão Geral",
      items: [
        { title: "Painel", href: `/a/${accountId}`, icon: LayoutDashboard },
      ],
    },
    {
      title: "Gestão",
      items: [{ title: "Dados", href: `/a/${accountId}/dados`, icon: MapPin }],
    },
    {
      title: "Administração",
      items: [
        { title: "Usuários", href: `/a/${accountId}/usuarios`, icon: Users },
        {
          title: "Histórico",
          href: `/a/${accountId}/historico`,
          icon: History,
        },
      ],
    },
  ];

  return (
    <Sidebar>
      {/* HEADER COM POPOVER DE CONTAS */}
      <SidebarHeader className="border-b border-border px-6 py-4">
        <Button
          variant="ghost"
          className="w-full justify-between font-semibold text-sm"
          asChild
        >
          <Link href={`/a/${accountId}`}>
            <div className="flex items-center gap-2">
              <OnsysIcon className="min-w-6 min-h-6 dark:fill-white dark:text-white dark:stroke-white" />
              <span className="truncate max-w-[150px]">{siteName}</span>
            </div>
          </Link>
        </Button>
      </SidebarHeader>

      {/* CONTEÚDO DE NAVEGAÇÃO */}
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="flex flex-1"></div>
        <Image width={50} height={50} alt="Logo" src="/vercel.svg" />
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 text-xs text-muted-foreground text-center">
        <FeitoPor />
      </SidebarFooter>
    </Sidebar>
  );
}
