// Controla o card flutuante
(function() {
  const card = document.getElementById('card-flutuante-login');
  const fecharBtn = document.getElementById('fechar-card-flutuante');

  // Mostrar card flutuante
  function mostrarCardFlutuante() {
    card.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Fechar card flutuante
  if (fecharBtn) {
    fecharBtn.addEventListener('click', () => {
      card.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Bloqueio de ações restritas
  document.querySelectorAll('.acao-restrita').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!window.usuarioLogado) {
        e.preventDefault();
        mostrarCardFlutuante();
        return false;
      }
      // Ação normal se logado
    });
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
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

        // Remove destaques anteriores
        clearHighlights();
        
        // Realiza a pesquisa
        searchInContent(searchTerm);
    });
}

function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.textContent = parent.textContent;
    });
}

function searchInContent(term) {
    const walker = document.createTreeWalker(
        document.querySelector('.site-main'),
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                return node.parentNode.tagName !== 'SCRIPT' && 
                       node.parentNode.tagName !== 'STYLE' ? 
                       NodeFilter.FILTER_ACCEPT : 
                       NodeFilter.FILTER_REJECT;
            }
        }
    );

    let found = false;
    let firstMatch = null;
    let node;

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
}
    let found = false;
    let firstMatch = null;
    let node;

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

