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
        saudeExtra.querySelectorAll('input, select').forEach(input => {
          if (input.name !== 'especialidade') { // especialidade é opcional
            input.required = true;
          }
        });
        // Documento obrigatório
        const docInput = document.getElementById('documento_comprobatorio');
        if (docInput) docInput.required = true;
      } else {
        saudeExtra.style.display = 'none';
        saudeExtra.querySelectorAll('input, select').forEach(input => {
          input.required = false;
        });
        // Documento não obrigatório
        const docInput = document.getElementById('documento_comprobatorio');
        if (docInput) docInput.required = false;
      }
    });
    // Inicializa o estado dos required ao carregar a página
    if (profissionalCheck.checked) {
      saudeExtra.style.display = '';
      saudeExtra.querySelectorAll('input, select').forEach(input => {
        if (input.name !== 'especialidade') input.required = true;
      });
      const docInput = document.getElementById('documento_comprobatorio');
      if (docInput) docInput.required = true;
    } else {
      saudeExtra.style.display = 'none';
      saudeExtra.querySelectorAll('input, select').forEach(input => {
        input.required = false;
      });
      const docInput = document.getElementById('documento_comprobatorio');
      if (docInput) docInput.required = false;
    }
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
  if (form) {
    if (window._cadastroSubmitHandler) {
      form.removeEventListener('submit', window._cadastroSubmitHandler);
    }
    window._cadastroSubmitHandler = async function(e) {
      console.log('Evento submit disparado!');
      e.preventDefault();
      errorAlert.classList.add('d-none');
      errorAlert.innerHTML = '';

      // Filtro de palavrões (usa blokdepalavroes.js)
      const camposTexto = form.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
      let encontrouOfensiva = false;
      camposTexto.forEach(campo => {
        if (window.verificarConteudoOfensivo && typeof window.verificarConteudoOfensivo === 'function') {
          window.verificarConteudoOfensivo(campo);
          // Se o campo foi modificado, considera que havia palavrão
          if ((campo.value && campo.value.includes('***')) || (campo.textContent && campo.textContent.includes('***'))) {
            encontrouOfensiva = true;
          }
        }
      });
      if (encontrouOfensiva) {
        errorAlert.textContent = 'Remova palavras ofensivas dos campos antes de enviar.';
        errorAlert.classList.remove('d-none');
        return;
      }

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
          'tipo_registro', 'numero_registro', 'uf_registro', 'instituicao'
          // 'documento_comprobatorio' removido: funcionalidade futura
        ];
        camposProfissional.forEach(nome => {
          const campo = form.querySelector(`[name="${nome}"]`);
          if (!campo || !campo.value.trim()) {
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

    // Validação dos termos de uso e dados
    const aceiteTermoUso = document.getElementById('aceite_termo_uso');
    const aceiteTermoDados = document.getElementById('aceite_termo_dados');
    if (!aceiteTermoUso?.checked || !aceiteTermoDados?.checked) {
      errorAlert.textContent = 'Você deve aceitar os Termos de Uso e a Política de Tratamento de Dados para se cadastrar.';
      errorAlert.classList.remove('d-none');
      return;
    }

    // Enviar formulário
    try {
      // Desabilita campos dos steps ocultos antes de enviar
      document.querySelectorAll('.step-section:not(.active) input, .step-section:not(.active) select, .step-section:not(.active) textarea').forEach(el => {
        el.disabled = true;
      });

      const formData = new FormData(form);
      const response = await fetch('/usuarios', { // <-- Corrigido para /usuarios
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
    } finally {
      // Reabilita todos os campos após submit (para navegação entre steps)
      document.querySelectorAll('.step-section input, .step-section select, .step-section textarea').forEach(el => {
        el.disabled = false;
      });
    }
    };
    form.addEventListener('submit', window._cadastroSubmitHandler);
  }
});