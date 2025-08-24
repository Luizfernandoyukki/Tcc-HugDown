// Controle dos passos
const steps = Array.from(document.querySelectorAll('.step-section'));
let currentStep = 0;
function showStep(idx) {
  steps.forEach((el, i) => el.classList.toggle('active', i === idx));
  currentStep = idx;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.getElementById('btn-avancar-1').onclick = () => showStep(1);
document.getElementById('btn-voltar-2').onclick = () => showStep(0);
document.getElementById('btn-avancar-2').onclick = () => showStep(2);
document.getElementById('btn-voltar-3').onclick = () => showStep(1);
document.getElementById('btn-avancar-3').onclick = () => showStep(3);
document.getElementById('btn-voltar-4').onclick = () => showStep(2);

// Profissional da saúde: mostrar campos extras
document.getElementById('profissional_saude').onchange = function() {
  document.getElementById('saude-extra').style.display = this.checked ? '' : 'none';
};

// Envio do cadastro via AJAX
document.getElementById('form-cadastro').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  // Checkbox: profissional_saude
  formData.set('profissional_saude', document.getElementById('profissional_saude').checked ? 'true' : 'false');
  // Envia para /cadastro
  try {
    const res = await fetch('/cadastro', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-success">Cadastro realizado com sucesso! Você pode fazer login.</div>';
      form.reset();
      showStep(0);
    } else {
      document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-danger">' + (data.error || 'Erro ao cadastrar.') + '</div>';
    }
  } catch (err) {
    document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-danger">Erro de conexão.</div>';
  }
};