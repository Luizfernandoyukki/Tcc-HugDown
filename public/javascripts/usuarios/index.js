document.addEventListener('DOMContentLoaded', function() {
  // Exibe o próprio perfil do usuário logado
  if (window.usuario && window.usuario.nome_usuario) {
    const userInfo = document.getElementById('usuario-info');
    if (userInfo) {
      userInfo.textContent = `Meu perfil: ${window.usuario.nome_usuario} | Email: ${window.usuario.email}`;
    }
    // Exibe postagens do próprio usuário
    const postagensDiv = document.getElementById('usuario-postagens');
    if (postagensDiv && window.usuario.postagens && window.usuario.postagens.length) {
      postagensDiv.innerHTML = '<h4>Minhas Postagens:</h4>' + window.usuario.postagens.map(p => `<div class='post'><b>${p.titulo || 'Sem título'}</b><br>${p.resumo || ''}</div>`).join('');
    }
    // Exibe amigos do próprio usuário (se vier no objeto)
    const amigosDiv = document.getElementById('usuario-amigos');
    if (amigosDiv && window.usuario.amigos && window.usuario.amigos.length) {
      amigosDiv.innerHTML = '<h4>Meus Amigos:</h4>' + window.usuario.amigos.map(a => `<span class='amigo'>${a.nome_usuario}</span>`).join(', ');
    }
    // Exemplo: exibir nome do usuário no console
    console.log('Meu perfil:', window.usuario.nome_usuario);
    // Aqui você pode adicionar interatividade extra se quiser
  }
});