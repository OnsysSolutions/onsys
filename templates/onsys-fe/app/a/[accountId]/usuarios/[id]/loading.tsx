import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/_components/ui/card"
import { Skeleton } from "@/_components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/_components/ui/tabs"

export default function UsuarioDetalheLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 text-center">
                  <Skeleton className="h-5 w-32 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="space-y-4 border-t pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* RoleSelect Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-48" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="atividade" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="atividade">
                <Skeleton className="h-6 w-24" />
              </TabsTrigger>
              <TabsTrigger value="estatisticas">
                <Skeleton className="h-6 w-24" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="atividade" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-5 w-32" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-48" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-8 w-full rounded-md" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>
                      <Skeleton className="h-4 w-24" />
                    </CardTitle>
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
