"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";

interface Props {
  status: "loading" | "expired" | "accepted" | "invalid" | "error";
  message?: string;
}

export default function InviteStatusCard({ status, message }: Props) {
  const router = useRouter();

  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />;
      case "expired":
      case "invalid":
      case "error":
        return <XCircle className="h-8 w-8 text-destructive" />;
      case "accepted":
        return <CheckCircle2 className="h-8 w-8 text-primary" />;
    }
  };

  const renderTitle = () => {
    switch (status) {
      case "loading":
        return "Validando convite...";
      case "expired":
        return "Convite Expirado";
      case "accepted":
        return "Convite Já Aceito";
      case "invalid":
      case "error":
        return "Convite Inválido";
    }
  };

  const renderDescription = () => {
    switch (status) {
      case "loading":
        return null;
      case "expired":
        return "Este convite não é mais válido.";
      case "accepted":
        return "Este convite já foi utilizado.";
      case "invalid":
      case "error":
        return "O link do convite é inválido ou ocorreu um erro.";
    }
  };

  const renderButton = () => {
    switch (status) {
      case "loading":
        return null;
      case "expired":
      case "invalid":
      case "error":
        return (
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => router.push("/")}
          >
            Voltar para o início
          </Button>
        );
      case "accepted":
        return (
          <Button className="w-full" onClick={() => router.push("/")}>
            Ir para o login
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              status === "loading"
                ? "bg-background"
                : status === "accepted"
                  ? "bg-primary/10"
                  : "bg-destructive/10"
            }`}
          >
            {renderIcon()}
          </div>
          <CardTitle className="text-2xl">{renderTitle()}</CardTitle>
          {renderDescription() && (
            <CardDescription>{renderDescription()}</CardDescription>
          )}
        </CardHeader>
        {status !== "loading" && (
          <CardContent>
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
        {renderButton() && <CardFooter>{renderButton()}</CardFooter>}
      </Card>
    </div>
  );
}
