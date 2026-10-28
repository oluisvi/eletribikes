(() => {
  const project = window.PROJECT;
  const $ = (selector) => document.querySelector(selector);
  let direction = Math.min(2, Math.max(0, Number(new URLSearchParams(window.location.search).get('direction')) || 0));
  let category = 'Todos';
  let searchTerm = '';
  let babyCategory = 'Todas';
  let babySearchTerm = '';
  const chosen = new Set();
  const favorites = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
  const whatsapp = (product) => `https://wa.me/${project.phone}?text=${encodeURIComponent(`Oi! Vi ${product ? `o modelo ${product.name}` : 'o catálogo'} e queria tirar uma dúvida.`)}`;
  document.querySelectorAll('.wa-link').forEach((link) => { link.href = whatsapp(); });

  let revealObserver = null;
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.body.classList.add('motion-ready');
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  }

  function watchReveals(root = document) {
    if (!revealObserver) return;
    root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((element) => revealObserver.observe(element));
  }

  function renderHero() {
    const featured = project.products[0];
    if (project.dir === 'eletribikes-paulimar') {
      if (direction === 0) return `<section class="hero split dual"><div class="hero-copy"><p class="kicker">${project.eyebrow}</p><h1>Uma marca.<br><em>Um caminho.</em></h1><p>${project.lead}</p><div class="door-grid"><button type="button" data-brand="eletri">EletriBikes <span>Bikes elétricas ↗</span></button><button type="button" data-brand="baby">PaulimarBaby <span>Infantil ↗</span></button></div></div><div class="hero-photo"><img src="images/flash-r002.webp" alt="Bicicleta elétrica Flash R002, fotografia oficial do fabricante" width="900" height="720" fetchpriority="high"><small>Mobilidade · foto oficial Flash</small></div></section>`;
      if (direction === 1) return `<section class="hero stacked dual"><div class="hero-photo"><img src="images/flash-x20.webp" alt="Bicicleta elétrica Flash X20 Pro, fotografia oficial do fabricante" width="900" height="720" fetchpriority="high"></div><div class="hero-copy"><p class="kicker">${project.eyebrow}</p><h1>EletriBikes<br><em>e PaulimarBaby.</em></h1><p>${project.lead}</p><div class="door-grid"><button type="button" data-brand="eletri">Ver bicicletas <span>EletriBikes ↗</span></button><button type="button" data-brand="baby">Ver categorias <span>PaulimarBaby ↗</span></button></div></div></section>`;
      return `<section class="hero guided dual"><div class="hero-copy"><p class="kicker">POR ONDE VOCÊ QUER COMEÇAR?</p><h1>Escolha a<br><em>marca.</em></h1><p>Os dois catálogos ficam organizados por interesse, com contato claro para cada conversa.</p></div><div class="brand-tiles"><button type="button" data-brand="eletri"><img src="images/flash-r002.webp" alt="Bicicleta elétrica Flash R002" width="900" height="720" fetchpriority="high"><span>01 / MOBILIDADE</span><b>EletriBikes ↗</b></button><button type="button" data-brand="baby"><span class="baby-symbol" aria-hidden="true">P<span>BABY</span></span><span>02 / INFANTIL</span><b>PaulimarBaby ↗</b></button></div></section>`;
    }

    if (direction === 0) return `<section class="hero split"><div class="hero-copy"><p class="kicker">${project.eyebrow} · ${project.place}</p><h1>${project.headline}</h1><p>${project.lead}</p><div class="hero-actions"><a class="button dark" href="#catalogo">Ver catálogo ↓</a><a class="text-link wa-link" href="${whatsapp()}" target="_blank" rel="noreferrer">Conversar com a equipe ↗</a></div><span class="hero-mark">01 — ${project.brand}</span></div><div class="hero-photo"><img src="images/${featured.img}" alt="${featured.alt}" width="900" height="720" fetchpriority="high"><small>${featured.name} · foto da linha</small></div></section>`;
    if (direction === 1) return `<section class="hero stacked"><div class="hero-photo"><img src="images/${featured.img}" alt="${featured.alt}" width="1200" height="780" fetchpriority="high"><span class="photo-title">${project.brand.split(' ')[0]}<br><i>em movimento.</i></span></div><div class="hero-copy"><p class="kicker">${project.eyebrow}</p><h1>${project.headline}</h1><p>${project.lead}</p><a class="button dark" href="#catalogo">Explorar modelos ↘</a><span class="hero-mark">${project.place}</span></div></section>`;
    return `<section class="hero guided"><div class="hero-copy"><p class="kicker">${project.eyebrow}</p><h1>O que faz parte da sua rotina?</h1><p>Comece pelo tipo de veículo, compare detalhes e leve sua dúvida à equipe.</p></div><div class="guide-choices">${project.categories.filter((item) => item !== 'Todos').map((item, index) => `<button type="button" data-category="${item}"><span>0${index + 1}</span><b>${item}</b><i>Explorar ↗</i></button>`).join('')}<a class="guide-photo" href="#catalogo"><img src="images/${featured.img}" alt="${featured.alt}" width="640" height="520"></a></div></section>`;
  }

  function renderDesignOptions() {
    $('#designOptions').innerHTML = project.directions.map((item, index) => `<button class="design-option" type="button" data-design="${index}" aria-pressed="${direction === index}" aria-label="Usar direção ${index + 1}: ${item[0]}"><span>DESIGN 0${index + 1}</span><b>${item[0]}</b></button>`).join('');
  }

  function renderProductCards() {
    const query = normalize(searchTerm);
    const products = project.products.filter((item) => (category === 'Todos' || item.category === category)
      && (!query || normalize(`${item.name} ${item.category} ${item.detail}`).includes(query)));
    $('#productGrid').innerHTML = products.length ? products.map((item) => `<article class="product-card" data-reveal><a class="photo" href="${whatsapp(item)}" target="_blank" rel="noreferrer" aria-label="Perguntar sobre ${item.name}"><img src="images/${item.img}" alt="${item.alt}" width="720" height="540" loading="lazy" decoding="async"><span class="photo-index">${item.category.toUpperCase()}</span></a><div class="product-info"><p class="kicker">${item.category.toUpperCase()}</p><h3>${item.name}</h3><p>${item.detail}</p><div class="card-actions"><a href="${whatsapp(item)}" target="_blank" rel="noreferrer">Perguntar sobre este modelo ↗</a><button class="favorite" type="button" data-fav="${item.name}" aria-label="${favorites.has(item.name) ? 'Remover dos' : 'Adicionar aos'} favoritos: ${item.name}" aria-pressed="${favorites.has(item.name)}">${favorites.has(item.name) ? '♥' : '♡'}</button><label class="pick"><input type="checkbox" data-pick="${item.name}" ${chosen.has(item.name) ? 'checked' : ''}> Comparar</label></div></div></article>`).join('') : '<p class="empty" role="status">Não encontramos produtos com essa busca. Tente outro termo ou limpe os filtros.</p>';
    $('#resultCount').textContent = `${products.length} ${products.length === 1 ? 'modelo' : 'modelos'}`;
    watchReveals($('#productGrid'));
  }

  function renderProductFilters() {
    $('#filters').innerHTML = project.categories.map((item) => `<button class="filter" type="button" data-filter="${item}" aria-pressed="${category === item}">${item}</button>`).join('');
  }

  function renderBabyArea() {
    if (project.dir !== 'eletribikes-paulimar') {
      $('#brandArea').innerHTML = '';
      return;
    }
    const representedCategories = [...new Set(project.babyProducts.map((item) => item.category))];
    const unrepresentedCategories = project.babyCategories.filter((item) => !representedCategories.includes(item));
    $('#brandArea').innerHTML = `<section class="brand-area"><div class="baby-panel" data-reveal><div><p class="kicker">PAULIMARBABY</p><h2>Um catálogo próprio para o universo infantil.</h2><p>O catálogo tem várias seções: jogos de quarto 2025, berços de madeira e portáteis, banheiras, cadeirinhas, carrinhos e bebê reborn.</p><p class="photo-note">As fotos dos cartões abaixo foram tiradas do catálogo compartilhado. Valores, acabamentos e disponibilidade precisam ser confirmados.</p><a class="button dark" href="${whatsapp({ name: 'PaulimarBaby' })}" target="_blank" rel="noreferrer">Perguntar à PaulimarBaby ↗</a><a class="text-link" href="https://linktr.ee/paulimarbaby" target="_blank" rel="noreferrer">Contatos por cidade ↗</a></div><div class="baby-mark" aria-hidden="true">P<span>desde 1994</span></div></div><div class="baby-catalog" id="baby-catalog"><div class="section-head"><div><p class="kicker">PAULIMARBABY · CATÁLOGO</p><h2>Um cantinho para cada fase.</h2></div><p>Seções do WhatsApp; esta prévia mostra exemplos com fotos disponíveis.</p></div><div class="baby-tools"><div class="filters baby-filters" id="babyFilters" role="group" aria-label="Filtrar produtos PaulimarBaby"></div><label class="search baby-search"><span aria-hidden="true">⌕</span><input id="babySearch" type="search" placeholder="Buscar produto ou categoria" aria-label="Buscar no catálogo PaulimarBaby" value="${babySearchTerm.replaceAll('"', '&quot;')}"></label><span class="result-count" id="babyResultCount" role="status" aria-live="polite"></span></div><div class="baby-product-grid" id="babyProductGrid"></div><p class="baby-availability-note">Outras seções no catálogo do WhatsApp: ${unrepresentedCategories.join(', ')}. Os itens dessas categorias não estão incluídos nesta prévia.</p></div><div class="brand-foot"><span>ELETRIBIKES · @eletribikes</span><span>PAULIMARBABY · LINKTREE / WHATSAPP</span><span>CATÁLOGO COMPARTILHADO NO MESMO CONTATO</span></div></section>`;
    renderBabyFilters();
    renderBabyProducts();
    watchReveals($('#brandArea'));
  }

  function renderBabyFilters() {
    const categories = ['Todas', ...new Set(project.babyProducts.map((item) => item.category))];
    $('#babyFilters').innerHTML = categories.map((item) => `<button class="filter" type="button" data-baby-filter="${item}" aria-pressed="${babyCategory === item}">${item}</button>`).join('');
  }

  function renderBabyProducts() {
    const query = normalize(babySearchTerm);
    const products = project.babyProducts.filter((item) => (babyCategory === 'Todas' || item.category === babyCategory)
      && (!query || normalize(`${item.name} ${item.category} ${item.desc}`).includes(query)));
    $('#babyProductGrid').innerHTML = products.length ? products.map((item) => `<article class="product-card baby-product" data-reveal><a class="photo" href="${whatsapp({ name: item.name })}" target="_blank" rel="noreferrer" aria-label="Consultar ${item.name}"><img src="images/${item.img}" alt="${item.name} — foto do catálogo WhatsApp PaulimarBaby" width="640" height="480" loading="lazy" decoding="async"><span class="photo-index">${item.category.toUpperCase()}</span></a><div class="product-info"><p class="kicker">${item.category.toUpperCase()}</p><h3>${item.name}</h3><p>${item.desc}</p><div class="card-actions"><span class="baby-price">${item.price}<small>no catálogo compartilhado</small></span><a href="${whatsapp({ name: item.name })}" target="_blank" rel="noreferrer">Consultar ↗</a></div></div></article>`).join('') : '<p class="empty" role="status">Não encontramos itens com essa busca. Tente outro termo ou limpe os filtros.</p>';
    $('#babyResultCount').textContent = `${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`;
    watchReveals($('#babyProductGrid'));
  }

  function updateComparisonCount() {
    $('#compareCount').textContent = String(chosen.size);
  }

  function render() {
    document.body.dataset.direction = String(direction);
    renderDesignOptions();
    $('#experience').innerHTML = renderHero();
    $('#experience').firstElementChild?.setAttribute('data-reveal', '');
    renderProductFilters();
    $('#search').value = searchTerm;
    renderProductCards();
    renderBabyArea();
    updateComparisonCount();
    document.querySelectorAll('.wa-link').forEach((link) => { if (!link.href || link.getAttribute('href') === '#') link.href = whatsapp(); });
    watchReveals($('#experience'));
  }

  function selectDirection(nextDirection) {
    direction = nextDirection;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('direction', String(direction));
    window.history.replaceState({}, '', nextUrl);
    render();
    document.querySelector(`[data-design="${direction}"]`)?.focus({ preventScroll: true });
  }

  document.addEventListener('click', (event) => {
    const design = event.target.closest('[data-design]');
    if (design) { selectDirection(Number(design.dataset.design)); return; }
    const filter = event.target.closest('[data-filter]');
    if (filter) { category = filter.dataset.filter; renderProductFilters(); renderProductCards(); return; }
    const babyFilter = event.target.closest('[data-baby-filter]');
    if (babyFilter) { babyCategory = babyFilter.dataset.babyFilter; renderBabyFilters(); renderBabyProducts(); return; }
    const categoryShortcut = event.target.closest('[data-category]');
    if (categoryShortcut) { category = categoryShortcut.dataset.category; renderProductFilters(); renderProductCards(); $('#catalogo').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); return; }
    const brand = event.target.closest('[data-brand]');
    if (brand) {
      const target = brand.dataset.brand === 'eletri' ? '#catalogo' : '#baby-catalog';
      if (brand.dataset.brand === 'eletri') { category = 'Todos'; renderProductFilters(); renderProductCards(); }
      document.querySelector(target)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const favorite = event.target.closest('[data-fav]');
    if (favorite) {
      const name = favorite.dataset.fav;
      favorites.has(name) ? favorites.delete(name) : favorites.add(name);
      renderProductCards();
    }
  });

  document.addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-pick]');
    if (!checkbox) return;
    checkbox.checked ? chosen.add(checkbox.dataset.pick) : chosen.delete(checkbox.dataset.pick);
    updateComparisonCount();
  });

  $('#search').addEventListener('input', (event) => { searchTerm = event.target.value; renderProductCards(); });
  document.addEventListener('input', (event) => {
    if (event.target.id === 'babySearch') { babySearchTerm = event.target.value; renderBabyProducts(); }
  });

  $('#compare').addEventListener('click', () => {
    const selected = project.products.filter((item) => chosen.has(item.name));
    $('#compareTable').innerHTML = selected.length ? `<div class="compare-table">${selected.map((item) => `<article><img src="images/${item.img}" alt="${item.alt}" width="420" height="315" loading="lazy"><h3>${item.name}</h3><p>${item.detail}</p><a href="${whatsapp(item)}" target="_blank" rel="noreferrer">Perguntar ↗</a></article>`).join('')}</div>` : '<p>Marque “Comparar” em dois ou mais modelos para ver lado a lado.</p>';
    $('#compareDialog').showModal();
  });

  render();
})();
