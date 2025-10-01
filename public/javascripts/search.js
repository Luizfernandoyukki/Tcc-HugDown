document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');

    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;
        
        // Remove destaques anteriores
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.textContent = parent.textContent;
        });

        // Pesquisa no conteúdo da página
        searchInContent(searchTerm);
    });
});

function searchInContent(term) {
    const walker = document.createTreeWalker(
        document.body,
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
