document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-edit');
  if (!form) return;
  // Remova listeners antigos antes de adicionar
  if (window._usuarioEditHandler) {
    form.removeEventListener('submit', window._usuarioEditHandler);
  }
  window._usuarioEditHandler = async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const id = form.action.match(/usuarios\/(\d+)/)[1];
    try {
      const response = await fetch(`/usuarios/${id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert('Perfil atualizado com sucesso!');
        // Redireciona sempre para o index do usuário
        window.location.href = `/usuarios/index/${id}`;
      } else {
        alert(data.error || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };
  form.addEventListener('submit', window._usuarioEditHandler);
});