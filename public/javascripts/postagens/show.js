document.addEventListener('DOMContentLoaded', function () {
  // Supondo que as postagens estão disponíveis em window.postagens (renderize no pug se necessário)
  const cards = document.querySelectorAll('.post-card');
  const modal = new bootstrap.Modal(document.getElementById('modalPostagem'));
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
});
console.log('window.postagens:', window.postagens);