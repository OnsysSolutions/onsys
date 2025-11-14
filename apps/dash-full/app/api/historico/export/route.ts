import { NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"
import { format } from "date-fns"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const formato = searchParams.get("formato") || "json"

  const historicos = await prisma.historico.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      usuarioAccount: {
        include: {
          usuario: true,
        },
      },
      convite: true,
    },
  })

  // 🔒 Limpa dados sensíveis
  const historicosLimpos = historicos.map((h) => ({
    id: h.id,
    acao: h.acao,
    descricao: h.descricao ?? "",
    criadoEm: h.criadoEm,
    usuario: h.usuarioAccount?.usuario?.nome ?? "-",
    usuarioEmail: h.usuarioAccount?.usuario?.email ?? "-", // opcional
    convite: h.convite ? { id: h.convite.id, email: h.convite.email } : null,
  }))

  // --------------------------
  // JSON
  // --------------------------
  if (formato === "json") {
    const json = JSON.stringify(historicosLimpos, null, 2)
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="historico.json"`,
      },
    })
  }

  // --------------------------
  // CSV
  // --------------------------
  if (formato === "csv") {
    const header = ["ID", "Ação", "Descrição", "Usuário", "Data"]
    const rows = historicosLimpos.map((h) => [
      h.id,
      h.acao,
      h.descricao,
      h.usuario,
      format(h.criadoEm, "dd/MM/yyyy HH:mm:ss"),
    ])
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="historico.csv"`,
      },
    })
  }

  // --------------------------
  // EXCEL (.xlsx)
  // --------------------------
  if (formato === "excel") {
    const XLSX = await import("xlsx")

    const data = historicosLimpos.map((h) => ({
      ID: h.id,
      Ação: h.acao,
      Descrição: h.descricao,
      Usuário: h.usuario,
      Data: format(h.criadoEm, "dd/MM/yyyy HH:mm:ss"),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Histórico")

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="historico.xlsx"`,
      },
    })
  }

  return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
}
