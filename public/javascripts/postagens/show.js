document.addEventListener('DOMContentLoaded', function () {
  // Supondo que as postagens estão disponíveis em window.postagens (renderize no pug se necessário)
  const cards = document.querySelectorAll('.post-card');
  const modalEl = document.getElementById('modalPostagem');
  const modal = new bootstrap.Modal(modalEl);
  let postagens = window.postagens || [];

  cards.forEach(card => {
    card.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      const post = postagens.find(p => String(p.id_postagem) === String(id));
      if (post) {
        document.getElementById('modalTitulo').textContent = post.titulo || 'Sem título';
        document.getElementById('modalConteudo').textContent = post.conteudo;
        document.getElementById('modalCategoria').textContent = post.categoria?.nome_categoria || 'Sem categoria';
        document.getElementById('modalTags').textContent = Array.isArray(post.tags) ? post.tags.map(t => t.nome_tag).join(', ') : '';
        document.getElementById('modalData').textContent = post.data_criacao || '';
        document.getElementById('modalTipo').textContent = post.tipo_postagem || '';
        document.getElementById('modalArtigo').textContent = post.artigo_cientifico ? 'Sim' : 'Não';
        document.getElementById('modalLat').textContent = post.latitude || '';
        document.getElementById('modalLng').textContent = post.longitude || '';
        const btnEditar = document.getElementById('btnEditarPost');
        btnEditar.href = `/postagens/${post.id_postagem}/edit`;
        modal.show();
      }
    });
  });

  const buscaInput = document.getElementById('busca-titulo-post');
  if (buscaInput) {
    buscaInput.addEventListener('input', function () {
      const termo = buscaInput.value.toLowerCase();
      document.querySelectorAll('.post-card').forEach(card => {
        const titulo = card.querySelector('.card-title').textContent.toLowerCase();
        card.style.display = titulo.includes(termo) ? '' : 'none';
      });
    });
  }

  // Corrige fechamento do modal e backdrop
  modalEl.querySelector('.btn-close').addEventListener('click', function() {
    modal.hide();
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      modalEl.style.display = 'none';
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }, 300);
  });

  // Corrige backdrop ao fechar pelo ESC ou clique fora
  modalEl.addEventListener('hidden.bs.modal', function() {
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      modalEl.style.display = 'none';
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }, 100);
  });
});

console.log('window.postagens:', window.postagens);