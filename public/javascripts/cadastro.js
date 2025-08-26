// Controle dos passos
const steps = Array.from(document.querySelectorAll('.step-section'));
let currentStep = 0;
function showStep(idx) {
  steps.forEach((el, i) => el.classList.toggle('active', i === idx));
  // Se for o último passo, habilite o botão de submit
  if (idx === steps.length - 1) {
    document.querySelector('button[type="submit"]').disabled = false;
  } else {
    document.querySelector('button[type="submit"]').disabled = true;
  }
  currentStep = idx;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.getElementById('btn-avancar-1').onclick = () => showStep(1);
document.getElementById('btn-voltar-2').onclick = () => showStep(0);
document.getElementById('btn-avancar-2').onclick = () => showStep(2);
document.getElementById('btn-voltar-3').onclick = () => showStep(1);
document.getElementById('btn-avancar-3').onclick = () => showStep(3);
document.getElementById('btn-voltar-4').onclick = () => showStep(2);
document.getElementById('btn-avancar-4').onclick = () => showStep(4);
document.getElementById('btn-voltar-5').onclick = () => showStep(3);

// Profissional da saúde: mostrar campos extras
document.getElementById('profissional_saude').onchange = function() {
  document.getElementById('saude-extra').style.display = this.checked ? '' : 'none';
};

// Olho para visualizar/esconder senha
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
document.getElementById('toggleSenha').onclick = () => togglePassword('senha', 'iconSenha');
document.getElementById('toggleConfirmarSenha').onclick = () => togglePassword('confirmar_senha', 'iconConfirmarSenha');

// Validação de campos obrigatórios e confirmação de senha
document.getElementById('form-cadastro').onsubmit = async function(e) {
  e.preventDefault();
  const senha = document.getElementById('senha').value;
  const confirmar = document.getElementById('confirmar_senha').value;
  if (senha !== confirmar) {
    document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-danger">As senhas não coincidem.</div>';
    console.log('Validação: senhas não coincidem');
    return;
  }
  // Validação dos obrigatórios
  const obrigatorios = [
    'nome_real', 'sobrenome_real', 'data_nascimento', 'genero', 'email', 'senha', 'confirmar_senha',
    'nome_usuario', 'telefone', 'endereco', 'cidade', 'estado', 'cep',
    'idioma_preferido', 'pais'
  ];
  let faltando = obrigatorios.filter(id => {
    const el = document.getElementById(id);
    return !el || !el.value.trim();
  });
  if (faltando.length) {
    document.getElementById('cadastro-feedback').innerHTML =
      '<div class="alert alert-danger">Preencha os campos obrigatórios: <b>' +
      faltando.map(id => {
        const label = document.querySelector('label[for="' + id + '"]');
        return label ? label.textContent.replace('*', '').trim() : id;
      }).join(', ') +
      '</b></div>';
    console.log('Validação: campos faltando:', faltando);
    return;
  }

  console.log('Validação: todos os campos obrigatórios preenchidos');

  const form = e.target;
  const formData = new FormData(form);

  // Checkbox: profissional_saude
  formData.set('profissional_saude', document.getElementById('profissional_saude').checked ? 'true' : 'false');

  // Foto de perfil
  const fotoInput = document.getElementById('foto_perfil');
  if (fotoInput && fotoInput.files.length > 0) {
    formData.set('foto_perfil', fotoInput.files[0]);
  }

  // Fuso horário
  formData.set('fuso_horario', Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Envia para /cadastro
  try {
    console.log('Enviando cadastro...');
    const res = await fetch('/cadastro', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    console.log('Resposta do backend:', data);
    if (res.ok) {
      // Login automático após cadastro
      console.log('Cadastro OK, tentando login automático...');
      const loginRes = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.get('email'), senha: formData.get('senha') })
      });
      if (loginRes.ok) {
        console.log('Login automático OK, redirecionando...');
        window.location.href = '/';
      } else {
        console.log('Login automático falhou');
        document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-success">Cadastro realizado! Faça login.</div>';
        form.reset();
        showStep(0);
      }
    } else {
      document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-danger">' + (data.error || 'Erro ao cadastrar.') + '</div>';
      console.log('Erro do backend:', data.error || data);
    }
  } catch (err) {
    document.getElementById('cadastro-feedback').innerHTML = '<div class="alert alert-danger">Erro de conexão.</div>';
    console.log('Erro de conexão:', err);
  }
};