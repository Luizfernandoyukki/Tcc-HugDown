// Lista de palavras ofensivas (exemplo, adicione mais conforme necessário)
const palavrasProibidas = [
  'palavrão1', 'palavrão2', 'idiota', 'burro', 'otário', 'merda', 'bosta', 'porra', 'caralho', 'puta', 'fdp'
];

function contemPalavraProibida(texto) {
  if (!texto) return false;
  // Usa blokdepalavroes.js se disponível
  if (window.verificarConteudoOfensivo && typeof window.verificarConteudoOfensivo === 'function') {
    // Simula um campo para reusar a função
    const fakeInput = document.createElement('input');
    fakeInput.value = texto;
    window.verificarConteudoOfensivo(fakeInput);
    return fakeInput.value.includes('***');
  }
  // fallback simples
  const lower = texto.toLowerCase();
  return palavrasProibidas.some(p => lower.includes(p));
}

document.addEventListener('DOMContentLoaded', function() {
  // Preencher lista de tags existentes (apenas do usuário)
  const tagsUl = document.getElementById('tags-existentes');
  if (tagsUl && window.tagsExistentes.length) {
    tagsUl.innerHTML = '';
    window.tagsExistentes
      .filter(tag => tag.id_usuario === window.usuario.id_usuario) // só minhas tags
      .forEach(tag => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = tag.nome_tag;
        // Adiciona botão de deletar só para o dono
        const btn = document.createElement('button');
        btn.className = 'btn btn-danger btn-sm ms-2 delete-tag-btn';
        btn.textContent = 'Excluir';
        btn.onclick = () => deletarTag(tag.nome_tag, li);
        li.appendChild(btn);
        tagsUl.appendChild(li);
      });
  }

  // Validação de nome único e palavras proibidas
  const form = document.getElementById('form-tag-create');
  const nomeInput = document.getElementById('nome_tag');
  const descInput = document.getElementById('descricao_tag');
  const nomeError = document.getElementById('nomeTagError');
  const descError = document.getElementById('descTagError');

  nomeInput.addEventListener('input', function() {
    const nome = nomeInput.value.trim().toLowerCase();
    const existe = window.tagsExistentes.some(tag => tag.nome_tag.toLowerCase() === nome);
    const proibido = contemPalavraProibida(nome);
    if (existe || proibido) {
      nomeError.classList.remove('d-none');
    } else {
      nomeError.classList.add('d-none');
    }
  });

  descInput.addEventListener('input', function() {
    const desc = descInput.value;
    if (contemPalavraProibida(desc)) {
      descError.classList.remove('d-none');
    } else {
      descError.classList.add('d-none');
    }
  });

  if (form) {
    if (window._tagSubmitHandler) {
      form.removeEventListener('submit', window._tagSubmitHandler);
    }
    window._tagSubmitHandler = function(e) {
      const nome = nomeInput.value.trim().toLowerCase();
      const existe = window.tagsExistentes.some(tag => tag.nome_tag.toLowerCase() === nome);
      const proibidoNome = contemPalavraProibida(nome);
      const proibidoDesc = contemPalavraProibida(descInput.value);

      // Filtro de palavrões global (blokdepalavroes.js)
      if (window.verificarConteudoOfensivo && typeof window.verificarConteudoOfensivo === 'function') {
        window.verificarConteudoOfensivo(nomeInput);
        window.verificarConteudoOfensivo(descInput);
        if ((nomeInput.value && nomeInput.value.includes('***')) || (descInput.value && descInput.value.includes('***'))) {
          e.preventDefault();
          alert('Remova palavras ofensivas dos campos antes de enviar.');
          return;
        }
      }

      if (existe || proibidoNome) {
        nomeError.classList.remove('d-none');
        e.preventDefault();
      }
      if (proibidoDesc) {
        descError.classList.remove('d-none');
        e.preventDefault();
      }
    };
    form.addEventListener('submit', window._tagSubmitHandler);
  }

  // Função para deletar tag
  function deletarTag(nomeTag, liElement) {
    if (!confirm(`Tem certeza que deseja excluir a tag "${nomeTag}"?`)) return;
    fetch(`/tags/delete/${encodeURIComponent(nomeTag)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        liElement.remove();
        // Remove do array local também
        window.tagsExistentes = window.tagsExistentes.filter(t => t.nome_tag !== nomeTag);
      } else {
        alert('Erro ao deletar tag.');
      }
    })
    .catch(() => alert('Erro ao deletar tag.'));
  }

  // Adiciona evento aos botões de deletar
  // Removido: não há mais botão de deletar para usuários comuns
  // document.querySelectorAll('.delete-tag-btn').forEach(btn => {
  //   btn.addEventListener('click', function() {
  //     const nomeTag = this.getAttribute('data-nome');
  //     const li = this.closest('li');
  //     deletarTag(nomeTag, li);
  //   });
  // });
});