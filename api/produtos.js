// ============================================================
// Vercel Function — /api/produtos
// Busca dados dos produtos na API do Mercado Livre com
// autenticação via Client Credentials.
// ============================================================

const ML_CLIENT_ID     = "7877608430424687";
const ML_CLIENT_SECRET = "rtHIlsg8aLMq8hfBEnjJOSXiFrIA1nZX";
const MATT_TOOL        = "45522444";
const MATT_WORD        = "gustavoaraujo12";

// ── Produtos curados por você ──────────────────────────────
// mlbId    → ID do produto — use o &wid= da URL do produto
// categoria → "fitness" | "beleza" | "pet"
// desc     → descrição opcional. Se vazio, usa o título do ML.
const PRODUTOS_CURADOS = [
  { mlbId: "MLB3912996147", categoria: "beleza", desc: "" },
  // { mlbId: "MLB0000000000", categoria: "fitness", desc: "" },
  // { mlbId: "MLB0000000000", categoria: "pet",     desc: "" },
];
// ──────────────────────────────────────────────────────────

// Cache do token em memória (válido por ~6h)
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "client_credentials",
      client_id:     ML_CLIENT_ID,
      client_secret: ML_CLIENT_SECRET
    })
  });

  if (!res.ok) throw new Error(`Erro ao obter token: ${res.status}`);

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  return cachedToken;
}

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
  const m = { fitness: "🏋️", beleza: "💄", pet: "🐾" };
  return m[cat] || "🛒";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const token = await getAccessToken();

    const resultados = await Promise.allSettled(
      PRODUTOS_CURADOS.map(async ({ mlbId, categoria, desc }) => {
        const r = await fetch(`https://api.mercadolibre.com/items/${mlbId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
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
      .forEach(r => console.error("[produtos] Erro:", r.reason?.message));

    return res.status(200).json({ produtos });

  } catch (err) {
    console.error("[produtos] Erro geral:", err.message);
    return res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}
