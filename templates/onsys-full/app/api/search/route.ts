import { prisma } from "@/_lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const statusId = url.searchParams.get("statusId");
    const tipoArquivoId = url.searchParams.get("tipoArquivoId");
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const account = await prisma.account.findFirst({
      select: {
        estantePrefix: true,
        gavetaPrefix: true,
        caixaPrefix: true,
        arquivoPrefix: true,
      },
    });

    if (!account)
      return new Response(JSON.stringify({ error: "Conta não encontrada" }), { status: 404 });

    const normalize = (s?: string, fallback?: string) =>
      (s || fallback || "").toUpperCase().trim();

    const prefixMap = {
      [normalize(account.estantePrefix, "EST")]: { model: prisma.estante, tipo: "estante" },
      [normalize(account.gavetaPrefix, "GAV")]: { model: prisma.gaveta, tipo: "gaveta" },
      [normalize(account.caixaPrefix, "CX")]: { model: prisma.caixa, tipo: "caixa" },
      [normalize(account.arquivoPrefix, "ARQ")]: { model: prisma.arquivo, tipo: "arquivo" },
    };

    // Busca direta por código (ex: CX-003)
    const codeMatch = query.match(/^([A-Z]+)-(\d{3,})$/i);
    if (codeMatch) {
      const prefix = normalize(codeMatch[1]);
      const id = Number(codeMatch[2]);
      const match = prefixMap[prefix];
      if (!match) return new Response(JSON.stringify({ results: [], total: 0 }), { status: 200 });

      let selectFields: any = { id: true };

      // Cada modelo tem campos diferentes, então selecionamos conforme o tipo
      switch (match.tipo) {
        case "arquivo":
          selectFields.descricao = true;
          selectFields.tipo = { select: { nome: true } };
          selectFields.caixa = { select: { descricao: true } };
          break;
        case "caixa":
        case "gaveta":
        case "estante":
          selectFields.descricao = true;
          break;
        default:
          selectFields.nome = true;
      }

      const item = await (match.model as any).findUnique({
        where: { id },
        select: selectFields,
      });

      if (!item)
        return new Response(JSON.stringify({ results: [], total: 0 }), { status: 200 });

      return new Response(
        JSON.stringify({
          total: 1,
          page: 1,
          limit: 1,
          results: [
            { 
              ...item,
              tipo: match.tipo,
              code: `${prefix}-${String(item.id).padStart(3, "0")}`,
            },
          ],
        }),
        { status: 200 }
      );
    }

    // Busca geral
    const [locais, estantes, gavetas, caixas, arquivos] = await Promise.all([
      prisma.local.findMany({
        where: {
          nome: { contains: query, mode: "insensitive" },
          ...(statusId && { statusId: Number(statusId) }),
        },
        select: { id: true, nome: true },
      }),
      prisma.estante.findMany({
        where: {
          descricao: { contains: query, mode: "insensitive" },
          ...(statusId && { statusId: Number(statusId) }),
        },
        select: { id: true, descricao: true },
      }),
      prisma.gaveta.findMany({
        where: {
          descricao: { contains: query, mode: "insensitive" },
          ...(statusId && { statusId: Number(statusId) }),
        },
        select: { id: true, descricao: true },
      }),
      prisma.caixa.findMany({
        where: {
          descricao: { contains: query, mode: "insensitive" },
          ...(statusId && { statusId: Number(statusId) }),
        },
        select: { id: true, descricao: true },
      }),
      prisma.arquivo.findMany({
        where: {
          descricao: { contains: query, mode: "insensitive" },
          ...(statusId && { statusId: Number(statusId) }),
          ...(tipoArquivoId && { tipoId: Number(tipoArquivoId) }),
        },
        select: {
          id: true,
          descricao: true,
          tipo: { select: { nome: true } },
          caixa: { select: { descricao: true } },
        },
      }),
    ]);

    const combined = [
      ...locais.map((l) => ({
        ...l,
        tipo: "local",
      })),
      ...estantes.map((e) => ({
        ...e,
        tipo: "estante",
        code: `${normalize(account.estantePrefix, "EST")}-${String(e.id).padStart(3, "0")}`,
      })),
      ...gavetas.map((g) => ({
        ...g,
        tipo: "gaveta",
        code: `${normalize(account.gavetaPrefix, "GAV")}-${String(g.id).padStart(3, "0")}`,
      })),
      ...caixas.map((c) => ({
        ...c,
        tipo: "caixa",
        code: `${normalize(account.caixaPrefix, "CX")}-${String(c.id).padStart(3, "0")}`,
      })),
      ...arquivos.map((a) => ({
        ...a,
        tipo: "arquivo",
        code: `${normalize(account.arquivoPrefix, "ARQ")}-${String(a.id).padStart(3, "0")}`,
      })),
    ];

    const total = combined.length;
    const paginated = combined.slice(skip, skip + limit);

    return new Response(JSON.stringify({ total, page, limit, results: paginated }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
