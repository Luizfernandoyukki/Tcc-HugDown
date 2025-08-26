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
  document.querySelectorAll('.acao-restrita').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!window.usuarioLogado) {
        e.preventDefault();
        mostrarCardFlutuante();
        return false;
      }
      // Ação normal se logado
    });
  });
})();
