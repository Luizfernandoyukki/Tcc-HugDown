document.addEventListener('DOMContentLoaded', function() {
  const usuarioData = window.usuarioData;
  if (usuarioData && usuarioData.nome_usuario) {
    console.log('Perfil visualizado:', usuarioData.nome_usuario);
    // Aqui você pode adicionar interatividade extra se quiser
  } else {
    console.warn('Nenhum dado de usuário disponível para exibir o perfil.');
  }
});