document.addEventListener('DOMContentLoaded', function () {
  // Aqui você pode adicionar interações JS do painel de postagens futuramente
  // Exemplo: alert ao clicar em "Nova Postagem"
  const btnNova = document.querySelector('a[href="/postagens/create"]');
  if (btnNova) {
    btnNova.addEventListener('click', function (e) {
      // Exemplo de feedback visual
      // alert('Função de criar postagem ainda não implementada!');
    });
  }
});