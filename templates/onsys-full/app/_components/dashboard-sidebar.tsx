import Link from "next/link"
import {
  LayoutDashboard,
  MapPin,
  Users,
  History
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/_components/ui/sidebar"

import { Button } from "@/_components/ui/button"
import { siteName } from "@/_lib/const"
import SaoMiguel from "./sao-miguel"
import FeitoPor from "./feito-por"
import { headers } from "next/headers"
import OnsysIcon from "./icons/onsys"

export async function DashboardSidebar({ accountId }: { accountId: number }) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  console.log("Current Pathname:", pathname);

  const navigationItems = [
    {
      title: "Visão Geral",
      items: [
        { title: "Painel", href: `/a/${accountId}`, icon: LayoutDashboard },
      ],
    },
    {
      title: "Gestão",
      items: [
        { title: "Dados", href: `/a/${accountId}/dados`, icon: MapPin },
      ],
    },
    {
      title: "Administração",
      items: [
        { title: "Usuários", href: `/a/${accountId}/usuarios`, icon: Users },
        { title: "Histórico", href: `/a/${accountId}/historico`, icon: History },
      ],
    },
  ]

  const plants = [
  {
    value: 'monstera-deliciosa',
    label: 'Monstera Deliciosa (Swiss Cheese Plant)',
  },
  {
    value: 'ficus-lyrata',
    label: 'Ficus Lyrata (Fiddle Leaf Fig)',
  },
  {
    value: 'sansevieria-trifasciata',
    label: 'Sansevieria Trifasciata (Snake Plant)',
  },
  {
    value: 'spathiphyllum-wallisii',
    label: 'Spathiphyllum Wallisii (Peace Lily)',
  },
  {
    value: 'epipremnum-aureum',
    label: 'Epipremnum Aureum (Golden Pothos)',
  },
  {
    value: 'calathea-orbifolia',
    label: 'Calathea Orbifolia (Prayer Plant)',
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
          <Link href={`/a/${accountId}`} >
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
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="flex flex-1"></div>
        <SaoMiguel />

      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 text-xs text-muted-foreground text-center">
        <FeitoPor />
      </SidebarFooter>
    </Sidebar>
  )
}
