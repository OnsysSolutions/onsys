"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/_components/animated-modal";
import { Button } from "@/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";

// ----------------------------------------------------
// 🔥 MOCK CONVITE (substitui Prisma)
// ----------------------------------------------------
export interface MockConvite {
  email: string;
  accountId: string;

  accountName: string;
  role: string;
  invitedBy: string;
  expiresAt: string | Date;
  createdAt: string | Date;

  aceito: boolean;
  expiracao: Date;
  tipoStatusid: number;
}


const formSchemaLogin = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, { message: "O tamanho mínimo é 6 caracteres" }),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  convite: MockConvite | null; // ← agora é um mock
  setOpenSignup: (open: boolean) => void;
}

export default function InviteLoginModal({
  open,
  onOpenChange,
  convite,
  setOpenSignup,
}: Props) {
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: { email: convite?.email ?? "", password: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // ----------------------------------------------------
  // 🔥 FAKE SIGN-IN (simula autenticação)
  // ----------------------------------------------------
  async function fakeLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    await new Promise((res) => setTimeout(res, 800)); // simula delay

    if (email !== "test@example.com") return { error: "Conta incorreta" };
    if (password !== "123456") return { error: "Senha incorreta" };

    return { ok: true };
  }

  // ----------------------------------------------------
  // 🔥 HANDLE SUBMIT (versão mock)
  // ----------------------------------------------------
  async function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    if (values.email !== convite?.email)
      return toast.error("Email não compatível com o convite");

    try {
      setIsSubmitting(true);

      // Fake Login
      const res = await fakeLogin(values);

      if ("error" in res) return toast.error("Email ou senha inválidos");

      // Fake Accept Invite
      await new Promise((res) => setTimeout(res, 500));

      toast.success("Login realizado com sucesso!");
      router.push(`/a/${convite?.accountId ?? "123"}`);
    } catch {
      toast.error("Erro inesperado ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalBody>
        <ModalContent>
          <h3 className="text-2xl font-bold mb-4">Login</h3>
          <Form {...form}>
            <form
              id="loginForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nome@exemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use o mesmo e-mail do convite.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ModalContent>

        <ModalFooter className="flex justify-between items-center">
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Button
              variant="link"
              className="text-primary p-0 font-semibold"
              onClick={() => {
                setOpenSignup(true);
                onOpenChange(false);
              }}
            >
              Criar uma
            </Button>
          </p>

          <Button form="loginForm" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
