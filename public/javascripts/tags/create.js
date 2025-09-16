// Lista de palavras ofensivas (exemplo, adicione mais conforme necessário)
const palavrasProibidas = [
  'palavrão1', 'palavrão2', 'idiota', 'burro', 'otário', 'merda', 'bosta', 'porra', 'caralho', 'puta', 'fdp'
];

// Inicializa filtro bad-words se disponível (via CDN)
let filter = null;
if (window.BadWords) {
  filter = new window.BadWords();
  filter.addWords(...palavrasProibidas);
}

function contemPalavraProibida(texto) {
  if (!texto) return false;
  if (filter) {
    return filter.isProfane(texto);
  }
  // fallback simples
  const lower = texto.toLowerCase();
  return palavrasProibidas.some(p => lower.includes(p));
}

document.addEventListener('DOMContentLoaded', function() {
  // Preencher lista de tags existentes
  const tagsUl = document.getElementById('tags-existentes');
  if (tagsUl && window.tagsExistentes.length) {
    tagsUl.innerHTML = '';
    window.tagsExistentes.forEach(tag => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = tag.nome_tag;
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

  form.addEventListener('submit', function(e) {
    const nome = nomeInput.value.trim().toLowerCase();
    const existe = window.tagsExistentes.some(tag => tag.nome_tag.toLowerCase() === nome);
    const proibidoNome = contemPalavraProibida(nome);
    const proibidoDesc = contemPalavraProibida(descInput.value);

    if (existe || proibidoNome) {
      nomeError.classList.remove('d-none');
      e.preventDefault();
    }
    if (proibidoDesc) {
      descError.classList.remove('d-none');
      e.preventDefault();
    }
  });

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
  document.querySelectorAll('.delete-tag-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const nomeTag = this.getAttribute('data-nome');
      const li = this.closest('li');
      deletarTag(nomeTag, li);
    });
  });
});