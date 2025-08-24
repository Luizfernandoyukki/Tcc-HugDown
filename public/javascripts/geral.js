document.querySelectorAll('.acao-restrita').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (!window.usuarioLogado) {
      e.preventDefault();
      const card = document.getElementById('card-flutuante-login');
      if (card) {
        card.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Foco no botão de fechar para acessibilidade
        const btnFechar = card.querySelector('button, .btn-outline-secondary');
        if (btnFechar) btnFechar.focus();
      }
      return false;
    }
    // ...ação normal se logado
  });
});

// Permite fechar o card flutuante
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
});