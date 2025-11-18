"use client";

import { AlertTriangle, CheckCircle, Loader2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";

export default function InviteStatusCard({ status }: { status: string }) {
  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="animate-spin text-primary" size={32} />;
      case "valid":
        return <CheckCircle className="text-green-500" size={32} />;
      case "expired":
        return <AlertTriangle className="text-yellow-500" size={32} />;
      case "invalid":
      case "error":
        return <XCircle className="text-red-500" size={32} />;
      case "accepted":
        return <CheckCircle className="text-blue-500" size={32} />;
      default:
        return null;
    }
  };

  const message =
    {
      loading: "Verificando convite...",
      valid: "Convite válido!",
      expired: "Este convite expirou.",
      invalid: "Convite inválido.",
      accepted: "Convite já foi aceito.",
      error: "Erro ao carregar convite.",
    }[status] || "Status desconhecido";

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-[350px] text-center">
        <CardHeader>
          <CardTitle>Convite</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {renderIcon()}
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
