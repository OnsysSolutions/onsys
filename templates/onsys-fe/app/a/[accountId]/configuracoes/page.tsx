import { Building2, Plug, Settings } from "lucide-react";
import EmptyData from "@/_components/empty-data-1";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";
import { userAccountRole } from "@/actions/user";

export default async function ConfiguracoesPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  const userRole = await userAccountRole(accountId);

  if (!userRole || userRole.id !== 1) {
    return (
      <EmptyData
        message="Acesso negado"
        description="Você não possui permissão para acessar este conteúdo, entre em contato com sua administração caso acredite que seja um engano."
      />
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações da Plataforma
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais da sua organização
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organização
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Nome da Plataforma</Label>
                <Input
                  id="platform-name"
                  defaultValue="Sistema de Arquivo Morto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Input id="timezone" defaultValue="America/Sao_Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Input id="language" defaultValue="Português (Brasil)" />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Organização</CardTitle>
              <CardDescription>
                Informações sobre sua empresa ou instituição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nome da Organização</Label>
                  <Input id="org-name" defaultValue="Empresa XYZ Ltda" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-slug">Slug</Label>
                  <Input id="org-slug" defaultValue="empresa-xyz" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-cnpj">CNPJ</Label>
                <Input id="org-cnpj" defaultValue="00.000.000/0001-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-address">Endereço</Label>
                <Input
                  id="org-address"
                  defaultValue="Rua Exemplo, 123 - Centro"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-city">Cidade</Label>
                  <Input id="org-city" defaultValue="São Paulo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-state">Estado</Label>
                  <Input id="org-state" defaultValue="SP" />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Configure integrações com serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">API REST</div>
                    <div className="text-sm text-muted-foreground">
                      Acesso via API para integrações externas
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
