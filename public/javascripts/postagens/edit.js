document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-edit');
  if (!form) return;

  // Remova listeners antigos antes de adicionar
  if (window._editPostHandler) {
    form.removeEventListener('submit', window._editPostHandler);
  }
  window._editPostHandler = async function(e) {
    e.preventDefault();

    // Pega o id da postagem da URL
    const match = window.location.pathname.match(/\/postagens\/(\d+)\/edit/);
    const id = match ? match[1] : null;
    if (!id) return;

    // Monta os dados do formulário
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    const categoriaSelect = document.getElementById('categoria');
    if (categoriaSelect) {
      data.id_categoria = categoriaSelect.value;
    }
    const tagsSelect = document.getElementById('tags');
    if (tagsSelect) {
      data['tags[]'] = Array.from(tagsSelect.selectedOptions).map(opt => opt.value);
    }

    // Envia para o backend via PUT
    try {
      const response = await fetch(`/postagens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        // Redireciona sempre para o show de postagens
        window.location.href = '/postagens/show';
      } else {
        let errorMsg = 'Erro ao atualizar postagem';
        try {
          const res = await response.json();
          errorMsg = res.error || errorMsg;
        } catch (e) {
          errorMsg = 'Erro inesperado no servidor';
        }
        alert(errorMsg);
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };
  form.addEventListener('submit', window._editPostHandler);
});