import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import ConvitesEnviados from "./convites-enviados"

export default function ConvitesPendentes({
  convites,
  accountId,
  handleDecline,
}: {
  convites: any[]
  accountId: number
  handleDecline: (conviteId: number) => Promise<any>

}) {
  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="text-blue-900 dark:text-blue-100">
          Convites Pendentes
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          {convites.length} convite(s) aguardando aceitação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {convites.map((convite) => {
            const dias = Math.floor(
              (Date.now() - new Date(convite.criadoEm).getTime()) / (1000 * 60 * 60 * 24)
            )
            const dataEnvio =
              dias === 0 ? "Hoje" : dias === 1 ? "Há 1 dia" : `Há ${dias} dias`
            return (
              <ConvitesEnviados
                key={convite.id}
                convite={convite}
                dataEnvio={dataEnvio}
                accountId={accountId}
                handleDecline={handleDecline}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
