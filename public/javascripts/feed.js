document.addEventListener('DOMContentLoaded', function() {
  // Filtro automático
  const form = document.getElementById('filtrosFeed');
  if (form) {
    form.addEventListener('change', function() {
      form.submit();
    });
  }

  // Exibir todas as tags
  const btnExibirTodas = document.getElementById('btn-exibir-todas-tags');
  const tagsBaloes = document.getElementById('tags-baloes');
  if (btnExibirTodas && tagsBaloes) {
    btnExibirTodas.addEventListener('click', function() {
      const allTags = window.tagsData || [];
      tagsBaloes.innerHTML = allTags.map(tg =>
        `<span class="badge bg-secondary text-light px-3 py-2 fs-6 tag-balao" style="cursor:pointer" onclick="window.location='?tag=${tg.id_tag}'">
          <i class="fas fa-tag me-1"></i> ${tg.nome_tag}
        </span>`
      ).join('');
      btnExibirTodas.style.display = 'none';
    });
    // Salva tags para JS (renderizadas no template)
    window.tagsData = Array.from(tagsBaloes.children).map(el => ({
      id_tag: el.getAttribute('onclick').match(/tag=(\d+)/)[1],
      nome_tag: el.textContent.trim()
    }));
  }

  // Modal expandir postagem
  const modal = document.getElementById('modalPostagem');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalConteudo = document.getElementById('modalConteudo');
  document.querySelectorAll('.btn-expandir').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-idx');
      const post = window.feedPosts && window.feedPosts[idx];
      if (!post) return;
      modalTitulo.textContent = post.titulo;
      let html = `
        <div class="d-flex align-items-center mb-2">
          <img src="${post.autor && post.autor.foto_perfil ? post.autor.foto_perfil : '/images/default-profile.png'}" class="rounded-circle me-2" width="40" height="40">
          <div>
            <h6 class="mb-0">${post.autor ? post.autor.nome_usuario : 'Autor desconhecido'}</h6>
            <small class="text-muted">${post.data_criacao ? new Date(post.data_criacao).toLocaleString() : ''}</small>
          </div>
        </div>
        <p>${post.conteudo}</p>
        ${post.url_midia ? `<img src="${post.url_midia}" style="max-width:100%;max-height:300px;" class="mb-2">` : ''}
        <div class="mb-2">
          ${post.categoria ? `<span class="badge bg-primary me-1">${post.categoria.nome_categoria}</span>` : ''}
          ${post.tag ? `<span class="badge bg-secondary me-1">${post.tag.nome_tag}</span>` : ''}
          ${post.endereco ? `<small class="text-muted d-block">Endereço: ${post.endereco}</small>` : ''}
        </div>
        <hr>
        <div id="comentariosArea"></div>
        <form id="formComentarModal" class="mt-2">
          <input type="hidden" name="id_postagem" value="${post.id_postagem}">
          <textarea name="conteudo" class="form-control mb-2" rows="2" placeholder="Comente..."></textarea>
          <button type="submit" class="btn btn-primary btn-sm">Enviar comentário</button>
        </form>
      `;
      modalConteudo.innerHTML = html;
      // Carregar comentários
      fetch(`/api/postagens/${post.id_postagem}/comentarios`)
        .then(res => res.json())
        .then(comentarios => {
          const area = document.getElementById('comentariosArea');
          if (comentarios.length === 0) {
            area.innerHTML = '<p class="text-muted">Nenhum comentário ainda.</p>';
          } else {
            area.innerHTML = comentarios.map(c =>
              `<div class="d-flex align-items-center mb-2">
                <img src="${c.autor && c.autor.foto_perfil ? c.autor.foto_perfil : '/images/default-profile.png'}" class="rounded-circle me-2" width="32" height="32">
                <div>
                  <strong>${c.autor ? c.autor.nome_usuario : 'Usuário'}</strong>
                  <small class="text-muted ms-2">${c.data_criacao ? new Date(c.data_criacao).toLocaleString() : ''}</small>
                  <div>${c.conteudo}</div>
                </div>
              </div>`
            ).join('');
          }
        });
      // Comentar
      document.getElementById('formComentarModal').onsubmit = function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        fetch(`/api/postagens/${post.id_postagem}/comentar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conteudo: fd.get('conteudo') })
        }).then(r => r.json()).then(resp => {
          if (resp.sucesso) {
            this.reset();
            // Recarrega comentários
            fetch(`/api/postagens/${post.id_postagem}/comentarios`)
              .then(res => res.json())
              .then(comentarios => {
                const area = document.getElementById('comentariosArea');
                area.innerHTML = comentarios.map(c =>
                  `<div class="d-flex align-items-center mb-2">
                    <img src="${c.autor && c.autor.foto_perfil ? c.autor.foto_perfil : '/images/default-profile.png'}" class="rounded-circle me-2" width="32" height="32">
                    <div>
                      <strong>${c.autor ? c.autor.nome_usuario : 'Usuário'}</strong>
                      <small class="text-muted ms-2">${c.data_criacao ? new Date(c.data_criacao).toLocaleString() : ''}</small>
                      <div>${c.conteudo}</div>
                    </div>
                  </div>`
                ).join('');
              });
          }
        });
      };
      // Abre modal (Bootstrap 5)
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    });
  });

  // Salva posts para JS
  window.feedPosts = window.postsData || [];

  // Curtir, comentar, compartilhar (toggle curtida)
  document.querySelectorAll('.btn-curtir').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const idx = this.getAttribute('data-idx');
      fetch(`/api/postagens/${id}/curtir-toggle`, { method: 'POST' })
        .then(r => r.json())
        .then(resp => {
          if (resp.sucesso) {
            // Atualiza contador de curtidas
            fetch(`/api/postagens/${id}`)
              .then(res => res.json())
              .then(data => {
                const countEl = document.getElementById(`curtidas-count-${id}`);
                if (countEl) countEl.textContent = data.curtidas;
                // Toggle cor do botão
                if (resp.adicionado) {
                  btn.classList.remove('btn-outline-danger');
                  btn.classList.add('btn-danger');
                } else if (resp.removido) {
                  btn.classList.remove('btn-danger');
                  btn.classList.add('btn-outline-danger');
                }
              });
          }
        });
    });
  });
});