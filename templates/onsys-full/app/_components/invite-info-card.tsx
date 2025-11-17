"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/_components/ui/card"
import { Alert, AlertDescription } from "@/_components/ui/alert"
import { Badge } from "@/_components/ui/badge"
import { Mail, Building2, Shield, Calendar, Loader2 } from "lucide-react"
import InviteActions from "./invite-actions"

interface Props {
  inviteData: {
    accountName: string
    role: string
    invitedBy: string
    expiresAt: string
    email: string
  }
  isAccepting: boolean
  isDeclining: boolean
  handleAccept: () => void
  handleDecline: () => void
}

export default function InviteInfoCard({ inviteData, isAccepting, isDeclining, handleAccept, handleDecline }: Props) {
  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      ADMIN: "destructive",
      EDITOR: "default",
      VIEWER: "secondary",
    }
    return variants[role] || "default"
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: "Administrador",
      EDITOR: "Editor",
      VIEWER: "Visitante",
    }
    return roles[role] || role
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Você foi convidado!</CardTitle>
          <CardDescription>Aceite o convite para participar da conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <InfoRow icon={<Building2 className="h-5 w-5 text-primary mt-0.5" />} label="Organização" value={inviteData.accountName} />
            <InfoRow
              icon={<Mail className="h-5 w-5 text-primary mt-0.5" />}
              label="Email Convidado"
              value={inviteData.email}
            />
            <InfoRow
              icon={<Shield className="h-5 w-5 text-primary mt-0.5" />}
              label="Permissão"
              value={<Badge variant={getRoleBadgeVariant(inviteData.role)}>{getRoleName(inviteData.role)}</Badge>}
            />
            <InfoRow icon={<Mail className="h-5 w-5 text-primary mt-0.5" />} label="Convidado por" value={inviteData.invitedBy} />
            <InfoRow
              icon={<Calendar className="h-5 w-5 text-primary mt-0.5" />}
              label="Válido até"
              value={
                inviteData.expiresAt
                  ? new Date(inviteData.expiresAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"
              }
            />
            
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              Ao aceitar este convite, você terá acesso à conta <strong>{inviteData.accountName}</strong> com permissões de{" "}
              <strong>{getRoleName(inviteData.role)}</strong>.
            </AlertDescription>
          </Alert>
        </CardContent>
        <InviteActions
          handleAccept={handleAccept}
          handleDecline={handleDecline}
          isAccepting={isAccepting}
          isDeclining={isDeclining}
        />
      </Card>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
