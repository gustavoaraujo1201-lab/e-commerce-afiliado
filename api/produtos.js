// ============================================================
// Vercel Function — /api/produtos
// ============================================================

const MATT_TOOL = "45522444";
const MATT_WORD = "gustavoaraujo12";

// ── Produtos curados por você ──────────────────────────────
// Use o ID do CATÁLOGO — o MLB que aparece em /p/MLB... na URL
// NÃO use o &wid= (esse é o anúncio do vendedor, privado)
const PRODUTOS_CURADOS = [
  { mlbId: "MLB43444252", categoria: "beleza", desc: "" },
  // { mlbId: "MLB00000000", categoria: "fitness", desc: "" },
];
// ──────────────────────────────────────────────────────────

function buildAffiliateLink(mlbId) {
  return `https://www.mercadolivre.com.br/p/${mlbId}?matt_tool=${MATT_TOOL}&matt_word=${MATT_WORD}`;
}

function formatPrice(value) {
  return "R$" + Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function catEmoji(cat) {
  return { fitness: "🏋️", beleza: "💄", pet: "🐾" }[cat] || "🛒";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const resultados = await Promise.allSettled(
      PRODUTOS_CURADOS.map(async ({ mlbId, categoria, desc }) => {

        // Busca o catálogo público (não precisa de token)
        const r = await fetch(`https://api.mercadolibre.com/products/${mlbId}`, {
          headers: { "Accept": "application/json" }
        });

        if (!r.ok) throw new Error(`Produto ${mlbId} retornou ${r.status}`);
        const d = await r.json();

        // Busca o melhor preço do catálogo
        const pr = await fetch(`https://api.mercadolibre.com/products/${mlbId}/items?limit=1`, {
          headers: { "Accept": "application/json" }
        });

        let preco = null;
        let precoOld = null;
        let desconto = null;
        let freeShipping = false;

        if (pr.ok) {
          const prData = await pr.json();
          const item = prData.results?.[0];
          if (item) {
            preco       = item.price ? formatPrice(item.price) : null;
            precoOld    = item.original_price ? formatPrice(item.original_price) : null;
            desconto    = item.original_price
              ? `-${Math.round((1 - item.price / item.original_price) * 100)}%`
              : null;
            freeShipping = item.shipping?.free_shipping ?? false;
          }
        }

        const img = d.pictures?.[0]?.url || d.main_picture?.url || "";

        return {
          id:       mlbId,
          nome:     d.name,
          categoria,
          desc:     (desc && desc.trim()) ? desc.trim() : d.name,
          emoji:    catEmoji(categoria),
          img,
          preco:    preco || "Ver preço",
          precoOld,
          desconto,
          loja:     "ml",
          link:     buildAffiliateLink(mlbId),
          freeShipping,
          condicao: "Novo"
        };
      })
    );

    const produtos = resultados
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    resultados
      .filter(r => r.status === "rejected")
      .forEach(r => console.error("[produtos] Erro:", r.reason?.message));

    return res.status(200).json({ produtos });

  } catch (err) {
    console.error("[produtos] Erro geral:", err.message);
    return res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}
