document.addEventListener('DOMContentLoaded', function() {
  // Aprovar documento
  document.querySelectorAll('.btn-aprovar-doc').forEach(btn => {
    btn.removeEventListener('click', window._aprovarDocHandler);
    window._aprovarDocHandler = async function() {
      const docId = this.dataset.id;
      if (!confirm('Aprovar este documento?')) return;
      const res = await fetch(`/administradores/documentos/${docId}/aprovar`, { method: 'POST' });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = {};
      }
      if (res.ok && data.success) {
        alert(data.mensagem || 'Documento aprovado com sucesso!');
        location.reload();
      } else {
        alert(data.error || 'Erro ao aprovar documento.');
      }
    };
    btn.addEventListener('click', window._aprovarDocHandler);
  });
  // Rejeitar documento
  document.querySelectorAll('.btn-rejeitar-doc').forEach(btn => {
    btn.removeEventListener('click', window._rejeitarDocHandler);
    window._rejeitarDocHandler = async function() {
      const docId = this.dataset.id;
      if (!confirm('Rejeitar este documento?')) return;
      const res = await fetch(`/administradores/documentos/${docId}/rejeitar`, { method: 'POST' });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = {};
      }
      if (res.ok && data.success) {
        alert(data.mensagem || 'Documento rejeitado com sucesso!');
        location.reload();
      } else {
        alert(data.mensagem || data.error || 'Erro ao rejeitar documento.');
      }
    };
    btn.addEventListener('click', window._rejeitarDocHandler);
  });
});