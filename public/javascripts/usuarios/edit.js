document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-usuario-edit');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
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
        alert('Usuário editado com sucesso!');
        window.location.href = `/usuarios/${usuarioId}`;
      } else {
        alert(data.error || 'Erro ao editar usuário');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
});