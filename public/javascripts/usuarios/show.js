document.addEventListener('DOMContentLoaded', function() {
  // Exibe o perfil de outro usuário: nome, email, postagens e amigos
  const usuarioData = window.usuarioData;
  if (usuarioData) {
    const userInfo = document.getElementById('usuario-info');
    if (userInfo) {
      userInfo.textContent = `Usuário: ${usuarioData.nome_usuario} | Email: ${usuarioData.email}`;
    }
    // Exibe postagens
    const postagensDiv = document.getElementById('usuario-postagens');
    if (postagensDiv && usuarioData.postagens && usuarioData.postagens.length) {
      postagensDiv.innerHTML = '<h4>Postagens:</h4>' + usuarioData.postagens.map(p => `<div class='post'><b>${p.titulo || 'Sem título'}</b><br>${p.resumo || ''}</div>`).join('');
    }
    // Exibe amigos (se vier no objeto)
    const amigosDiv = document.getElementById('usuario-amigos');
    if (amigosDiv && usuarioData.amigos && usuarioData.amigos.length) {
      amigosDiv.innerHTML = '<h4>Amigos:</h4>' + usuarioData.amigos.map(a => `<span class='amigo'>${a.nome_usuario}</span>`).join(', ');
    }
  }
});