document.addEventListener('DOMContentLoaded', function() {
  const card = document.getElementById('card-flutuante-login');
  if (card) {
    const btnFechar = card.querySelector('#fechar-card-flutuante, button.btn-outline-secondary');
    if (btnFechar) {
      btnFechar.addEventListener('click', function() {
        card.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  }

  document.querySelectorAll('.acao-restrita').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!window.usuarioLogado) {
        e.preventDefault();
        alert('Você precisa estar logado para acessar esta funcionalidade.');
        return false;
      }
      // Se logado, ação normal
    });
  });
});