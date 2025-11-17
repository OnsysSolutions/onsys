import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card"
import { Users } from "lucide-react"

export default function UsuariosStats({
  stats,
}: {
  stats: { label: string; value: number }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
