// ============================================================
// SEUS PRODUTOS — edite aqui para adicionar seus links de afiliado
// ============================================================
const produtos = [
  {
    id: 1,
    nome: "Whey Protein Isolado 900g",
    categoria: "saude",
    desc: "Proteína de alta qualidade para ganho de massa muscular. 30g de proteína por dose, sem lactose.",
    emoji: "💪",
    // ⬇️ COLE AQUI A URL DA IMAGEM DO PRODUTO (copie o link da foto na Amazon/ML)
    img: "",
    preco: "R$89,90",
    precoOld: "R$129,90",
    desconto: "-31%",
    loja: "ml",
    link: "https://www.mercadolivre.com.br/social/gpa_afiliadobr"
  },
  {
    id: 2,
    nome: "Fone Bluetooth 5.0 Premium",
    categoria: "eletronicos",
    desc: "Som estéreo de alta fidelidade, 30h de bateria, cancelamento de ruído e design premium.",
    emoji: "🎧",
    img: "",
    preco: "R$149,90",
    precoOld: "R$199,90",
    desconto: "-25%",
    loja: "shopee",
    link: "https://shopee.com.br/SEU_LINK_AFILIADO_AQUI"
  },
  {
    id: 3,
    nome: "Smartwatch Fit Pro",
    categoria: "esporte",
    desc: "Monitor cardíaco, GPS, 7 dias de bateria, resistente à água. Compatível com Android e iOS.",
    emoji: "⌚",
    img: "",
    preco: "R$199,90",
    precoOld: "R$299,90",
    desconto: "-33%",
    loja: "amazon",
    link: "https://amzn.to/4esgWw9"
  },
  {
    id: 4,
    nome: "Creatina Monohidratada 300g",
    categoria: "saude",
    desc: "Creatina pura para aumento de força e resistência muscular. Sem sabor, dissolve fácil.",
    emoji: "🏋️",
    img: "",
    preco: "R$59,90",
    precoOld: "R$79,90",
    desconto: "-25%",
    loja: "shopee",
    link: "https://shopee.com.br/SEU_LINK_AFILIADO_AQUI"
  },
  {
    id: 5,
    nome: "Kit Skincare Vitamina C",
    categoria: "beleza",
    desc: "Sérum + hidratante + protetor solar com vitamina C. Uniformiza o tom e ilumina a pele.",
    emoji: "✨",
    img: "",
    preco: "R$79,90",
    precoOld: "R$119,90",
    desconto: "-33%",
    loja: "amazon",
    link: "https://amzn.to/4esgWw9"
  },
  {
    id: 6,
    nome: "Airfryer Digital 5L",
    categoria: "casa",
    desc: "Fritadeira sem óleo com display digital, 8 funções, frituras crocantes com até 80% menos gordura.",
    emoji: "🍳",
    img: "",
    preco: "R$299,90",
    precoOld: "R$449,90",
    desconto: "-33%",
    loja: "ml",
    link: "https://www.mercadolivre.com.br/social/gpa_afiliadobr"
  },
  {
    id: 7,
    nome: "Câmera de Segurança WiFi",
    categoria: "casa",
    desc: "Resolução Full HD, visão noturna, detecção de movimento e acesso pelo celular em tempo real.",
    emoji: "📷",
    img: "",
    preco: "R$119,90",
    precoOld: "R$179,90",
    desconto: "-33%",
    loja: "shopee",
    link: "https://shopee.com.br/SEU_LINK_AFILIADO_AQUI"
  },
  {
    id: 8,
    nome: "Suplemento Ômega 3 120 cáps",
    categoria: "saude",
    desc: "Alta concentração de EPA e DHA, auxilia na saúde cardiovascular e reduz inflamações.",
    emoji: "🐟",
    img: "",
    preco: "R$44,90",
    precoOld: "R$69,90",
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
    saude:      "💊 Saúde",
    eletronicos:"📱 Eletrônicos",
    casa:       "🏠 Casa",
    esporte:    "🏋️ Esporte",
    beleza:     "💄 Beleza"
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
