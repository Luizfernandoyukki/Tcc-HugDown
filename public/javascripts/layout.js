// Controla o card flutuante
(function() {
  const card = document.getElementById('card-flutuante-login');
  const fecharBtn = document.getElementById('fechar-card-flutuante');

  function mostrarCardFlutuante() {
    if (!card) return;
    card.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  if (fecharBtn) {
    fecharBtn.addEventListener('click', () => {
      if (!card) return;
      card.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  document.querySelectorAll('.acao-restrita').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!window.usuarioLogado) {
        e.preventDefault();
        mostrarCardFlutuante();
        return false;
      }
    });
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    // Filtro de palavrões global (blokdepalavroes.js)
    if (window.bloquearPalavrasOfensivas && typeof window.bloquearPalavrasOfensivas === 'function') {
      window.bloquearPalavrasOfensivas();
    }
    fetch('/api/notificacoes/nao-lidas/count')
    .then(res => res.json())
    .then(data => {
      const indicator = document.querySelector('.notification-indicator');
      if (indicator && data.count > 0) {
        indicator.textContent = data.count;
        indicator.style.display = 'block';
      } else if (indicator) {
        indicator.style.display = 'none';
      }
    });
});

// Sistema de pesquisa na página
function initSearch() {
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');

    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;

        clearHighlights();
        searchInContent(searchTerm);
    });
}

function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        if (parent) parent.textContent = parent.textContent;
    });
}

// Escapa termo para usar em RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchInContent(term) {
    const main = document.querySelector('.site-main');
    if (!main) return;

    const walker = document.createTreeWalker(
        main,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                const parentTag = node.parentNode && node.parentNode.tagName ? node.parentNode.tagName.toUpperCase() : '';
                return (parentTag !== 'SCRIPT' && parentTag !== 'STYLE') ?
                    NodeFilter.FILTER_ACCEPT :
                    NodeFilter.FILTER_REJECT;
            }
        }
    );

    let node;
    let found = false;
    let firstMatch = null;

    while ((node = walker.nextNode())) {
        if (node.textContent.toLowerCase().includes(term)) {
            const span = document.createElement('span');
            span.innerHTML = node.textContent.replace(
                new RegExp(`(${escapeRegExp(term)})`, 'gi'),
                '<mark class="search-highlight">$1</mark>'
            );
            node.parentNode.replaceChild(span, node);

            if (!found) {
                firstMatch = span;
                found = true;
            }
        }
    }

    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}
    while (node = walker.nextNode()) {
        if (node.textContent.toLowerCase().includes(term)) {
            const span = document.createElement('span');
            span.innerHTML = node.textContent.replace(
                new RegExp(`(${term})`, 'gi'),
                '<mark class="search-highlight">$1</mark>'
            );
            node.parentNode.replaceChild(span, node);
            
            if (!found) {
                firstMatch = span;
                found = true;
            }
        }
    }

    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

