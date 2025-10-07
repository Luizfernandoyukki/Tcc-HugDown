document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-usuario-edit');
  if (!form) return;
  // Remova listeners antigos antes de adicionar
  if (window._usuarioEditHandler) {
    form.removeEventListener('submit', window._usuarioEditHandler);
  }
  window._usuarioEditHandler = async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const usuarioId = form.dataset.usuarioId;
    try {
      const response = await fetch(`/usuarios/${usuarioId}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        // Redireciona sempre para o index do usuário
        window.location.href = `/usuarios/index/${usuarioId}`;
      } else {
        alert(data.error || 'Erro ao editar usuário');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };
  form.addEventListener('submit', window._usuarioEditHandler);
});