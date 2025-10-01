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

  // Função para verificar notificações
  async function checkNotifications() {
    if (window.usuarioLogado) {
      try {
        const response = await fetch('/api/notificacoes/nao-lidas/count');
        const data = await response.json();
        const notifItem = document.querySelector('.nav-item');
        if (data.count > 0) {
          notifItem.classList.add('has-notifications');
        } else {
          notifItem.classList.remove('has-notifications');
        }
      } catch (error) {
        console.error('Erro ao verificar notificações:', error);
      }
    }
  }

  // Verificação de notificações a cada 30 segundos
  checkNotifications();
  setInterval(checkNotifications, 30000);

  // Bloqueio de ações restritas
  document.querySelectorAll('.acao-restrita').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!window.usuarioLogado) {
        e.preventDefault();
        alert('Você precisa estar logado para acessar esta funcionalidade.');
        return false;
      }
    });
  });
});