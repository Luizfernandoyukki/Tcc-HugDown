console.log('cadastro.js rodando');
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formCadastro');

  const errorAlert = document.getElementById('errorAlert');
  

  // Máscara telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput && typeof IMask !== 'undefined') {
    IMask(telefoneInput, { mask: '(00) 00000-0000' });
  }

  // Máscara CEP
  const cepInput = document.getElementById('cep');
  if (cepInput && typeof IMask !== 'undefined') {
    IMask(cepInput, { mask: '00000-000' });
  }

  // Toggle senha
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = this.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Exibir campos de profissional de saúde
  const profissionalCheck = document.getElementById('profissional_saude');
  const saudeExtra = document.getElementById('saude-extra');
  if (profissionalCheck && saudeExtra) {
    profissionalCheck.addEventListener('change', function() {
      if (this.checked) {
        saudeExtra.style.display = '';
      } else {
        saudeExtra.style.display = 'none';
      }
      // Atualizar required dos campos
      const inputs = saudeExtra.querySelectorAll('input, select');
      inputs.forEach(input => {
        if (input.name !== 'especialidade') { // especialidade é opcional
          input.required = this.checked;
        }
      });
    });
  }

  // Controle dos steps
  const steps = document.querySelectorAll('.step-section');
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('active');
        step.style.display = '';
      } else {
        step.classList.remove('active');
        step.style.display = 'none';
      }
    });
  }

  showStep(currentStep);

  // Botões de avançar/voltar
  document.getElementById('btn-avancar-1')?.addEventListener('click', function() {
    currentStep = 1;
    showStep(currentStep);
  });
  document.getElementById('btn-voltar-2')?.addEventListener('click', function() {
    currentStep = 0;
    showStep(currentStep);
  });
  document.getElementById('btn-avancar-2')?.addEventListener('click', function() {
    currentStep = 2;
    showStep(currentStep);
  });
  document.getElementById('btn-voltar-3')?.addEventListener('click', function() {
    currentStep = 1;
    showStep(currentStep);
  });
  document.getElementById('btn-avancar-3')?.addEventListener('click', function() {
    currentStep = 3;
    showStep(currentStep);
  });
  document.getElementById('btn-voltar-4')?.addEventListener('click', function() {
    currentStep = 2;
    showStep(currentStep);
  });
  document.getElementById('btn-avancar-4')?.addEventListener('click', function() {
    currentStep = 4;
    showStep(currentStep);
  });
  document.getElementById('btn-voltar-5')?.addEventListener('click', function() {
    currentStep = 3;
    showStep(currentStep);
  });

  // Enviar formulário
  form?.addEventListener('submit', async function(e) {
    console.log('Evento submit disparado!');
    e.preventDefault();
    errorAlert.classList.add('d-none');
    errorAlert.innerHTML = '';

    // Validação dos campos obrigatórios
    const camposObrigatorios = [
      'nome_real', 'sobrenome_real', 'nome_usuario', 'email', 'senha', 'confirma_senha',
      'telefone', 'endereco', 'cidade', 'estado', 'cep', 'data_nascimento', 'genero'
    ];
    let camposFaltando = [];
    camposObrigatorios.forEach(nome => {
      const campo = form.querySelector(`[name="${nome}"]`);
      if (!campo || !campo.value.trim()) {
        camposFaltando.push(nome);
      }
    });

    // Se for profissional de saúde, valida campos extras
    if (profissionalCheck && profissionalCheck.checked) {
      const camposProfissional = [
        'tipo_registro', 'numero_registro', 'uf_registro', 'instituicao', 'documento_comprobatorio'
      ];
      camposProfissional.forEach(nome => {
        const campo = form.querySelector(`[name="${nome}"]`);
        if (!campo || !campo.value.trim() || (campo.type === 'file' && campo.files.length === 0)) {
          camposFaltando.push(nome);
        }
      });
    }

    if (camposFaltando.length > 0) {
      errorAlert.innerHTML = 'Preencha todos os campos obrigatórios:<br>' +
        camposFaltando.map(c => `<b>${c}</b>`).join(', ');
      errorAlert.classList.remove('d-none');
      return;
    }

    // Validação de senha
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma_senha').value;
    if (senha !== confirmaSenha) {
      errorAlert.textContent = 'As senhas não conferem';
      errorAlert.classList.remove('d-none');
      return;
    }
document.querySelector('input[name="fuso_horario"]').value =
  Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Remover máscara do telefone e CEP antes de enviar
    const telefone = telefoneInput.value.replace(/\D/g, ''); // só números
    telefoneInput.value = telefone;

    const cep = cepInput.value.replace(/\D/g, ''); // só números
    cepInput.value = cep;

    // Enviar formulário
    try {
      const formData = new FormData(form);
      const response = await fetch('/cadastro', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        let message = 'Cadastro realizado com sucesso!';
        if (formData.get('profissional_saude')) {
          message += '\nSua solicitação de verificação como profissional de saúde está pendente de aprovação.';
        }
        alert(message);
      } else {
        errorAlert.textContent = data.error || 'Erro ao realizar cadastro';
        errorAlert.classList.remove('d-none');
      }
    } catch (err) {
      errorAlert.textContent = 'Erro de conexão ou envio: ' + err.message;
      errorAlert.classList.remove('d-none');
    }
  });
});