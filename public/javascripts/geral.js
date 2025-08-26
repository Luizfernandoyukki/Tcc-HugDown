document.addEventListener('DOMContentLoaded', function() {
  const card = document.getElementById('card-flutuante-login');
  if (card) {
    const btnFechar = card.querySelector('#fechar-card-flutuante, button.btn-outline-secondary');
    if (btnFechar) {
      btnFechar.addEventListener('click', function() {
        card.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  }
});