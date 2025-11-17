// app/a/[accountId]/dados/novo/loading.tsx
import { Skeleton } from "@/_components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/_components/ui/card"
import { Button } from "@/_components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoadingNovoLocalPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Button>
        <div>
          <Skeleton className="h-7 w-40 mb-1" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>

      {/* Card Principal */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primeira linha: Título + Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Segunda linha: Descrição */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 col-span-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Terceira linha: Conteúdo */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
