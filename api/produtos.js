// ============================================================
// Vercel Function — /api/produtos
// Busca dados dos produtos na API do Mercado Livre e
// monta os links de afiliado com suas credenciais.
// ============================================================

const MATT_TOOL = "45522444";
const MATT_WORD = "gustavoaraujo12";

// ── Produtos curados por você ──────────────────────────────
// mlbId    → ID do produto (MLB...) — obrigatório
// categoria → "fitness" | "beleza" | "pet" — obrigatório
// desc     → descrição curta para o card — OPCIONAL
//            Se não preencher, usa o título do anúncio do ML.
//
// ⚠️  IMPORTANTE: use sempre o ID que aparece em &wid= na URL do produto,
//     NÃO o que aparece em /p/MLB...
//
// ✅ Com descrição manual:
//   { mlbId: "MLB3912996147", categoria: "beleza", desc: "Kit skincare completo da Principia." },
//
// ✅ Sem descrição (usa o título do ML):
//   { mlbId: "MLB3912996147", categoria: "beleza" },
//
const PRODUTOS_CURADOS = [
  { mlbId: "MLB3912996147", categoria: "beleza", desc: "" },
  // Adicione mais produtos abaixo:
  // { mlbId: "MLB0000000000", categoria: "fitness", desc: "" },
  // { mlbId: "MLB0000000000", categoria: "pet",     desc: "" },
];
// ──────────────────────────────────────────────────────────

function buildAffiliateLink(mlbId) {
  return `https://www.mercadolivre.com.br/p/${mlbId}?matt_tool=${MATT_TOOL}&matt_word=${MATT_WORD}`;
}

function formatPrice(cents) {
  return "R$" + Number(cents).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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
        const r = await fetch(`https://api.mercadolibre.com/items/${mlbId}`, {
          headers: { "Accept": "application/json" }
        });

        if (!r.ok) throw new Error(`Produto ${mlbId} retornou ${r.status}`);

        const d = await r.json();

        const precoAtual    = d.price;
        const precoOriginal = d.original_price || null;
        const desconto = precoOriginal
          ? `-${Math.round((1 - precoAtual / precoOriginal) * 100)}%`
          : null;

        const img = d.thumbnail
          ? d.thumbnail.replace(/-I\.jpg$/, "-O.jpg")
          : "";

        return {
          id:           d.id,
          nome:         d.title,
          categoria,
          desc:         (desc && desc.trim()) ? desc.trim() : d.title,
          emoji:        catEmoji(categoria),
          img,
          preco:        formatPrice(precoAtual),
          precoOld:     precoOriginal ? formatPrice(precoOriginal) : null,
          desconto,
          loja:         "ml",
          link:         buildAffiliateLink(d.id),
          freeShipping: d.shipping?.free_shipping ?? false,
          condicao:     d.condition === "new" ? "Novo" : "Usado"
        };
      })
    );

    const produtos = resultados
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    resultados
      .filter(r => r.status === "rejected")
      .forEach(r => console.error("[produtos] Erro:", r.reason));

    return res.status(200).json({ produtos });

  } catch (err) {
    console.error("[produtos] Erro geral:", err);
    return res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}

function catEmoji(cat) {
  const m = { fitness: "🏋️", beleza: "💄", pet: "🐾" };
  return m[cat] || "🛒";
}
