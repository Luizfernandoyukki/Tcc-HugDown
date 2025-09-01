document.addEventListener('DOMContentLoaded', function() {
  // Botões
  const btnNovaTag = document.getElementById('btnNovaTag');
  const btnNovaSecao = document.getElementById('btnNovaSecao');
  const formTag = document.getElementById('formTag');
  const formSecao = document.getElementById('formSecao');
  const cancelarTag = document.getElementById('cancelarTag');
  const cancelarSecao = document.getElementById('cancelarSecao');

  btnNovaTag.onclick = () => {
    formTag.style.display = '';
    formSecao.style.display = 'none';
  };
  btnNovaSecao.onclick = () => {
    formSecao.style.display = '';
    formTag.style.display = 'none';
  };
  cancelarTag.onclick = () => formTag.style.display = 'none';
  cancelarSecao.onclick = () => formSecao.style.display = 'none';

  // Envio de nova tag
  formTag.onsubmit = async function(e) {
    e.preventDefault();
    const formData = new FormData(formTag);
    try {
      const res = await fetch('/tags', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Tag criada com sucesso!');
        location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao criar tag');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };

  // Envio de nova seção
  formSecao.onsubmit = async function(e) {
    e.preventDefault();
    const formData = new FormData(formSecao);
    try {
      const res = await fetch('/secoes', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Seção criada com sucesso!');
        location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao criar seção');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };
});