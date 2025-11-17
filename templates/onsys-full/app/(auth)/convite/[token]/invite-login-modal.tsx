"use client";

import { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@/_components/animated-modal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Button } from "@/_components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Convite } from "@prisma/client";
import { Loader2 } from "lucide-react"; // ícone de loading
import { useRouter } from "next/navigation";

const formSchemaLogin = z.object({
  email: z.email({ error: "Email inválido" }),
  password: z.string().min(6, { message: "O tamanho mínimo é 6 caracteres" }),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  convite: Convite | null;
  setOpenSignup: (open: boolean) => void;
}

export default function InviteLoginModal({ open, onOpenChange, convite, setOpenSignup }: Props) {
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: { email: convite?.email ?? "", password: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ estado de loading
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    if (values.email !== convite?.email) return toast.error("Email não compatível com o convite");

    try {
      setIsSubmitting(true); // ⬆️ ativa loading
      const res = await signIn("credentials", { redirect: false, ...values });
      if (res?.error) return toast.error("Email ou senha inválidos");

      await fetch("/convite/aceitar", { method: "POST", body: JSON.stringify({ convite }) });
      toast.success("Login realizado com sucesso!");
      router.push(`/a/${convite.accountId}`)
    } catch (err: any) {
      toast.error(err?.message || "Erro ao fazer login");
    } finally {
      setIsSubmitting(false); // ⬇️ desativa loading
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalBody>
        <ModalContent>
          <h3 className="text-2xl font-bold mb-4">Login</h3>
          <Form {...form}>
            <form id="loginForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nome@exemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>Use o mesmo e-mail do convite.</FormDescription>
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
