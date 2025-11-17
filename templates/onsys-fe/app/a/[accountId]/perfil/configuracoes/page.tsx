"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs"
import { User, Bell, Shield, Palette } from "lucide-react"
import ProfileTab from "./_tabs/profile-tab"
import NotificationsTab from "./_tabs/notifications-tab"
import SecurityTab from "./_tabs/security-tab"
import AppearanceTab from "./_tabs/appearance-tab"

export default function PerfilConfiguracoesPage() {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" /> Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" /> Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
