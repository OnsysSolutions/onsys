import { Skeleton } from "@/_components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/_components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs"
import { Button } from "@/_components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function DadoDetalhesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Button>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Tabs */}
      <Tabs className="space-y-4">
        {/* Tabs List */}
        <TabsList className="flex gap-2">
          <TabsTrigger value="informacoes" disabled>
            <Skeleton className="h-8 w-28 rounded-md" />
          </TabsTrigger>
          <TabsTrigger value="historico" disabled>
            <Skeleton className="h-8 w-28 rounded-md" />
          </TabsTrigger>
        </TabsList>

        {/* Aba Informações */}
        <TabsContent value="informacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Linha: Título + Status */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Conteúdo */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>

              {/* Criado/Atualizado */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 border-l-2 border-primary/30 pl-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
