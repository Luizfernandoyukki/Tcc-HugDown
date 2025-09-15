document.addEventListener('DOMContentLoaded', function() {
  // Banir usuário
  document.querySelectorAll('.btn-banir-usuario').forEach(btn => {
    btn.addEventListener('click', async function() {
      const userId = this.dataset.id;
      if (!confirm('Banir este usuário?')) return;
      const res = await fetch(`/administradores/usuarios/${userId}/banir`, { method: 'POST' });
      if (res.ok) {
        alert('Usuário banido!');
        location.reload();
      } else {
        alert('Erro ao banir usuário.');
      }
    });
  });

  // Excluir usuário
  document.querySelectorAll('.btn-excluir-usuario').forEach(btn => {
    btn.addEventListener('click', async function() {
      const userId = this.dataset.id;
      if (!confirm('Excluir este usuário?')) return;
      const res = await fetch(`/usuarios/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Usuário excluído!');
        location.reload();
      } else {
        alert('Erro ao excluir usuário.');
      }
    });
  });

  // Enviar alerta para usuário
  document.querySelectorAll('.btn-alerta-usuario').forEach(btn => {
    btn.addEventListener('click', async function() {
      const userId = this.dataset.id;
      const mensagem = prompt('Digite a mensagem de alerta para o usuário:');
      if (!mensagem) return;
      const res = await fetch('/notificacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: userId, mensagem })
      });
      if (res.ok) {
        alert('Alerta enviado!');
      } else {
        alert('Erro ao enviar alerta.');
      }
    });
  });
});