document.addEventListener('DOMContentLoaded', function () {
  // Filtro por categoria/tag
  document.querySelectorAll('.categoria-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.categoria;
      if (!categoria) {
        // Botão "Todas" - remove filtro
        window.location.href = '/feed';
      } else {
        window.location.href = `/feed?categoria=${categoria}`;
      }
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
          // Inverta a ordem para mostrar os mais recentes no topo
          comentarios.reverse().forEach(c => {
            const div = document.createElement('div');
            div.innerHTML = `<b>@${c.autor.nome_usuario}</b>: ${c.conteudo}`;
            lista.appendChild(div);
          });
          lista.scrollTop = 0; // Foca no topo
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
  const textareaAba = formAba.querySelector('textarea');

  // Envia ao pressionar Enter (tecla comum), mas não Enter do teclado numérico
  textareaAba.addEventListener('keydown', function(ev) {
    if (
      ev.key === 'Enter' &&
      !ev.shiftKey &&
      ev.code === 'Enter' && // Garante que é o Enter principal
      ev.location === 0 // 0 = teclado principal, 3 = numpad
    ) {
      ev.preventDefault();
      formAba.requestSubmit();
    }
  });

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
        // Inverta a ordem para mostrar os mais recentes no topo
        comentarios.reverse().forEach(c => {
          const div = document.createElement('div');
          div.innerHTML = `<b>@${c.autor.nome_usuario}</b>: ${c.conteudo}`;
          lista.appendChild(div);
        });
        lista.scrollTop = 0; // Foca no topo
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

  // Modal de report
  let modalReport = document.getElementById('modal-report');
  if (!modalReport) {
    modalReport = document.createElement('div');
    modalReport.id = 'modal-report';
    modalReport.style.display = 'none';
    modalReport.style.position = 'fixed';
    modalReport.style.top = '0';
    modalReport.style.left = '0';
    modalReport.style.width = '100vw';
    modalReport.style.height = '100vh';
    modalReport.style.background = 'rgba(0,0,0,0.3)';
    modalReport.style.zIndex = '5000';
    modalReport.innerHTML = `
      <div style="background:#fff;max-width:350px;margin:10vh auto;padding:1.5rem 1rem;border-radius:12px;box-shadow:0 2px 16px #0002;position:relative;">
        <button id="fechar-modal-report" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:1.3rem;">&times;</button>
        <h5>Reportar postagem</h5>
        <form id="form-report">
          <label for="motivo-report">Motivo:</label>
          <select id="motivo-report" required style="width:100%;margin-bottom:1rem;">
            <option value="">Selecione...</option>
            <option value="Conteúdo impróprio">Conteúdo impróprio</option>
            <option value="Spam ou publicidade">Spam ou publicidade</option>
            <option value="Assédio ou bullying">Assédio ou bullying</option>
            <option value="Informação falsa">Informação falsa</option>
            <option value="Violação de direitos autorais">Violação de direitos autorais</option>
            <option value="Outro">Outro</option>
          </select>
          <button type="submit" class="btn btn-danger w-100">Enviar report</button>
        </form>
      </div>
    `;
    document.body.appendChild(modalReport);
  }

  // Abrir modal ao clicar em reportar
  document.querySelectorAll('.reportar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      modalReport.style.display = 'block';
      modalReport.dataset.idPostagem = btn.closest('.card-postagem').dataset.id;
    });
  });

  // Fechar modal
  modalReport.addEventListener('click', function(e) {
    if (e.target === modalReport || e.target.id === 'fechar-modal-report') {
      modalReport.style.display = 'none';
    }
  });

  // Enviar report
  modalReport.querySelector('#form-report').onsubmit = async function(ev) {
    ev.preventDefault();
    const motivo = modalReport.querySelector('#motivo-report').value;
    const id_postagem = modalReport.dataset.idPostagem;
    if (!motivo || !id_postagem) return;
    // Envia para API
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_postagem, motivo })
    });
    if (res.ok) {
      alert('Report enviado! Obrigado pelo feedback.');
      modalReport.style.display = 'none';
    } else {
      alert('Erro ao enviar report.');
    }
  };

  // Ir para perfil do autor ao clicar na foto/nome
  document.querySelectorAll('.card-postagem .foto-autor, .card-postagem .nome-autor').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = el.closest('.card-postagem');
      if (!card) return;
      const autorId = card.dataset.idAutor || card.getAttribute('data-id-autor');
      const usuarioLogadoId = window.usuarioLogadoId;
      if (autorId && usuarioLogadoId) {
        if (String(autorId) === String(usuarioLogadoId)) {
          window.location.href = `/usuarios/index/${autorId}`;
        } else {
          window.location.href = `/usuarios/show/${autorId}`;
        }
      }
    });
  });
});
