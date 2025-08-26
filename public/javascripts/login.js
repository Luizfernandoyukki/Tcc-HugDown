document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function () {
    // Opcional: exibe feedback visual simples durante o envio
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').innerText = 'Entrando...';
  });
});