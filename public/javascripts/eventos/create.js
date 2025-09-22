document.addEventListener('DOMContentLoaded', function () {
  // Verifique se o elemento existe antes de inicializar o mapa
  const mapDiv = document.getElementById('map');
  if (!mapDiv) {
    console.error('Elemento #map não encontrado!');
    return;
  }

  // Inicializa o mapa Leaflet
  const map = L.map('map').setView([-14.235, -51.925], 4); // Centro do Brasil
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let marker = null;
  const latInput = document.getElementById('latitude');
  const lngInput = document.getElementById('longitude');
  const enderecoInput = document.getElementById('endereco_evento');

  map.on('click', async function (e) {
    const { lat, lng } = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    latInput.value = lat;
    lngInput.value = lng;

    // Busca o endereço textual via Nominatim reverse
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.display_name) {
        enderecoInput.value = data.display_name;
      } else {
        enderecoInput.value = '';
      }
    } catch (err) {
      enderecoInput.value = '';
    }
  });

  // Campos separados
  const rua = document.getElementById('rua');
  const numero = document.getElementById('numero');
  const bairro = document.getElementById('bairro');
  const cidade = document.getElementById('cidade');
  const estado = document.getElementById('estado');
  const pais = document.getElementById('pais');
  const cep = document.getElementById('cep');

  const form = document.getElementById('form-criar-evento');
  form.addEventListener('submit', async function (e) {
    // Monta o endereço completo detalhado
    const enderecoCompleto = [
      rua.value,
      numero.value,
      bairro.value,
      cidade.value,
      estado.value,
      pais.value,
      cep.value
    ].filter(Boolean).join(', ');

    enderecoInput.value = enderecoCompleto;

    // Só busca se endereço foi preenchido e lat/lng ainda não estão preenchidos
    if (enderecoCompleto && (!latInput.value || !lngInput.value)) {
      e.preventDefault();
      try {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
        let res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
        let data = await res.json();
        // Se não encontrou, tenta só cidade e país
        if (!data || data.length === 0) {
          const enderecoReduzido = [cidade.value, pais.value].filter(Boolean).join(', ');
          url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoReduzido)}`;
          res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
          data = await res.json();
        }
        if (data && data.length > 0) {
          latInput.value = data[0].lat;
          lngInput.value = data[0].lon;
          form.submit();
        } else {
          alert('Endereço não encontrado. Por favor, revise o endereço informado.');
        }
      } catch (err) {
        alert('Erro ao buscar localização. Tente novamente.');
      }
    }
  });

  // Validação extra para garantir que o usuário selecionou um ponto no mapa
  form.addEventListener('submit', function (e) {
    if (!latInput.value || !lngInput.value) {
      e.preventDefault();
      alert('Por favor, selecione o local do evento no mapa.');
    }
  });
});
