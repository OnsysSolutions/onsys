"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import InviteInfoCard from "@/_components/invite-info-card";
import InviteStatusCard from "@/_components/invite-status-card";
import InviteAuthDialog from "./invite-auth-dialog";
import InviteLoginModal, { MockConvite } from "./invite-login-modal";
import InviteSignupModal from "./invite-signup-modal";

export type InviteStatus =
  | "loading"
  | "valid"
  | "expired"
  | "accepted"
  | "invalid"
  | "error";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [inviteData, setInviteData] = useState<MockConvite | null>(null);
  const [status, setStatus] = useState<InviteStatus>("loading");

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  // ----------------------------
  // 🔥 MOCK DATA (dummy)
  // ----------------------------
  const MOCK_INVITE: MockConvite = {
    email: "johndoe@example.com",
    role: "Administrador",
    accountName: "OnSys Solutions",
    invitedBy: "Ana Oliveira",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date().toISOString(),
    aceito: false,
    expiracao: new Date(Date.now() + 1000 * 60 * 60 * 24),
    tipoStatusid: 1,
    accountId: "1",
  };

  // ----------------------------------------------------
  // FAKE VALIDATION (simula chamada à API/Prisma)
  // ----------------------------------------------------
  useEffect(() => {
    const validateInvite = async () => {
      setStatus("loading");

      await new Promise((res) => setTimeout(res, 500)); // simula delay

      // ❌ token inválido no mock
      if (!token || token === "xxx") {
        return setStatus("invalid");
      }

      // ❌ convite expirado
      if (MOCK_INVITE.expiracao < new Date()) {
        return setStatus("expired");
      }

      // ❌ convite já aceito
      if (MOCK_INVITE.aceito) {
        return setStatus("accepted");
      }

      // ✔ válido
      setInviteData({
        email: MOCK_INVITE.email,
        role: MOCK_INVITE.role,
        accountName: MOCK_INVITE.accountName,
        invitedBy: MOCK_INVITE.invitedBy,
        expiresAt: MOCK_INVITE.expiresAt,
        createdAt: MOCK_INVITE.createdAt,

        // campos obrigatórios
        accountId: MOCK_INVITE.accountId,
        aceito: MOCK_INVITE.aceito,
        expiracao: MOCK_INVITE.expiracao,
        tipoStatusid: MOCK_INVITE.tipoStatusid,
      });


      setStatus("valid");
    };

    validateInvite();
  }, [
    token,
    MOCK_INVITE.accountName,
    MOCK_INVITE.aceito,
    MOCK_INVITE.createdAt,
    MOCK_INVITE.email,
    MOCK_INVITE.expiracao,
    MOCK_INVITE.expiresAt,
    MOCK_INVITE.invitedBy,
    MOCK_INVITE.role,
  ]);

  // ----------------------------------------------------
  // Accept Mock
  // ----------------------------------------------------
  const handleAccept = async () => {
    if (!inviteData) return;
    setIsAccepting(true);

    await new Promise((res) => setTimeout(res, 600)); // delay fake

    toast.success("Convite aceito!");
    router.push("/a");

    setIsAccepting(false);
  };

  // ----------------------------------------------------
  // Decline Mock
  // ----------------------------------------------------
  const handleDecline = async () => {
    setIsDeclining(true);

    await new Promise((res) => setTimeout(res, 500));

    toast.info("Convite recusado.");
    router.push("/");

    setIsDeclining(false);
  };

  if (status !== "valid") return <InviteStatusCard status={status} />;

  return (
    <>
      <InviteInfoCard
        inviteData={inviteData}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        isAccepting={isAccepting}
        isDeclining={isDeclining}
      />

      <InviteAuthDialog
        open={showAuthModal}
        onClose={setShowAuthModal}
        inviteData={inviteData}
        setOpenLogin={setOpenLogin}
        setOpenSignup={setOpenSignup}
      />

      <InviteLoginModal
        open={openLogin}
        onOpenChange={setOpenLogin}
        convite={MOCK_INVITE}
        setOpenSignup={setOpenSignup}
      />

      <InviteSignupModal
        open={openSignup}
        onOpenChange={setOpenSignup}
        convite={MOCK_INVITE}
        setOpenLogin={setOpenLogin}
      />
    </>
  );
}
