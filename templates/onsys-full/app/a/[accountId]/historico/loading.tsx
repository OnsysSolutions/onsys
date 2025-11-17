import { Card, CardContent, CardHeader } from "@/_components/ui/card"
import { Skeleton } from "@/_components/ui/skeleton"

export default function HistoricoLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-[300px]" />
        <Skeleton className="mt-2 h-5 w-[400px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[60px]" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="mt-2 h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
