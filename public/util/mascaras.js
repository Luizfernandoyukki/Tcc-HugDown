// Máscara para telefone (formato brasileiro)
function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length > 10) {
    return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  return valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
}

// Máscara para CEP
function mascaraCEP(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 8) valor = valor.slice(0, 8);
  return valor.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
}

// Aplica máscaras nos campos do cadastro
function aplicarMascarasCadastro() {
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function() {
      this.value = mascaraTelefone(this.value);
    });
  }
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', function() {
      this.value = mascaraCEP(this.value);
    });
  }
}

// Remove máscaras antes de enviar
function removerMascarasCadastro() {
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.value = telefoneInput.value.replace(/\D/g, "");
  }
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.value = cepInput.value.replace(/\D/g, "");
  }
}

// Exporta funções para uso global
window.aplicarMascarasCadastro = aplicarMascarasCadastro;
window.removerMascarasCadastro = removerMascarasCadastro;
