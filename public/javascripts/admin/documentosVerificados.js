document.addEventListener('DOMContentLoaded', function() {
  // Aprovar documento
  document.querySelectorAll('.btn-aprovar-doc').forEach(btn => {
    btn.addEventListener('click', async function() {
      const docId = this.dataset.id;
      if (!confirm('Aprovar este documento?')) return;
      const res = await fetch(`/administradores/documentos/${docId}/aprovar`, { method: 'POST' });
      if (res.ok) {
        alert('Documento aprovado!');
        location.reload();
      } else {
        alert('Erro ao aprovar documento.');
      }
    });
  });
  // Rejeitar documento
  document.querySelectorAll('.btn-rejeitar-doc').forEach(btn => {
    btn.addEventListener('click', async function() {
      const docId = this.dataset.id;
      if (!confirm('Rejeitar este documento?')) return;
      const res = await fetch(`/administradores/documentos/${docId}/rejeitar`, { method: 'POST' });
      if (res.ok) {
        alert('Documento rejeitado!');
        location.reload();
      } else {
        alert('Erro ao rejeitar documento.');
      }
    });
  });
});