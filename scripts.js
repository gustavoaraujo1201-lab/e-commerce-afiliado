// ============================================================
// scripts.js — Econofy
// Os produtos agora vêm da Vercel Function /api/produtos,
// que busca dados em tempo real na API do Mercado Livre.
// Para adicionar produtos: edite PRODUTOS_CURADOS em api/produtos.js
// ============================================================

const lojaLabel = {
  ml:     { label: "Mercado Livre", class: "btn-ml tag-ml modal-ml" },
  shopee: { label: "Shopee",        class: "btn-shopee tag-shopee"  }
};

let todosOsProdutos = [];
let currentCat      = "todos";
let carregando      = false;

function catName(c) {
  const m = { fitness: "🏋️ Fitness", beleza: "💄 Beleza", pet: "🐾 Pet" };
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

function renderSkeleton(qtd = 6) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = Array.from({ length: qtd }, () => `
    <div class="product-card skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-img"></div>
      <div class="product-body">
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

function renderProducts(list) {
  const grid  = document.getElementById("productsGrid");
  const count = document.getElementById("productsCount");
  if (count) count.textContent = `${list.length} produto${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">🔍</span>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente outra busca ou categoria.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card" onclick="openModal('${p.id}')" role="listitem" tabindex="0"
         onkeydown="if(event.key==='Enter')openModal('${p.id}')">
      <div class="product-img">
        ${productThumb(p)}
        <span class="product-store-tag tag-ml">Mercado Livre</span>
        ${p.desconto ? `<span class="discount-tag">${p.desconto}</span>` : ''}
        ${p.freeShipping ? `<span class="free-shipping-tag">🚚 Frete grátis</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-cat">${catName(p.categoria)}</div>
        <div class="product-name">${p.nome}</div>
        <div class="product-footer">
          <div class="product-price-wrap">
            ${p.precoOld ? `<div class="product-price-old">${p.precoOld}</div>` : ''}
            <div class="product-price">${p.preco}</div>
          </div>
          <a class="btn-buy btn-ml" href="${p.link}" target="_blank" rel="noopener sponsored"
             onclick="event.stopPropagation();showToast()">
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

function applyFilters() {
  const q    = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const qMob = (document.getElementById("searchInputMobile")?.value || "").toLowerCase();
  const query = q || qMob;

  let lista = currentCat === "todos"
    ? todosOsProdutos
    : todosOsProdutos.filter(p => p.categoria === currentCat);

  if (query) {
    lista = lista.filter(p =>
      p.nome.toLowerCase().includes(query) ||
      (p.desc && p.desc.toLowerCase().includes(query))
    );
  }
  renderProducts(lista);
}

function filterCat(cat) {
  currentCat = cat;
  document.querySelectorAll(".cat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
    b.setAttribute("aria-pressed", b.dataset.cat === cat);
  });
  document.querySelectorAll(".nav-desktop a, .mobile-nav-links a").forEach(a => {
    a.classList.toggle("active", a.dataset.cat === cat);
  });
  applyFilters();
}

function searchProducts()       { applyFilters(); }
function searchProductsMobile() { applyFilters(); }

function openModal(id) {
  const p = todosOsProdutos.find(x => x.id === id);
  if (!p) return;

  document.getElementById("modalImg").innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()" aria-label="Fechar">✕</button>
    ${productModalThumb(p)}
  `;
  document.getElementById("modalCat").textContent      = catName(p.categoria);
  document.getElementById("modalName").textContent     = p.nome;
  document.getElementById("modalDesc").textContent     = p.desc || p.nome;
  document.getElementById("modalPrice").textContent    = p.preco;
  document.getElementById("modalPriceOld").textContent = p.precoOld || "";
  document.getElementById("modalDiscount").textContent = p.desconto || "";

  document.getElementById("modalActions").innerHTML = `
    <a class="modal-btn" href="${p.link}" target="_blank" rel="noopener sponsored"
       style="background:#ffe600;color:#333" onclick="showToast()">
      🛒 Comprar no Mercado Livre
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
    ${p.freeShipping ? `<div style="text-align:center;font-size:13px;color:var(--green)">✅ Frete grátis neste produto</div>` : ""}
    <button class="modal-btn" onclick="closeModalDirect()"
            style="background:var(--dark3);color:var(--gray);border:1px solid rgba(255,255,255,0.1)">
      Fechar
    </button>
  `;

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function showToast() {
  const t = document.getElementById("toast");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function toggleMobileMenu() {
  const nav     = document.getElementById("mobileNav");
  const overlay = document.getElementById("mobileNavOverlay");
  const btn     = document.getElementById("btnHamburger");
  const open    = nav.classList.toggle("open");
  overlay.classList.toggle("open", open);
  btn.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function toggleMobileSearch() {
  const bar = document.getElementById("mobileSearchBar");
  const btn = document.getElementById("btnSearchMobile");
  const open = bar.classList.toggle("open");
  bar.setAttribute("aria-hidden", !open);
  btn.setAttribute("aria-expanded", open);
  if (open) document.getElementById("searchInputMobile")?.focus();
}

window.addEventListener("scroll", () => {
  document.getElementById("siteHeader")?.classList.toggle("scrolled", window.scrollY > 10);
  const btn = document.getElementById("backToTop");
  if (btn) btn.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });

async function carregarProdutos() {
  if (carregando) return;
  carregando = true;
  renderSkeleton(6);

  try {
    const res = await fetch("/api/produtos");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    todosOsProdutos = data.produtos || [];

    if (!todosOsProdutos.length) {
      document.getElementById("productsGrid").innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">📦</span>
          <h3>Nenhum produto cadastrado ainda</h3>
          <p>Adicione IDs de produtos em <code>api/produtos.js</code>.</p>
        </div>`;
      return;
    }

    applyFilters();
  } catch (err) {
    console.error("[Econofy] Erro ao carregar produtos:", err);
    document.getElementById("productsGrid").innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">⚠️</span>
        <h3>Erro ao carregar produtos</h3>
        <p>Verifique os logs da Vercel Function ou tente recarregar.</p>
      </div>`;
  } finally {
    carregando = false;
  }
}

// Init
carregarProdutos();
