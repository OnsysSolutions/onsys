'use client';

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";

export default function SecurityTab() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const currentPassword = (form["current-password"] as HTMLInputElement).value;
    const newPassword = (form["new-password"] as HTMLInputElement).value;
    const confirmPassword = (form["confirm-password"] as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      setError("A nova senha e a confirmação não coincidem.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao alterar senha");

      setSuccess("Senha alterada com sucesso!");
      form.reset();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao alterar senha");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" required />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="reset">Cancelar</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
          <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Status</Label>
              <p className="text-sm text-muted-foreground">
                Autenticação de dois fatores desativada
              </p>
            </div>
            <Button disabled variant="outline">Ativar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
