document.addEventListener('DOMContentLoaded', function() {
  // Exibe número de usuários logados
  const usuariosLogados = window.usuariosLogados || 0;
  const logadosDiv = document.getElementById('usuarios-logados');
  if (logadosDiv) {
    logadosDiv.textContent = `Usuários logados: ${usuariosLogados}`;
  }

  // Exibe denúncias
  const denuncias = window.denuncias || [];
  const denunciasDiv = document.getElementById('denuncias-lista');
  if (denunciasDiv && denuncias.length) {
    denunciasDiv.innerHTML = denuncias.map(d => `<div class='denuncia'><b>${d.titulo}</b>: ${d.descricao}</div>`).join('');
  }

  // Enviar notificação
  const formNotif = document.getElementById('form-notificacao');
  if (formNotif) {
    formNotif.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(formNotif);
      const res = await fetch('/notificacoes', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Notificação enviada!');
        formNotif.reset();
      } else {
        alert('Erro ao enviar notificação.');
      }
    });
  }
});