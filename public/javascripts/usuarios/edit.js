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

    // LOG dos dados enviados (igual ao cadastro.js)
    const dadosEnviados = {};
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        dadosEnviados[key] = value.name;
      } else {
        dadosEnviados[key] = value;
      }
    }
    console.log('[EDIT][FRONTEND][DADOS ENVIADOS]', dadosEnviados);

    try {
      const response = await fetch(`/usuarios/${id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      // Log do retorno do backend
      console.log('[EDIT][FRONTEND][RESPONSE]', data);
      if (data.success) {
        alert('Perfil atualizado com sucesso!');
        window.location.href = `/usuarios/index/${id}`;
      } else {
        // Mostra erro detalhado se vier do backend
        alert(data.error || JSON.stringify(data) || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };
  form.addEventListener('submit', window._usuarioEditHandler);
});