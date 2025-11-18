"use client";

import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import { Select, SelectTrigger, SelectValue } from "@/_components/ui/select";
import { Skeleton } from "@/_components/ui/skeleton";

export default function LoadingPage() {
  const placeholders = Array.from({ length: 6 }); // Quantos cards mostrar

  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Cabeçalho com filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-64 rounded-md" />
        </div>
        <div className="flex gap-4">
          <Select disabled>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
          </Select>

          <Select disabled>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
          </Select>
        </div>
      </div>

      {/* Cards simulando resultados */}
      <div className="grid gap-3">
        {placeholders.map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="h-6 w-6 rounded-full" /> {/* ícone */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" /> {/* título */}
                <Skeleton className="h-3 w-1/2 rounded-md" /> {/* descrição */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação simulada */}
      <div className="flex justify-center items-center gap-3 pt-6">
        <Button variant="outline" size="sm" disabled>
          Anterior
        </Button>
        <Skeleton className="h-4 w-12 rounded-md" />
        <Button variant="outline" size="sm" disabled>
          Próxima
        </Button>
      </div>
    </div>
  );
}
