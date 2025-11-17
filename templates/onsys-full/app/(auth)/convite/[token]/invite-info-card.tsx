"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card"
import { Button } from "@/_components/ui/button"

export default function InviteInfoCard({
  inviteData,
  handleAccept,
  handleDecline,
  isAccepting,
  isDeclining,
}: {
  inviteData: any
  handleAccept: () => void
  handleDecline: () => void
  isAccepting?: boolean
  isDeclining?: boolean
}) {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-lg p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Convite para {inviteData.accountName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><b>Email:</b> {inviteData.email}</p>
          <p><b>Função:</b> {inviteData.role}</p>
          <p><b>Convidado por:</b> {inviteData.invitedBy}</p>
          <p><b>Expira em:</b> {new Date(inviteData.expiresAt).toLocaleString()}</p>

          <div className="flex gap-4 pt-6 justify-center">
            <Button
              onClick={handleDecline}
              disabled={isDeclining}
              variant="outline"
              className="w-1/3"
            >
              {isDeclining ? "Recusando..." : "Recusar"}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              className="w-1/3"
            >
              {isAccepting ? "Aceitando..." : "Aceitar convite"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
