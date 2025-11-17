'use client';

import { useEffect, useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Separator } from "@/_components/ui/separator";
import { Label } from "@/_components/ui/label";
import { Input } from "@/_components/ui/input";
import { Button } from "@/_components/ui/button";
import ProfileAvatarForm from "./profile-avatar-form";

export interface UserData {
    id: number;
    nome: string;
    email: string;
    image?: string;
    tipoUsuario: { nome: string };
}

export default function ProfileTab() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) throw new Error("Erro ao buscar usuário");
                const data = await res.json();
                setUserData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Erro ao carregar dados do usuário");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        const form = e.currentTarget;
        const formData = {
            nome: (form.name as unknown as HTMLInputElement).value,
            email: (form.email as HTMLInputElement).value,
        };

        try {
            const res = await fetch(`/api/user/${userData.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // antes era { updateData: formData }
            });


            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Erro ao atualizar usuário");
            }

            const updatedUser = await res.json();
            setUserData(updatedUser);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao atualizar perfil");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="h-6 w-1/3 bg-gray-300 rounded animate-pulse" />
                    <CardDescription className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-gray-300 animate-pulse" />
                        <div className="flex-1 space-y-4">
                            <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
                            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
                        </div>
                    </div>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize suas informações de perfil</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <ProfileAvatarForm initialAvatarUrl={userData?.image ?? ""} />
                <Separator />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" name="name" defaultValue={userData?.nome ?? ""} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={userData?.email ?? ""}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
