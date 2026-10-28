(() => {
  const phone = '5527997148456';
  const products = [
    {name:'FLASH R002 2027',image:'images/flash-r002.webp',alt:'Bicicleta elétrica Flash R002, foto oficial do fabricante',kind:'Modelo R002',detail:'No material compartilhado pela loja: motor informado de 1000 W, bateria removível de 48 V / 15 Ah, velocidade indicada de até 32 km/h e autonomia anunciada de 40–60 km. Confirme a ficha da versão atual.'},
    {name:'FLASH X20 PRO',image:'images/flash-x20.webp',alt:'Bicicleta elétrica Flash X20 Pro, foto oficial do fabricante',kind:'Modelo X20 Pro',detail:'No material compartilhado pela loja: motor informado de 1000 W, pneus largos e autonomia anunciada de até 60 km. Confirme a ficha da versão atual.'}
  ];
  const designs = ['Editorial','Trajeto','Ficha'];
  const params = new URLSearchParams(location.search);
  let currentStyle = Math.min(2,Math.max(0,Number(params.get('design'))||0));
  let activeFilter = 'Todos';
  let searchTerm = '';
  const selected = new Set();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector,root=document) => root.querySelector(selector);
  const wa = (product) => 'https://wa.me/'+phone+'?text='+encodeURIComponent('Oi! Vi o catálogo da EletriBikes e gostaria de saber mais sobre '+(product ? 'o modelo '+product+'.' : 'os modelos.'));
  document.querySelectorAll('.wa-link').forEach((link)=>{link.href=wa();});

  function renderHero(){
    if(currentStyle===1){
      return '<div class="hero-photo"><img src="images/flash-r002-trilha.webp" alt="Bicicleta elétrica Flash R002 em ambiente externo, imagem oficial de fabricante" width="1200" height="900" fetchpriority="high"><span class="photo-caption">FLASH R002 · IMAGEM DO FABRICANTE</span></div><div class="hero-copy"><p class="eyebrow">BICICLETAS ELÉTRICAS · ELETRIBIKES</p><h1 id="hero-title">Seu próximo caminho, <em>em movimento.</em></h1><p>Explore dois modelos de referência e veja o que vale perguntar antes de escolher. A equipe confirma especificações e disponibilidade.</p><div class="hero-actions"><a class="button" href="#modelos">Ver modelos <span aria-hidden="true">↓</span></a><a class="text-link wa-link" href="'+wa()+'" target="_blank" rel="noopener noreferrer">Conversar com a loja ↗</a></div></div>';
    }
    if(currentStyle===2){
      return '<div class="hero-copy"><p class="eyebrow">ELETRIBIKES / CATÁLOGO DE MODELOS</p><h1 id="hero-title">Escolha com <em>informação.</em></h1><p>Uma prévia para consultar os modelos em um lugar só, comparar o que interessa e seguir a conversa pelo WhatsApp.</p><div class="hero-actions"><a class="button" href="#modelos">Consultar fichas ↓</a><a class="text-link wa-link" href="'+wa()+'" target="_blank" rel="noopener noreferrer">Perguntar à equipe ↗</a></div><div class="hero-stats"><div>CATÁLOGO<span>Modelos de referência</span></div><div>CONTATO<b>Atendimento da loja</b></div></div></div><aside class="hero-aside"><img src="images/flash-x20.webp" alt="Bicicleta elétrica Flash X20 Pro, foto oficial do fabricante" width="800" height="900" fetchpriority="high"><p>Imagem oficial do fabricante. Consulte a loja para confirmar versão, informações e disponibilidade.</p></aside>';
    }
    return '<div class="hero-copy"><p class="eyebrow">ELETRIBIKES · BIKES ELÉTRICAS</p><h1 id="hero-title">Mais perto do seu <em>próximo trajeto.</em></h1><p>Descubra os modelos, compare informações importantes e fale com a equipe sobre o que combina com o seu uso.</p><div class="hero-actions"><a class="button" href="#modelos">Explorar modelos ↓</a><a class="text-link wa-link" href="'+wa()+'" target="_blank" rel="noopener noreferrer">Conversar com a loja ↗</a></div><div class="hero-meta"><span>FICHAS DE MODELOS</span><span>CONSULTA DIRETA</span></div></div><div class="hero-photo"><img src="images/flash-r002.webp" alt="Bicicleta elétrica Flash R002, foto oficial do fabricante" width="1000" height="800" fetchpriority="high"><span class="photo-caption">FLASH R002 · FOTO OFICIAL</span></div>';
  }

  function renderDesignState(){
    document.body.dataset.style=String(currentStyle);
    document.querySelectorAll('.design-switch button[data-style]').forEach((button)=>button.setAttribute('aria-pressed',String(Number(button.dataset.style)===currentStyle)));
    const next=new URL(location.href); next.searchParams.set('design',String(currentStyle)); history.replaceState({},'',next);
    $('#hero').innerHTML=renderHero();
    document.querySelectorAll('.wa-link').forEach((link)=>{if(!link.getAttribute('href')||link.getAttribute('href')==='#')link.href=wa();});
  }

  function renderFilters(){
    const options=['Todos',...products.map((product)=>product.name)];
    $('#model-filters').innerHTML=options.map((item)=>'<button type="button" class="filter-button" data-filter="'+item+'" aria-pressed="'+String(activeFilter===item)+'">'+(item==='Todos'?'Todos os modelos':item)+'</button>').join('');
  }

  function renderProducts(){
    const query=searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    const filtered=products.filter((product)=>(activeFilter==='Todos'||product.name===activeFilter)&&(!query||(product.name+' '+product.kind+' '+product.detail).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query)));
    $('#result-status').textContent=filtered.length+' '+(filtered.length===1?'modelo':'modelos');
    $('#product-grid').innerHTML=filtered.length?filtered.map((product)=>'<article class="product-card"><div class="product-media"><img src="'+product.image+'" alt="'+product.alt+'" width="900" height="700" loading="lazy" decoding="async"><span class="photo-caption">'+product.kind.toUpperCase()+'</span></div><div class="product-body"><p class="product-kicker">BICICLETA ELÉTRICA · '+product.kind+'</p><h3>'+product.name+'</h3><p>'+product.detail+'</p><div class="product-actions"><a href="'+wa(product.name)+'" target="_blank" rel="noopener noreferrer">Perguntar sobre este modelo ↗</a><label><input type="checkbox" data-select="'+product.name+'" '+(selected.has(product.name)?'checked':'')+'> Comparar</label></div></div></article>').join(''):'<p class="empty-state">Nenhum modelo corresponde a essa busca. Limpe o filtro ou tente o nome do modelo.</p>';
    $('#compare-count').textContent=String(selected.size);
    $('#compare-button').disabled=selected.size<2;
  }

  document.addEventListener('click',(event)=>{
    const design=event.target.closest('.design-switch button[data-style]');
    if(design){currentStyle=Number(design.dataset.style);renderDesignState();design.focus({preventScroll:true});return;}
    const filter=event.target.closest('[data-filter]');
    if(filter){activeFilter=filter.dataset.filter;renderFilters();renderProducts();return;}
  });
  document.addEventListener('change',(event)=>{
    const checkbox=event.target.closest('[data-select]');
    if(!checkbox)return;
    checkbox.checked?selected.add(checkbox.dataset.select):selected.delete(checkbox.dataset.select);
    renderProducts();
  });
  $('#search').addEventListener('input',(event)=>{searchTerm=event.target.value;renderProducts();});
  $('#compare-button').addEventListener('click',()=>{
    const chosen=products.filter((product)=>selected.has(product.name));
    $('#compare-content').innerHTML='<div class="compare-list">'+chosen.map((product)=>'<article class="compare-item"><img src="'+product.image+'" alt="'+product.alt+'" width="720" height="500"><h3>'+product.name+'</h3><p>'+product.detail+'</p><a href="'+wa(product.name)+'" target="_blank" rel="noopener noreferrer">Perguntar à loja ↗</a></article>').join('')+'</div>';
    $('#compare-dialog').showModal();
  });
  window.addEventListener('popstate',()=>{const value=Number(new URLSearchParams(location.search).get('design'))||0;currentStyle=Math.min(2,Math.max(0,value));renderDesignState();});
  renderDesignState();renderFilters();renderProducts();
})();
