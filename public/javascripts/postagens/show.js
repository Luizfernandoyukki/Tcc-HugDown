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
        const btnEditar = document.getElementById('btnEditarPost');
        btnEditar.href = `/postagens/edit/${post.id_postagem}`;
        modal.show();
      }
    });
  });
});