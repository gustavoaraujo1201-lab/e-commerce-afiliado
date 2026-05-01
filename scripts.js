// ============================================================
// SEUS PRODUTOS — edite aqui para adicionar seus links de afiliado
// ============================================================
const produtos = [
  // ── FITNESS EM CASA ──────────────────────────────────────
  {
    id: 1,
    nome: "Kit Elástico de Musculação 5 Níveis",
    categoria: "fitness",
    desc: "Conjunto com 5 faixas de resistência progressiva para treino completo em casa. Substitui academia com muito menos custo.",
    emoji: "🏋️",
    img: "",
    preco: "R$49,90",
    precoOld: "R$89,90",
    desconto: "-44%",
    loja: "amazon",
    // ⬇️ Gere o link no SiteStripe da Amazon e cole aqui
    link: "https://amzn.to/4esgWw9"
  },
  {
    id: 2,
    nome: "Tapete de Yoga Antiderrapante 6mm",
    categoria: "fitness",
    desc: "Tapete premium para yoga, pilates e alongamento. Material ecológico, superfície antiderrapante e fácil de limpar.",
    emoji: "🧘",
    img: "",
    preco: "R$79,90",
    precoOld: "R$129,90",
    desconto: "-38%",
    loja: "ml",
    // ⬇️ Gere o link no painel de afiliados do ML e cole aqui
    link: "https://www.mercadolivre.com.br/social/gpa_afiliadobr"
  },
  {
    id: 3,
    nome: "Corda de Pular Speed Profissional",
    categoria: "fitness",
    desc: "Corda com rolamento de alta velocidade, cabo de aço revestido e alças ergonômicas. Ideal para cardio e emagrecimento.",
    emoji: "🪢",
    img: "",
    preco: "R$39,90",
    precoOld: "R$69,90",
    desconto: "-43%",
    loja: "amazon",
    link: "https://amzn.to/4esgWw9"
  },

  // ── BELEZA & SKINCARE ────────────────────────────────────
  {
    id: 4,
    nome: "Sérum Vitamina C Facial 30ml",
    categoria: "beleza",
    desc: "Sérum concentrado com vitamina C 20%, ácido hialurônico e niacinamida. Ilumina, uniformiza e reduz manchas em 2 semanas.",
    emoji: "✨",
    img: "",
    preco: "R$59,90",
    precoOld: "R$99,90",
    desconto: "-40%",
    loja: "amazon",
    link: "https://amzn.to/4esgWw9"
  },
  {
    id: 5,
    nome: "Kit Skincare Coreano 5 Passos",
    categoria: "beleza",
    desc: "Rotina completa com tônico, essência, sérum, hidratante e protetor solar. Pele visivelmente transformada em 30 dias.",
    emoji: "🌸",
    img: "",
    preco: "R$89,90",
    precoOld: "R$149,90",
    desconto: "-40%",
    loja: "ml",
    link: "https://www.mercadolivre.com.br/social/gpa_afiliadobr"
  },
  {
    id: 6,
    nome: "Máscara Capilar Hidratação Intensa 500g",
    categoria: "beleza",
    desc: "Máscara de nutrição profunda para cabelos secos e danificados. Com keratina e óleo de argan. Resultado de salão em casa.",
    emoji: "💆",
    img: "",
    preco: "R$44,90",
    precoOld: "R$74,90",
    desconto: "-40%",
    loja: "amazon",
    link: "https://amzn.to/4esgWw9"
  },

  // ── PET ──────────────────────────────────────────────────
  {
    id: 7,
    nome: "Caminha Pet Luxo Tamanho M",
    categoria: "pet",
    desc: "Cama macia e confortável para cães e gatos de até 10kg. Material lavável, antialérgico e base antiderrapante.",
    emoji: "🐾",
    img: "",
    preco: "R$79,90",
    precoOld: "R$129,90",
    desconto: "-38%",
    loja: "ml",
    link: "https://www.mercadolivre.com.br/social/gpa_afiliadobr"
  },
  {
    id: 8,
    nome: "Kit Petisco Natural para Cães 3 Sabores",
    categoria: "pet",
    desc: "Snacks saudáveis sem corantes ou conservantes. Frango, carne e fígado. Ideal para adestramento e recompensa.",
    emoji: "🦴",
    img: "",
    preco: "R$34,90",
    precoOld: "R$54,90",
    desconto: "-36%",
    loja: "amazon",
    link: "https://amzn.to/4esgWw9"
  }
];
// ============================================================

