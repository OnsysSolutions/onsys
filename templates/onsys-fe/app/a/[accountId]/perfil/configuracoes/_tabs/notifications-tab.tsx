"use client";

import { useState } from "react";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Label } from "@/_components/ui/label";
import { Separator } from "@/_components/ui/separator";
import { Switch } from "@/_components/ui/switch";

export default function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Configure como você deseja receber notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações por Email</Label>
            <p className="text-sm text-muted-foreground">
              Receba atualizações importantes por email
            </p>
          </div>
          <Switch
            disabled
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações Push</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações em tempo real no navegador
            </p>
          </div>
          <Switch
            disabled
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Relatório Semanal</Label>
            <p className="text-sm text-muted-foreground">
              Receba um resumo semanal das atividades
            </p>
          </div>
          <Switch
            disabled
            checked={weeklyReport}
            onCheckedChange={setWeeklyReport}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button disabled variant="outline">
            Cancelar
          </Button>
          <Button disabled>Salvar Preferências</Button>
        </div>
      </CardContent>
    </Card>
  );
}
