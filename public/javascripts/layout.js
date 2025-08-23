// Controla o card flutuante
(function() {
  const card = document.getElementById('card-flutuante-login');
  const fecharBtn = document.getElementById('fechar-card-flutuante');

  // Mostrar card flutuante
  function mostrarCardFlutuante() {
    card.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Fechar card flutuante
  if (fecharBtn) {
    fecharBtn.addEventListener('click', () => {
      card.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Bloqueio de ações restritas
  document.addEventListener('click', function(e) {
    if (e.target.closest('.acao-restrita')) {
      if (!window.usuarioLogado) {
        e.preventDefault();
        mostrarCardFlutuante();
      }
    }
  });
})();
