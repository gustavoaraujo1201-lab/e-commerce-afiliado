// ============================================================
// Vercel Function — /api/produtos
// Busca dados dos produtos na API do Mercado Livre e
// monta os links de afiliado com suas credenciais.
// ============================================================

const MATT_TOOL = "45522444";
const MATT_WORD = "gustavoaraujo12";

// ── Produtos curados por você ──────────────────────────────
// Adicione/remova IDs de produtos do ML aqui.
// Para achar o ID: abra o produto no ML e copie o código MLB...
// da URL ou do link gerado no Gerador de Links do painel.
const PRODUTOS_CURADOS = [
  { mlbId: "MLB6655263510", categoria: "fitness"  },
  // { mlbId: "MLB2222222222", categoria: "beleza"   },
  // { mlbId: "MLB3333333333", categoria: "pet"      },
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
  // CORS — permite só o seu domínio em produção
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Busca todos os produtos em paralelo na API pública do ML
    const resultados = await Promise.allSettled(
      PRODUTOS_CURADOS.map(async ({ mlbId, categoria }) => {
        const r = await fetch(`https://api.mercadolibre.com/items/${mlbId}`, {
          headers: { "Accept": "application/json" }
        });

        if (!r.ok) throw new Error(`Produto ${mlbId} retornou ${r.status}`);

        const d = await r.json();

        // Calcula desconto
        const precoAtual   = d.price;
        const precoOriginal = d.original_price || null;
        const desconto = precoOriginal
          ? `-${Math.round((1 - precoAtual / precoOriginal) * 100)}%`
          : null;

        // Pega a melhor imagem disponível
        const img = d.thumbnail
          ? d.thumbnail.replace(/\-I\.jpg$/, "-O.jpg") // versão maior
          : "";

        return {
          id:        d.id,
          nome:      d.title,
          categoria,
          desc:      d.title, // ML não retorna descrição curta — pode editar manualmente depois
          emoji:     catEmoji(categoria),
          img,
          preco:     formatPrice(precoAtual),
          precoOld:  precoOriginal ? formatPrice(precoOriginal) : null,
          desconto,
          loja:      "ml",
          link:      buildAffiliateLink(d.id),
          freeShipping: d.shipping?.free_shipping ?? false,
          condicao:  d.condition === "new" ? "Novo" : "Usado"
        };
      })
    );

    // Filtra só os que deram certo
    const produtos = resultados
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    // Log dos que falharam (aparece no dashboard da Vercel)
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
