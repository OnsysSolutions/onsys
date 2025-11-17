"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Account, Convite, TipoUsuario, Usuario } from "@prisma/client";
import { ErrorResponse } from "@/_lib/types";
import InviteStatusCard from "@/_components/invite-status-card";
import InviteInfoCard from "@/_components/invite-info-card";
import InviteAuthDialog from "./invite-auth-dialog";
import InviteLoginModal from "./invite-login-modal";
import InviteSignupModal from "./invite-signup-modal";

export type InviteStatus = "loading" | "valid" | "expired" | "accepted" | "invalid" | "error";

export interface InviteData {
  email: string;
  role: string;
  accountName: string;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [convite, setConvite] = useState<Convite | null>(null);
  const [status, setStatus] = useState<InviteStatus>("loading");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  useEffect(() => {
    const validateInvite = async () => {
      try {
        setStatus("loading");
        const res = await fetch(`/api/convite?token=${token}`);
        if (!res.ok) return setStatus("invalid");

        const convite: Convite & { tipoUsuario: TipoUsuario, account: Account, criadoPor: Usuario } = await res.json();
        if (convite.aceito) return setStatus("accepted");
        if (convite.expiracao && new Date(convite.expiracao) < new Date() || convite.tipoStatusid !== 1)
          return setStatus("expired");

        setConvite(convite);
        setInviteData({
          email: convite.email,
          role: convite.tipoUsuario?.nome ?? "Desconhecido",
          accountName: convite.account?.nome ?? "Conta não identificada",
          invitedBy: convite.criadoPor?.nome ?? "Usuário desconhecido",
          expiresAt: convite.expiracao?.toString() ?? new Date().toISOString(),
          createdAt: convite.criadoEm.toString() ?? new Date().toISOString(),
        });
        setStatus("valid");
      } catch {
        setStatus("error");
      }
    };

    validateInvite();
  }, [token]);

  const handleAccept = async () => {
    if (!inviteData) return;
    setIsAccepting(true);

    try {
      const res = await fetch("/api/convite/aceitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convite }),
      });

      if (!res.ok) {
        const err: ErrorResponse = await res.json().catch(() => ({}));
        if (err.error_code === "unauthorized") {
          setShowAuthModal(true);
          return;
        }
        toast.error(err.name, { description: err.message });
        setStatus("error");
        return;
      }

      router.push("/a");
    } catch {
      setStatus("error");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await fetch("/api/convite/recusar", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      router.push("/");
    } catch {
      setStatus("error");
    } finally {
      setIsDeclining(false);
    }
  };

  if (status !== "valid") return <InviteStatusCard status={status} />;

  return (
    <>
      <InviteInfoCard
        inviteData={inviteData!}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        isAccepting={isAccepting}
        isDeclining={isDeclining}
      />

      <InviteAuthDialog
        open={showAuthModal}
        onClose={setShowAuthModal}
        inviteData={inviteData!}
        setOpenLogin={setOpenLogin}
        setOpenSignup={setOpenSignup}
      />

      <InviteLoginModal
        open={openLogin}
        onOpenChange={setOpenLogin}
        convite={convite}
        setOpenSignup={setOpenSignup}
      />

      <InviteSignupModal
        open={openSignup}
        onOpenChange={setOpenSignup}
        convite={convite}
        setOpenLogin={setOpenLogin} // ✅ nome correto da prop
      />

    </>
  );
}
