document.addEventListener('DOMContentLoaded', function () {
  // Filtro por categoria/tag
  document.querySelectorAll('.categoria-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.categoria;
      window.location.href = `/feed?categoria=${categoria}`;
    });
  });
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      window.location.href = `/feed?tag=${tag}`;
    });
  });

  // Mostrar todas as tags (menu lateral)
  const mostrarTodasBtn = document.getElementById('mostrar-todas-tags');
  const menuLateral = document.getElementById('menu-lateral-tags');
  if (mostrarTodasBtn && menuLateral) {
    mostrarTodasBtn.addEventListener('click', () => {
      menuLateral.classList.add('ativo');
    });
    document.getElementById('fechar-menu-lateral').addEventListener('click', () => {
      menuLateral.classList.remove('ativo');
    });
  }

  // Incrementa visualização ao renderizar cada card
  document.querySelectorAll('.card-postagem').forEach(card => {
    const id = card.dataset.id;
    fetch(`/api/postagens/${id}/visualizar`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        const visualizacoesSpan = card.querySelector('.visualizacoes span');
        if (visualizacoesSpan) visualizacoesSpan.textContent = data.visualizacoes;
      });
  });

  // Curtir/descurtir post
  document.querySelectorAll('.curtir-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      // Alterna curtida no backend
      const res = await fetch(`/api/postagens/${id}/curtir-toggle`, { method: 'POST' });
      const data = await res.json();
      // Atualiza o contador no card
      const card = btn.closest('.card-postagem');
      if (card) {
        const countSpan = card.querySelector('.curtidas-count');
        if (countSpan) countSpan.textContent = data.curtidas || 0;
      }
    });
  });

  // Comentários: exibe aba inferior fixa
  document.querySelectorAll('.comentar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const aba = document.getElementById('comentarios-aba');
      aba.classList.add('ativo');
      aba.dataset.idPostagem = id;
      // Carrega comentários via API
      fetch(`/api/postagens/${id}/comentarios`)
        .then(res => res.json())
        .then(comentarios => {
          const lista = aba.querySelector('.comentarios-list-aba');
          lista.innerHTML = '';
          comentarios.forEach(c => {
            const div = document.createElement('div');
            div.innerHTML = `<b>@${c.autor.nome_usuario}</b>: ${c.conteudo}`;
            lista.appendChild(div);
          });
          lista.scrollTop = lista.scrollHeight;
        });
      // Foca textarea
      setTimeout(() => {
        aba.querySelector('textarea').focus();
      }, 200);
    });
  });

  // Enviar comentário na aba inferior
  const aba = document.getElementById('comentarios-aba');
  const formAba = aba.querySelector('.comentar-form-aba');
  formAba.onsubmit = async function (ev) {
    ev.preventDefault();
    const id = aba.dataset.idPostagem;
    const conteudo = formAba.querySelector('textarea').value;
    if (!conteudo) return;
    await fetch(`/api/postagens/${id}/comentar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conteudo })
    });
    formAba.querySelector('textarea').value = '';
    // Atualiza comentários
    fetch(`/api/postagens/${id}/comentarios`)
      .then(res => res.json())
      .then(comentarios => {
        const lista = aba.querySelector('.comentarios-list-aba');
        lista.innerHTML = '';
        comentarios.forEach(c => {
          const div = document.createElement('div');
          div.innerHTML = `<b>@${c.autor.nome_usuario}</b>: ${c.conteudo}`;
          lista.appendChild(div);
        });
        lista.scrollTop = lista.scrollHeight;
      });
  };

  // Fechar aba de comentários ao clicar fora dela (opcional)
  document.addEventListener('click', function (e) {
    const aba = document.getElementById('comentarios-aba');
    if (aba.classList.contains('ativo')) {
      if (!aba.contains(e.target) && !e.target.classList.contains('comentar-btn')) {
        aba.classList.remove('ativo');
      }
    }
  });

  // Fechar modal de comentário
  document.querySelectorAll('.modal-comentario').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('ativo');
    });
  });

  // Reportar postagem
  document.querySelectorAll('.reportar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Postagem reportada! Obrigado pelo feedback.');
      // Aqui pode enviar para backend se desejar
    });
  });

  // Ir para perfil do autor ao clicar na foto/nome
  document.querySelectorAll('.card-postagem .foto-autor, .card-postagem .nome-autor').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = el.closest('.card-postagem');
      const id = card ? card.dataset.id : null;
      if (id && card) {
        const autor = card.querySelector('.nome-autor').textContent.replace('@', '');
        window.location.href = `/usuarios/show/${autor}`;
      }
    });
  });
});
  });
});
