document.addEventListener('DOMContentLoaded', function () {
  function getMaxCount() {
    const w = window.innerWidth;
    if (w < 576) return 4;      // Pequenas
    if (w < 992) return 7;      // Médias
    return 12;                  // Grandes
  }

  function getGrupoMaxCount() {
    const w = window.innerWidth;
    if (w < 576) return 1;      // Pequenas
    if (w < 992) return 2;      // Médias
    return 3;                   // Grandes
  }

  function renderButtons(containerId, items, btnClass, isTag, isGrupo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Cria todos os botões, só exibe os que cabem na linha
    let tempBtns = [];
    for (let i = 0; i < items.length; i++) {
      const btn = document.createElement('button');
      btn.className = btnClass;
      btn.type = 'button';
      if (isTag) {
        btn.setAttribute('data-href', `/tag/${items[i].slug || items[i].id}`);
        btn.textContent = items[i].traducoes && items[i].traducoes[0]
          ? items[i].traducoes[0].nome_tag
          : (items[i].nome_tag || items[i].nome);
      } else if (isGrupo) {
        btn.setAttribute('data-href', `/grupos/${items[i].id_grupo}`);
        btn.textContent = items[i].nome_grupo;
      } else {
        btn.textContent = items[i].nome_categoria;
      }
      btn.style.visibility = 'hidden';
      container.appendChild(btn);
      tempBtns.push(btn);
    }

    // Mede quantos cabem
    let totalWidth = 0;
    const containerWidth = container.offsetWidth || container.parentElement.offsetWidth;
    let maxCount = 0;
    for (let i = 0; i < tempBtns.length; i++) {
      totalWidth += tempBtns[i].offsetWidth + 12;
      if (totalWidth > containerWidth) break;
      maxCount++;
    }

    // Limpa e renderiza só os que cabem
    container.innerHTML = '';
    for (let i = 0; i < Math.max(1, maxCount); i++) {
      const btn = tempBtns[i];
      btn.style.visibility = '';
      container.appendChild(btn);
    }
  }

  // Renderização dos grupos na linha do feed
  function renderGruposLinha(grupos, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !grupos || !grupos.length) return;
    container.innerHTML = '';
    const maxCount = getGrupoMaxCount();
    for (let i = 0; i < Math.min(maxCount, grupos.length); i++) {
      const card = document.createElement('div');
      card.className = 'grupo-feed-card d-flex flex-column align-items-center me-2';
      card.style.width = '90px';
      card.innerHTML = `
        <img src="${grupos[i].foto_grupo || '/images/default-group.png'}" alt="${grupos[i].nome_grupo}" class="rounded-circle mb-1" width="48" height="48">
        <div class="fw-bold text-truncate" style="max-width:80px;">${grupos[i].nome_grupo}</div>
      `;
      card.setAttribute('data-href', `/grupos/${grupos[i].id_grupo}`);
      container.appendChild(card);
    }
  }

  // Renderização de todos os grupos no painel
  function renderGruposPainel(grupos, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !grupos || !grupos.length) return;
    container.innerHTML = '';
    grupos.forEach(grupo => {
      const card = document.createElement('div');
      card.className = 'grupo-feed-card d-flex flex-column align-items-center m-2';
      card.style.width = '90px';
      card.innerHTML = `
        <img src="${grupo.foto_grupo || '/images/default-group.png'}" alt="${grupo.nome_grupo}" class="rounded-circle mb-1" width="48" height="48">
        <div class="fw-bold text-truncate" style="max-width:80px;">${grupo.nome_grupo}</div>
      `;
      card.setAttribute('data-href', `/grupos/${grupo.id_grupo}`);
      container.appendChild(card);
    });
  }

  // Inicialização e responsividade
  function updateVisibleItems() {
    if (window.categoriasData) {
      renderButtons('categorias-linha', window.categoriasData, 'categoria-btn', false, false);
    }
    if (window.tagsData) {
      renderButtons('tags-linha', window.tagsData, 'tag-btn', true, false);
    }
    if (window.gruposData) {
      renderButtons('grupos-linha', window.gruposData, 'grupo-btn', false, true);
    }
  }

  // Dados vindos do backend (inseridos pelo servidor)
  window.categoriasData = window.categoriasData || [];
  window.tagsData = window.tagsData || [];
  window.gruposData = window.gruposData || [];

  // Preencher dados do backend se não vierem
  if (!window.categoriasData.length) {
    const catBtns = document.querySelectorAll('.categorias-side-panel .categoria-btn');
    window.categoriasData = Array.from(catBtns).map(btn => ({ nome_categoria: btn.textContent }));
  }
  if (!window.tagsData.length) {
    const tagBtns = document.querySelectorAll('.tags-side-panel .tag-btn');
    window.tagsData = Array.from(tagBtns).map(btn => ({
      nome_tag: btn.textContent,
      slug: btn.getAttribute('data-href') ? btn.getAttribute('data-href').replace('/tag/', '') : ''
    }));
  }
  if (!window.gruposData.length) {
    const grupoBtns = document.querySelectorAll('.grupos-side-panel .grupo-btn');
    window.gruposData = Array.from(grupoBtns).map(btn => ({
      nome_grupo: btn.textContent,
      id_grupo: btn.getAttribute('data-href') ? btn.getAttribute('data-href').replace('/grupos/', '') : ''
    }));
  }

  updateVisibleItems();
  window.addEventListener('resize', updateVisibleItems);

  // Painéis de overflow
  function painelToggle(linkId, painelClass, fecharId) {
    const link = document.getElementById(linkId);
    const painel = document.querySelector(painelClass);
    const fechar = document.getElementById(fecharId);
    if (link && painel) {
      link.addEventListener('click', function() {
        painel.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    }
    if (fechar && painel) {
      fechar.addEventListener('click', function() {
        painel.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  }
  painelToggle('link-visualizar-todas-categorias', '.categorias-side-panel', 'link-fechar-categorias');
  painelToggle('link-visualizar-todas-tags', '.tags-side-panel', 'link-fechar-tags');
  painelToggle('link-visualizar-todos-grupos', '.grupos-side-panel', 'link-fechar-grupos');

  // Clique nos botões para navegar
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tag-btn') && e.target.dataset.href) {
      window.location.href = e.target.dataset.href;
    }
    if (e.target.classList.contains('categoria-btn')) {
      const nome = encodeURIComponent(e.target.textContent.trim());
      window.location.href = `/categoria/${nome}`;
    }
    if (e.target.classList.contains('grupo-btn') && e.target.dataset.href) {
      window.location.href = e.target.dataset.href;
    }
  });

  // Clique nos cards de grupo
  document.addEventListener('click', function(e) {
    if (e.target.closest('.grupo-feed-card') && e.target.closest('.grupo-feed-card').dataset.href) {
      window.location.href = e.target.closest('.grupo-feed-card').dataset.href;
    }
  });

  // Detecta e renderiza cada linha de grupos no feed
  document.querySelectorAll('#grupos-feed-linha').forEach(function(linha) {
    const grupos = JSON.parse(linha.getAttribute('data-grupos'));
    renderGruposLinha(grupos, linha.id);
    // Botão visualizar mais
    const btnMais = linha.parentElement.parentElement.querySelector('#link-visualizar-mais-grupos-feed');
    const painel = document.querySelector('.grupos-feed-panel');
    if (btnMais && painel) {
      btnMais.addEventListener('click', function() {
        painel.style.display = 'block';
        document.body.style.overflow = 'hidden';
        renderGruposPainel(grupos, 'grupos-feed-panel-list');
      });
    }
    const btnFechar = document.getElementById('link-fechar-grupos-feed');
    if (btnFechar && painel) {
      btnFechar.addEventListener('click', function() {
        painel.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  });

  window.addEventListener('resize', function() {
    document.querySelectorAll('#grupos-feed-linha').forEach(function(linha) {
      const grupos = JSON.parse(linha.getAttribute('data-grupos'));
      renderGruposLinha(grupos, linha.id);
    });
  });

  function mostrarCardFlutuante() {
    document.getElementById('card-flutuante-login').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  document.getElementById('fechar-card-flutuante').onclick = function() {
    document.getElementById('card-flutuante-login').style.display = 'none';
    document.body.style.overflow = '';
  };

  // Exemplo: bloquear ações restritas
  document.addEventListener('click', function(e) {
    if (!window.usuarioLogado && e.target.classList.contains('acao-restrita')) {
      e.preventDefault();
      mostrarCardFlutuante();
    }
  });

  window.usuarioLogado = !!window.usuarioLogado;
});