"use client";

import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/_components/ui/input-otp";
import { Label } from "@/_components/ui/label";
import type { SignupData } from "@/_lib/types";

export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<
    SignupData & { confirmarSenha: string; codigo?: string }
  >({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    codigo: "",
  });
  const [isPending, startTransition] = useTransition();
  const [_message, _setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const _router = useRouter();

  const totalSteps = 3;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // === Enviar código de verificação ===
  const sendCode = async () => {
    const { email } = formData;
    if (!email || !email.includes("@")) {
      toast.error("Digite um e-mail válido antes de enviar o código.");
      return;
    }

    try {
      setIsSending(true);
      const res = await fetch("/api/email/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Falha ao enviar código.");
      toast.success("Código enviado para seu e-mail!");
      setCodeSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao enviar código", { description: err.message });
      } else {
        toast.error("Erro ao enviar código");
      }
    } finally {
      setIsSending(false);
    }
  };

  // === Verificar código ===
  const verifyCode = async () => {
    const { email, codigo } = formData;
    if (!codigo || codigo.trim().length !== 6) {
      toast.error("Digite o código de 6 dígitos enviado para seu e-mail.");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await fetch("/api/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });
      if (!res.ok) throw new Error("Código inválido ou expirado.");
      toast.success("Código verificado com sucesso!");
      setCurrentStep(3);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Erro ao verificar código.");
      } else {
        toast.error("Erro ao verificar código.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {});
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.nome.trim() !== "" && formData.email.includes("@");
      case 2:
        return !!formData.codigo && formData.codigo.length === 6;
      case 3:
        return (
          formData.senha.length >= 6 &&
          formData.confirmarSenha === formData.senha
        );
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Crie sua conta
        </CardTitle>
        <CardDescription className="text-center">
          Passo {currentStep} de {totalSteps}
        </CardDescription>
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                index + 1 <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* === Etapa 1: nome e email === */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* === Etapa 2: código de verificação === */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Label className="text-center">Código de verificação</Label>
              <InputOTP
                maxLength={6}
                value={formData.codigo}
                onChange={(v) => handleInputChange("codigo", v)}
                className="w-[260px]"
              >
                <InputOTPGroup className="justify-between">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground text-center">
                {codeSent
                  ? "Digite o código enviado para seu e-mail."
                  : "Clique abaixo para enviar o código de verificação."}
              </p>

              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  onClick={sendCode}
                  disabled={isSending}
                  className="flex-1"
                >
                  {isSending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {codeSent ? "Reenviar código" : "Enviar código"}
                </Button>
                <Button
                  type="button"
                  onClick={verifyCode}
                  disabled={isVerifying}
                  className="flex-1 font-semibold"
                >
                  {isVerifying && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Verificar
                </Button>
              </div>
            </div>
          )}

          {/* === Etapa 3: senha === */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.senha}
                  onChange={(e) => handleInputChange("senha", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmarSenha}
                  onChange={(e) =>
                    handleInputChange("confirmarSenha", e.target.value)
                  }
                  required
                />
                {formData.confirmarSenha &&
                  formData.senha !== formData.confirmarSenha && (
                    <p className="text-xs text-destructive">
                      As senhas não coincidem
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* === Botões de navegação === */}
          <div className="flex gap-2 pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStepValid()) ||
                  (currentStep === 2 && !codeSent)
                }
                className="flex-1 font-semibold"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending || !isStepValid()}
                className="flex-1 font-semibold"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Criar conta
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/" className="text-primary font-semibold hover:underline">
            Entre
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
