document.addEventListener('DOMContentLoaded', function () {
  // Supondo que os grupos populares já estejam disponíveis em uma variável global window.gruposPopulares
  if (!window.gruposPopulares || !window.gruposPopulares.length) return;

  const postsContainer = document.querySelector('.row.justify-content-center .col-12.col-md-10.col-lg-8');
  if (!postsContainer) return;

  const postCards = postsContainer.querySelectorAll('.card.mb-2.shadow-sm');
  for (let i = 20; i < postCards.length; i += 20) {
    // Cria o bloco de grupos populares
    const gruposBox = document.createElement('div');
    gruposBox.className = 'grupos-populares-box my-4 p-3 bg-light rounded-3 shadow';
    gruposBox.innerHTML = `
      <h5 class="text-primary mb-3">Grupos Populares</h5>
      <div class="d-flex flex-wrap gap-3 justify-content-center">
        ${window.gruposPopulares.map(grupo => `
          <a href="/grupos/${grupo.id_grupo}" class="text-decoration-none">
            <div class="grupo-card p-2 bg-white rounded-2 shadow-sm text-center" style="min-width:120px;max-width:180px;">
              <img class="mb-2 rounded-circle" src="${grupo.foto_grupo || '/images/default-group.png'}" alt="${grupo.nome_grupo}" width="48" height="48">
              <div class="fw-bold">${grupo.nome_grupo}</div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
    // Insere após o 20º, 40º, etc
    postCards[i - 1].after(gruposBox);
  }

  // Carrossel de tags: mostra sempre 3 centralizadas e rola de 3 em 3
  const carousel = document.querySelector('.tags-carousel');
  if (!carousel) return;
  if (window.innerWidth <= 575) return; // Não roda carrossel no mobile
  const tags = carousel.children;
  const visible = 3;
  let index = 0;
  setInterval(() => {
    if (tags.length <= visible) return;
    index = (index + 1) % (tags.length - visible + 1);
    carousel.style.transform = `translateX(-${index * 120}px)`;
  }, 5000);

  // Carrossel de grupos populares: mostra sempre 3 centralizados e rola de 3 em 3
  const gruposCarousel = document.querySelector('.grupos-carousel');
  if (!gruposCarousel) return;
  if (window.innerWidth <= 575) return; // Não roda carrossel no mobile
  const grupos = gruposCarousel.children;
  const visibleGrupos = 3;
  let grupoIndex = 0;
  setInterval(() => {
    if (grupos.length <= visibleGrupos) return;
    grupoIndex = (grupoIndex + 1) % (grupos.length - visibleGrupos + 1);
    gruposCarousel.style.transform = `translateX(-${grupoIndex * 146}px)`; // 130 + margem
  }, 5000);

  // Função para rolar horizontalmente
  function setupScrollArrows(wrapperSelector, scrollSelector, leftArrowSelector, rightArrowSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;
    const scroll = wrapper.querySelector(scrollSelector);
    const left = wrapper.querySelector(leftArrowSelector);
    const right = wrapper.querySelector(rightArrowSelector);
    if (!scroll || !left || !right) return;

    left.addEventListener('click', () => {
      scroll.scrollBy({ left: -200, behavior: 'smooth' });
    });
    right.addEventListener('click', () => {
      scroll.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Esconde seta se não precisa rolar
    function updateArrows() {
      if (scroll.scrollWidth > scroll.clientWidth + 5) {
        left.style.visibility = 'visible';
        right.style.visibility = 'visible';
      } else {
        left.style.visibility = 'hidden';
        right.style.visibility = 'hidden';
      }
    }
    updateArrows();
    window.addEventListener('resize', updateArrows);
  }

  setupScrollArrows('.categorias-scroll-wrapper', '.categorias-scroll', '.categorias-arrow.left', '.categorias-arrow.right');
  setupScrollArrows('.tags-scroll-wrapper', '.tags-scroll', '.tags-arrow.left', '.tags-arrow.right');
});

window.mostrarMaisCategorias = function(event) {
  document.getElementById('outras-categorias').style.display = 'flex';
  // Opcional: esconder o botão "Ver mais"
  event.target.style.display = 'none';
};