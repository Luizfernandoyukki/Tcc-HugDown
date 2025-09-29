document.addEventListener('DOMContentLoaded', function() {
  // Exibe o próprio perfil do usuário logado
  if (window.usuario && window.usuario.nome_usuario) {
    const userInfo = document.getElementById('usuario-info');
    if (userInfo) {
      userInfo.textContent = `Meu perfil: ${window.usuario.nome_usuario} | Email: ${window.usuario.email}`;
    }
    // Exibe postagens do próprio usuário
    const postagensDiv = document.getElementById('usuario-postagens');
    if (postagensDiv && window.usuario.postagens && window.usuario.postagens.length) {
      postagensDiv.innerHTML = '<h4>Minhas Postagens:</h4>' + window.usuario.postagens.map(p => `<div class='post'><b>${p.titulo || 'Sem título'}</b><br>${p.resumo || ''}</div>`).join('');
    }
    // Exibe amigos do próprio usuário (se vier no objeto)
    const amigosDiv = document.getElementById('usuario-amigos');
    if (amigosDiv && window.usuario.amigos && window.usuario.amigos.length) {
      amigosDiv.innerHTML = '<h4>Meus Amigos:</h4>' + window.usuario.amigos.map(a => `<span class='amigo'>${a.nome_usuario}</span>`).join(', ');
    }
    // Exemplo: exibir nome do usuário no console
    console.log('Meu perfil:', window.usuario.nome_usuario);
    // Aqui você pode adicionar interatividade extra se quiser
  }

  // Modal de pedidos de amizade
  const btnPedidos = document.getElementById('btn-pedidos-amizade');
  const modalPedidos = document.getElementById('modal-pedidos-amizade');
  const listaPedidos = document.getElementById('lista-pedidos-amizade');
  const btnFecharModal = modalPedidos ? modalPedidos.querySelector('.btn-secondary[data-bs-dismiss="modal"]') : null;

  // Bootstrap modal
  let bsModal = null;
  if (window.bootstrap && modalPedidos) {
    bsModal = new bootstrap.Modal(modalPedidos);
  }

  if (btnPedidos && bsModal) {
    btnPedidos.addEventListener('click', async function() {
      listaPedidos.innerHTML = '<li class="list-group-item text-muted">Carregando...</li>';
      try {
        const res = await fetch('/amizades/pedidos');
        const pedidos = await res.json();
        if (pedidos && pedidos.length) {
          listaPedidos.innerHTML = '';
          pedidos.forEach(p => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center justify-content-between';
            li.innerHTML = `
              <div>
                <img src="${p.solicitante.foto_perfil || '/images/default-user.png'}" alt="${p.solicitante.nome_usuario}" width="32" height="32" class="rounded-circle me-2" />
                <b>${p.solicitante.nome_usuario}</b>
              </div>
              <div>
                <button class="btn btn-success btn-sm me-2 btn-aceitar" data-id="${p.id_amizade}">Aceitar</button>
                <button class="btn btn-danger btn-sm btn-rejeitar" data-id="${p.id_amizade}">Rejeitar</button>
              </div>
            `;
            listaPedidos.appendChild(li);
          });
        } else {
          listaPedidos.innerHTML = '<li class="list-group-item text-muted">Nenhum pedido de amizade pendente.</li>';
        }
      } catch (err) {
        listaPedidos.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar pedidos.</li>';
      }
      bsModal.show();
    });
  }

  // Handler para aceitar/rejeitar pedido
  if (listaPedidos) {
    listaPedidos.addEventListener('click', async function(e) {
      if (e.target.classList.contains('btn-aceitar') || e.target.classList.contains('btn-rejeitar')) {
        const id = e.target.getAttribute('data-id');
        const acao = e.target.classList.contains('btn-aceitar') ? 'aceitar' : 'rejeitar';
        try {
          const res = await fetch(`/amizades/${acao}/${id}`, { method: 'POST' });
          if (res.ok) {
            e.target.closest('li').remove();
          }
        } catch (err) {
          alert('Erro ao processar pedido.');
        }
      }
    });
  }

  // Corrige foco e backdrop ao fechar modal
  if (btnFecharModal && bsModal) {
    btnFecharModal.addEventListener('click', function() {
      btnFecharModal.blur();
      bsModal.hide();
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style = '';
      }, 300);
    });
  }

  // Corrige backdrop e body travado ao fechar modal
  if (modalPedidos) {
    modalPedidos.addEventListener('hidden.bs.modal', function() {
      // Remove backdrop manualmente se ainda existir
      setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      }, 100);
    });
  }
});