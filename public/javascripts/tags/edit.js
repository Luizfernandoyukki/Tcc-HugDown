document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-tag-edit');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const tagId = form.dataset.tagId;
    try {
      const response = await fetch(`/tags/${tagId}/edit`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert('Tag editada com sucesso!');
        window.location.href = `/tags/${tagId}`;
      } else {
        alert(data.error || 'Erro ao editar tag');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
});