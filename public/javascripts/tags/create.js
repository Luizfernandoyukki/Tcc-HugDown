document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-tag-create');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch('/tags', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert('Tag criada com sucesso!');
        window.location.href = '/tags';
      } else {
        alert(data.error || 'Erro ao criar tag');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
});