const lojaLabel = {
  ml:     { label: "Mercado Livre", class: "btn-ml tag-ml modal-ml" },
  shopee: { label: "Shopee",        class: "btn-shopee tag-shopee" },
  amazon: { label: "Amazon",        class: "btn-amazon tag-amazon" }
};

let currentCat = "todos";

function catName(c) {
  const m = {
    fitness: "🏋️ Fitness",
    beleza:  "💄 Beleza",
    pet:     "🐾 Pet"
  };
  return m[c] || c;
}

function productThumb(p) {
  if (p.img) {
    return `<img src="${p.img}" alt="${p.nome}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span style="display:none;font-size:56px;align-items:center;justify-content:center;width:100%;height:100%">${p.emoji}</span>`;
  }
  return `<span style="font-size:56px">${p.emoji}</span>`;
}

function productModalThumb(p) {
  if (p.img) {
    return `<img src="${p.img}" alt="${p.nome}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span style="display:none;font-size:72px;align-items:center;justify-content:center;width:100%;height:100%">${p.emoji}</span>`;
  }
  return `<span style="font-size:72px">${p.emoji}</span>`;
}

function renderProducts(list) {
  const grid = document.getElementById("productsGrid");

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray)">Nenhum produto encontrado.</div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card" onclick="openModal(${p.id})">
      <div class="product-img">
        ${productThumb(p)}
        <span class="product-store-tag tag-${p.loja}">
          ${p.loja === 'ml' ? 'Mercado Livre' : p.loja.charAt(0).toUpperCase() + p.loja.slice(1)}
        </span>
        ${p.desconto ? `<span class="discount-tag">${p.desconto}</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-cat">${catName(p.categoria)}</div>
        <div class="product-name">${p.nome}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price-wrap">
            ${p.precoOld ? `<div class="product-price-old">${p.precoOld}</div>` : ''}
            <div class="product-price">${p.preco}</div>
          </div>
          <a class="btn-buy btn-${p.loja}" href="${p.link}" target="_blank" rel="noopener" onclick="showToast(event)">
            Comprar
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCat(cat) {
  currentCat = cat;

  document.querySelectorAll('.cat-btn, nav a').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(b => {
    if (cat === 'todos' && b.textContent.trim() === 'Todos') b.classList.add('active');
    else if (b.textContent.toLowerCase().includes(cat)) b.classList.add('active');
  });

  const filtered = cat === 'todos' ? produtos : produtos.filter(p => p.categoria === cat);
  const search   = document.getElementById('searchInput').value.toLowerCase();

  renderProducts(
    search
      ? filtered.filter(p =>
          p.nome.toLowerCase().includes(search) ||
          p.desc.toLowerCase().includes(search)
        )
      : filtered
  );
}

function searchProducts() {
  const q    = document.getElementById('searchInput').value.toLowerCase();
  const base = currentCat === 'todos' ? produtos : produtos.filter(p => p.categoria === currentCat);

  renderProducts(
    q
      ? base.filter(p =>
          p.nome.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
        )
      : base
  );
}

function openModal(id) {
  const p = produtos.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalImg').innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    ${productModalThumb(p)}
  `;
  document.getElementById('modalCat').textContent      = catName(p.categoria);
  document.getElementById('modalName').textContent     = p.nome;
  document.getElementById('modalDesc').textContent     = p.desc;
  document.getElementById('modalPrice').textContent    = p.preco;
  document.getElementById('modalPriceOld').textContent = p.precoOld || '';
  document.getElementById('modalDiscount').textContent = p.desconto || '';

  const lojaInfo = {
    ml:     { cor: '#ffe600', txt: '#333', nome: 'Mercado Livre' },
    shopee: { cor: '#ff6633', txt: '#fff', nome: 'Shopee' },
    amazon: { cor: '#ff9900', txt: '#fff', nome: 'Amazon' }
  };
  const l = lojaInfo[p.loja];

  document.getElementById('modalActions').innerHTML = `
    <a class="modal-btn" href="${p.link}" target="_blank" rel="noopener"
       style="background:${l.cor};color:${l.txt}" onclick="showToast(event)">
      🛒 Comprar no ${l.nome}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
    <button class="modal-btn" onclick="closeModalDirect()"
            style="background:var(--dark3);color:var(--gray);border:1px solid rgba(255,255,255,0.1)">
      Fechar
    </button>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showToast(e) {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Init ──
renderProducts(produtos);
