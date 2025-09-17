document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-postagem');

  // Captura localização do usuário
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      // Cria campos ocultos para latitude/longitude
      let latInput = document.createElement('input');
      latInput.type = 'hidden';
      latInput.name = 'latitude';
      latInput.value = lat;
      form.appendChild(latInput);

      let lngInput = document.createElement('input');
      lngInput.type = 'hidden';
      lngInput.name = 'longitude';
      lngInput.value = lng;
      form.appendChild(lngInput);
    }, function(err) {
      console.log('Usuário não permitiu localização ou erro:', err);
    });
  }

  form?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);

    // Adiciona múltiplas tags como array
    const tagsSelect = document.getElementById('tags');
    if (tagsSelect) {
      const selectedTags = Array.from(tagsSelect.selectedOptions).map(opt => opt.value);
      formData.delete('tags');
      selectedTags.forEach(tag => formData.append('tags[]', tag));
    }

    try {
      const response = await fetch('/postagens', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Postagem criada com sucesso!');
        window.location.href = '/postagens';
      } else {
        let data;
        try {
          data = await response.json();
        } catch {
          // Se não for JSON, mostra erro genérico
          alert('Erro ao criar postagem (resposta inesperada do servidor)');
          return;
        }
        alert(data.error || 'Erro ao criar postagem');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
});