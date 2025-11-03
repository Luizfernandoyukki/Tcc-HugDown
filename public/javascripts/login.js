document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function () {
    // Opcional: exibe feedback visual simples durante o envio
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').innerText = 'Entrando...';
  });

  // Exibe mensagem de cadastro se existir no localStorage
  const msg = localStorage.getItem('msgCadastro');
  if (msg) {
    const msgBox = document.createElement('div');
    msgBox.className = 'alert alert-success mt-3';
    msgBox.textContent = msg;
    const card = document.querySelector('.card .card-body');
    if (card) card.insertBefore(msgBox, card.firstChild);
    localStorage.removeItem('msgCadastro');
  }
});