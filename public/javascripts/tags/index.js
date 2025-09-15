document.addEventListener('DOMContentLoaded', function() {
  // Exibe o nome do usuário logado na tela de listagem de tags
  if (window.usuario && window.usuario.nome_usuario) {
    const userInfo = document.getElementById('usuario-info');
    if (userInfo) {
      userInfo.textContent = `Usuário: ${window.usuario.nome_usuario}`;
    }
  }
});