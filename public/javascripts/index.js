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
      card.className = 'grupo-feed-card d-flex flex-column align-items-center me-2 acao-restrita';
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
      card.className = 'grupo-feed-card d-flex flex-column align-items-center m-2 acao-restrita';
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
  const btnFecharCard = document.getElementById('fechar-card-flutuante');
  if (btnFecharCard) {
    btnFecharCard.onclick = function() {
      document.getElementById('card-flutuante-login').style.display = 'none';
      document.body.style.overflow = '';
    };
  }

  // Exemplo: bloquear ações restritas
  document.addEventListener('click', function(e) {
    if (!window.usuarioLogado && e.target.classList.contains('acao-restrita')) {
      e.preventDefault();
      // Mostra aviso amigável
      alert('Você precisa estar logado para realizar esta ação. Faça login para continuar.');
      window.location.href = '/login';
    }
  });
  window.usuarioLogado = !!window.usuarioLogado;

  // No JS do modal
  async function preencherLocalizacao(lat, lng) {
    if (!lat || !lng) return '';
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.address ? `${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''}` : '';
  }

  // Função para abrir e preencher o modal da postagem
  async function abrirModalPostagem(post) {
    // Título
    document.getElementById('modalTitulo').textContent = post.titulo || 'Sem título';
    // Imagem
    const modalImagem = document.querySelector('#modalPostagem img.img-fluid');
    if (modalImagem) {
      if (post.url_midia) {
        modalImagem.src = post.url_midia;
        modalImagem.style.display = '';
      } else {
        modalImagem.src = '/images/default-post.png';
        modalImagem.style.display = '';
      }
    }
    // Conteúdo
    document.getElementById('modalConteudo').textContent = post.conteudo || post.resumo || '';
    // Categoria
    document.getElementById('modalCategoria').textContent = post.categoria ? post.categoria.nome_categoria : '';
    // Tags
    document.getElementById('modalTags').textContent = post.tag ? post.tag.nome_tag : '';
    // Data
    document.getElementById('modalData').textContent = post.data_criacao ? new Date(post.data_criacao).toLocaleString() : '';
    // Tipo
    document.getElementById('modalTipo').textContent = post.tipo_postagem || '';
    // Artigo científico
    document.getElementById('modalArtigo').textContent = post.artigo_cientifico ? 'Sim' : 'Não';
    // Localização (latitude/longitude → nome)
    if (post.latitude && post.longitude) {
      const local = await preencherLocalizacao(post.latitude, post.longitude);
      document.getElementById('modalLat').textContent = local || `${post.latitude}`;
      document.getElementById('modalLng').textContent = `${post.longitude}`;
    } else {
      document.getElementById('modalLat').textContent = '';
      document.getElementById('modalLng').textContent = '';
    }
    // Visualizações, curtidas, comentários (se existirem)
    document.getElementById('modalVisualizacoes').textContent = post.visualizacoes || 0;
    document.getElementById('modalCurtidas').textContent = post.curtidas || 0;
    // Comentários (se vierem do backend)
    const comentariosContainer = document.querySelector('.comentarios-container');
    if (comentariosContainer) {
      comentariosContainer.innerHTML = '';
      if (post.comentarios && post.comentarios.length) {
        post.comentarios.forEach(com => {
          const div = document.createElement('div');
          div.className = 'comentario mb-2 p-2 border rounded';
          div.innerHTML = `<b>${com.autor ? com.autor.nome_usuario : 'Anônimo'}:</b> ${com.conteudo}`;
          comentariosContainer.appendChild(div);
        });
      } else {
        comentariosContainer.innerHTML = '<span class="text-muted">Nenhum comentário.</span>';
      }
    }
    // Abre o modal (Bootstrap 5)
    const modal = new bootstrap.Modal(document.getElementById('modalPostagem'));
    modal.show();
  }

  // Detecta clique no card de postagem
  document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', function () {
      const id = card.getAttribute('data-id');
      // Busca o post nos dados globais (window.posts)
      const post = window.posts ? window.posts.find(p => p.id_postagem == id) : null;
      if (post) abrirModalPostagem(post);
    });
  });

  let categoriaSelecionada = '';
  let tagSelecionada = '';

  function renderPosts(posts) {
    const container = document.getElementById('feed-postagens');
    if (!container) return;
    if (!posts.length) {
      container.innerHTML = '<div class="alert alert-info text-center mt-4">Não há postagens para exibir.</div>';
      return;
    }
    container.innerHTML = posts.map(post => `
      <div class="card shadow-sm post-card mb-4" style="cursor:pointer;" data-id="${post.id_postagem}">
        <div class="card-body d-flex flex-column">
          ${post.autor && post.autor.foto_perfil ? `
            <a href="/usuarios/chogue_u-@-_${post.autor.id_usuario}">
              <img class="rounded-circle me-3" src="${post.autor.foto_perfil}" alt="${post.autor.nome_usuario}" width="48" height="48">
            </a>
          ` : ''}
          <h5 class="card-title">${post.titulo || 'Sem título'}</h5>
          <p class="card-text text-truncate">${post.resumo || 'Sem resumo'}</p>
          <small class="text-muted mb-2">
            Criado em: ${post.data_criacao ? new Date(post.data_criacao).toLocaleString() : 'N/A'}<br>
            Atualizado em: ${post.data_atualizacao ? new Date(post.data_atualizacao).toLocaleString() : 'N/A'}<br>
            Autor: ${post.autor ? post.autor.nome_usuario : 'Desconhecido'}
          </small>
          ${post.url_midia ? `
            <div class="w-100 mb-2">
              <img class="img-fluid d-block mx-auto" src="${post.url_midia}" alt="Imagem da postagem" style="max-width:100%;height:auto;">
            </div>
          ` : ''}
          <div class="mt-2">
            <button class="btn btn-outline-success btn-sm acao-restrita" type="button">
              <i class="fas fa-heart me-1"></i> Curtir
            </button>
            <span class="ms-2">
              <i class="fas fa-heart me-1"></i> ${post.curtidas || 0} curtidas
            </span>
            <span class="ms-2">
              <i class="fas fa-eye me-1"></i> ${post.visualizacoes || 0} visualizações
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  async function fetchAndRenderPosts() {
    let url = '/api/postagens';
    const params = [];
    if (categoriaSelecionada) params.push('categoria=' + encodeURIComponent(categoriaSelecionada));
    if (tagSelecionada) params.push('tag=' + encodeURIComponent(tagSelecionada));
    if (params.length) url += '?' + params.join('&');
    const res = await fetch(url);
    const posts = await res.json();
    renderPosts(posts);
  }

  document.querySelectorAll('.categoria-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      categoriaSelecionada = this.getAttribute('data-categoria');
      fetchAndRenderPosts();
    });
  });

  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      tagSelecionada = this.getAttribute('data-tag');
      fetchAndRenderPosts();
    });
  });

  // Inicializa com todos os posts
  // fetchAndRenderPosts(); // Descomente se quiser carregar via AJAX desde o início
});