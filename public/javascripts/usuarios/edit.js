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
        // Decide a URL de retorno:
        // 1) se data-return-to estiver definido no form, usa ele;
        // 2) senão, se document.referrer é do mesmo origin, usa document.referrer;
        // 3) fallback para a página de perfil do usuário.
        try {
          const forced = form.dataset.returnTo;
          if (forced) {
            window.location.href = forced;
            return;
          }
          const ref = document.referrer;
          if (ref) {
            const refUrl = new URL(ref);
            if (refUrl.origin === location.origin) {
              window.location.href = ref;
              return;
            }
          }
        } catch (err) {
          // se algo falhar com URL parsing, cai no fallback
        }
        window.location.href = `/usuarios/index/${usuarioId}`;
      } else {
        alert(data.error || 'Erro ao editar usuário');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
});