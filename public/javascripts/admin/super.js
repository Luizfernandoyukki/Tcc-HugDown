document.addEventListener('DOMContentLoaded', function() {
  // Filtragem de usuários
  document.getElementById('userSearch')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#usuariosTable tr').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Filtragem de postagens
  document.getElementById('postSearch')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#postagensTable tr').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Botão advertir
  document.querySelectorAll('.btn-advertir').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const nome = this.dataset.nome;
      abrirModalAdvertir(id, nome);
    });
  });

  // Botão banir
  document.querySelectorAll('.btn-banir').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      abrirModalBanir(id, false);
    });
  });

  // Botão desbanir
  document.querySelectorAll('.btn-desbanir').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      abrirModalBanir(id, true);
    });
  });

  // Botão excluir postagem (AJAX, sem alert)
  document.querySelectorAll('.btn-excluir-postagem').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const tr = this.closest('tr');
      if (confirm('Tem certeza que deseja excluir esta postagem?')) {
        fetch(`/admin/super/postagens/${id}/excluir`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
          if (data.sucesso && tr) tr.remove();
        });
      }
    });
  });

  // Função para mostrar mensagem no topo do painel
  function mostrarMensagemAdmin(msg, tipo = 'success') {
    let box = document.getElementById('admin-msg-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'admin-msg-box';
      box.className = 'alert alert-' + tipo;
      box.style.margin = '16px 0';
      document.querySelector('.container.mt-4').prepend(box);
    }
    box.textContent = msg;
    box.className = 'alert alert-' + tipo;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 4000);
  }

  // Atualiza contador de advertências na tabela
  async function atualizarContadorAdvertencias(id_usuario) {
    try {
      const res = await fetch(`/advertencias/${id_usuario}`);
      const data = await res.json();
      const badge = document.querySelector(`#usuariosTable tr td span.badge.bg-warning[data-id="${id_usuario}"]`);
      if (badge) badge.textContent = data.total;
      // LOG frontend: número de advertências do usuário
      console.log(`[FRONT][ADVERTENCIAS] Usuário ${id_usuario} tem ${data.total} advertências (tabela advertencias).`);
    } catch (err) {
      console.warn('[FRONT][ADVERTENCIAS][ERRO]', err);
    }
  }

  // Atualiza todos os contadores de advertências do painel
  async function atualizarTodosContadoresAdvertencias() {
    try {
      const res = await fetch('/advertencias/agrupadas');
      const data = await res.json();
      document.querySelectorAll('#usuariosTable tr').forEach(row => {
        const id = row.querySelector('span.badge.bg-warning')?.dataset.id;
        if (id && data[id]) {
          row.querySelector('span.badge.bg-warning').textContent = data[id].total;
        } else if (id) {
          row.querySelector('span.badge.bg-warning').textContent = '0';
        }
      });
      // LOG frontend: mapa de advertências
      console.log('[FRONT][ADVERTENCIAS][AGRUPADO]', data);
    } catch (err) {
      console.warn('[FRONT][ADVERTENCIAS][AGRUPADO][ERRO]', err);
    }
  }

  // Chama ao carregar a página
  atualizarTodosContadoresAdvertencias();

  // Modal advertir
  window.abrirModalAdvertir = function(id, nome) {
    // Fecha modal banir se estiver aberto
    document.getElementById('modalBanir').style.display = 'none';
    document.getElementById('modalAdvertir').style.display = 'block';
    window.usuarioAdvertirId = id;
    document.getElementById('modalAdvertirNome').innerText = `Advertir usuário: ${nome}`;
    document.getElementById('modalAdvertirMotivo').value = '';
    document.getElementById('modalAdvertirMsg').value = '';
    document.getElementById('btn-enviar-advertencia').disabled = false;
    atualizarContadorAdvertencias(id);
    console.log(`[FRONT][MODAL] Abrindo modal de advertir para usuário ${id} (${nome})`);
  };

  window.fecharModalAdvertir = function() {
    document.getElementById('modalAdvertir').style.display = 'none';
    window.usuarioAdvertirId = null;
    document.getElementById('btn-enviar-advertencia').disabled = false;
  };

  // Modal banir/desbanir
  window.abrirModalBanir = async function(id, desbanir) {
    // Fecha modal advertir se estiver aberto
    document.getElementById('modalAdvertir').style.display = 'none';
    document.getElementById('modalBanir').style.display = 'block';
    window.usuarioBanirId = id;
    window.isDesbanir = desbanir;
    document.getElementById('modalBanirTitulo').innerText = desbanir ? 'Desbanir Usuário' : 'Banir Usuário';
    document.getElementById('modalBanirNome').innerText = `Usuário ID: ${id}`;
    document.getElementById('modalBanirMotivoSelect').value = '';
    document.getElementById('modalBanirMotivo').value = '';
    document.getElementById('btn-enviar-banir').disabled = false;
    try {
      const res = await fetch(`/advertencias/${id}`);
      const data = await res.json();
      console.log(`[FRONT][MODAL] Abrindo modal de ${desbanir ? 'desbanir' : 'banir'} para usuário ${id}. Advertências: ${data.total}`);
      const tr = document.querySelector(`#usuariosTable tr td button[data-id="${id}"]`)?.closest('tr');
      if (tr) {
        const bloqueado = tr.querySelector('.btn-banir').style.display === 'none';
        console.log(`[FRONT][MODAL] Botão banir está ${bloqueado ? 'oculto' : 'visível'}. Botão desbanir está ${tr.querySelector('.btn-desbanir').style.display === 'none' ? 'oculto' : 'visível'}.`);
      }
    } catch (err) {
      console.warn('[FRONT][MODAL][BANIR][ERRO]', err);
    }
  };

  window.fecharModalBanir = function() {
    document.getElementById('modalBanir').style.display = 'none';
    window.usuarioBanirId = null;
    document.getElementById('btn-enviar-banir').disabled = false;
  };

  document.getElementById('btn-enviar-banir')?.addEventListener('click', function() {
    if (this.disabled) return;
    this.disabled = true;
    const motivoSelect = document.getElementById('modalBanirMotivoSelect').value;
    const detalhes = document.getElementById('modalBanirMotivo').value;
    const motivoFinal = motivoSelect + (detalhes ? ' - ' + detalhes : '');
    fetch(`/admin/super/usuarios/${window.usuarioBanirId}/${window.isDesbanir ? 'desbanir' : 'banir'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo: motivoFinal })
    }).then(res => res.json()).then(async data => {
      fecharModalBanir();
      await atualizarTodosContadoresAdvertencias();
      // Troca botões conforme status
      const tr = document.querySelector(`#usuariosTable tr td button[data-id="${window.usuarioBanirId}"]`)?.closest('tr');
      if (tr) {
        if (window.isDesbanir) {
          tr.querySelector('.btn-banir').style.display = '';
          tr.querySelector('.btn-desbanir').style.display = 'none';
        } else {
          tr.querySelector('.btn-banir').style.display = 'none';
          tr.querySelector('.btn-desbanir').style.display = '';
        }
      }
      mostrarMensagemAdmin(window.isDesbanir ? 'Usuário desbanido com sucesso!' : 'Usuário banido com sucesso!', window.isDesbanir ? 'success' : 'danger');
      this.disabled = false;
    }).catch(() => {
      mostrarMensagemAdmin('Erro ao banir/desbanir.', 'danger');
      this.disabled = false;
    });
  });

  // Aprovar documento (AJAX, sem alert) - tratar resposta JSON e mostrar mensagem amigável
  document.querySelectorAll('.aprovar-doc').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const id = this.dataset.id;
      const tr = this.closest('tr');
      this.disabled = true;
      try {
        const res = await fetch(`/admin/super/documentos/${id}/aprovar`, { method: 'POST' });
        const data = await res.json().catch(() => ({ error: 'Resposta inválida do servidor' }));
        if (res.ok && (data.success || data.sucesso || data.mensagem)) {
          const msg = data.mensagem || data.msg || 'Documento aprovado com sucesso!';
          // Mensagem inline acima da tabela
          let rowMsg = tr.querySelector('.row-msg');
          if (!rowMsg) {
            rowMsg = document.createElement('div');
            rowMsg.className = 'row-msg alert alert-success mt-2';
            tr.parentElement.insertBefore(rowMsg, tr);
          }
          rowMsg.textContent = msg;
          // remove a linha depois de curto delay para dar tempo de ver a mensagem
          setTimeout(() => { if (tr) tr.remove(); }, 900);
          mostrarMensagemAdmin(msg, 'success');
        } else {
          const errMsg = data.error || data.mensagem || 'Erro ao aprovar documento.';
          let rowMsg = tr.querySelector('.row-msg');
          if (!rowMsg) {
            rowMsg = document.createElement('div');
            rowMsg.className = 'row-msg alert alert-danger mt-2';
            tr.parentElement.insertBefore(rowMsg, tr);
          }
          rowMsg.textContent = errMsg;
          mostrarMensagemAdmin(errMsg, 'danger');
        }
      } catch (err) {
        const errMsg = 'Erro de conexão: ' + (err.message || err);
        let rowMsg = tr.querySelector('.row-msg');
        if (!rowMsg) {
          rowMsg = document.createElement('div');
          rowMsg.className = 'row-msg alert alert-danger mt-2';
          tr.parentElement.insertBefore(rowMsg, tr);
        }
        rowMsg.textContent = errMsg;
        mostrarMensagemAdmin(errMsg, 'danger');
      } finally {
        this.disabled = false;
      }
    });
  });

  // Rejeitar documento (AJAX, tratar resposta JSON e mostrar mensagem)
  document.querySelectorAll('.rejeitar-doc').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const id = this.dataset.id;
      const tr = this.closest('tr');
      this.disabled = true;
      try {
        const res = await fetch(`/admin/super/documentos/${id}/rejeitar`, { method: 'POST' });
        const data = await res.json().catch(() => ({ error: 'Resposta inválida do servidor' }));
        if (res.ok && (data.success || data.sucesso || data.mensagem)) {
          const msg = data.mensagem || data.msg || 'Documento rejeitado com sucesso!';
          let rowMsg = tr.querySelector('.row-msg');
          if (!rowMsg) {
            rowMsg = document.createElement('div');
            rowMsg.className = 'row-msg alert alert-warning mt-2';
            tr.parentElement.insertBefore(rowMsg, tr);
          }
          rowMsg.textContent = msg;
          setTimeout(() => { if (tr) tr.remove(); }, 900);
          mostrarMensagemAdmin(msg, 'warning');
        } else {
          const errMsg = data.error || data.mensagem || 'Erro ao rejeitar documento.';
          let rowMsg = tr.querySelector('.row-msg');
          if (!rowMsg) {
            rowMsg = document.createElement('div');
            rowMsg.className = 'row-msg alert alert-danger mt-2';
            tr.parentElement.insertBefore(rowMsg, tr);
          }
          rowMsg.textContent = errMsg;
          mostrarMensagemAdmin(errMsg, 'danger');
        }
      } catch (err) {
        const errMsg = 'Erro de conexão: ' + (err.message || err);
        let rowMsg = tr.querySelector('.row-msg');
        if (!rowMsg) {
          rowMsg = document.createElement('div');
          rowMsg.className = 'row-msg alert alert-danger mt-2';
          tr.parentElement.insertBefore(rowMsg, tr);
        }
        rowMsg.textContent = errMsg;
        mostrarMensagemAdmin(errMsg, 'danger');
      } finally {
        this.disabled = false;
      }
    });
  });

  // Report de comentários: excluir comentário e report (AJAX, sem alert)
  document.querySelectorAll('.btn-excluir-comentario-reportado').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const tr = this.closest('tr');
      fetch(`/admin/super/comentarios-reportados/${id}/excluir`, { method: 'POST' })
        .then(res => res.json())
        .then(data => { if (data.sucesso && tr) tr.remove(); });
    });
  });

  // Report de grupos: excluir grupo e report (AJAX, sem alert)
  document.querySelectorAll('.btn-excluir-grupo-reportado').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const tr = this.closest('tr');
      fetch(`/admin/super/reports-grupos/${id}/excluir`, { method: 'POST' })
        .then(res => res.json())
        .then(data => { if (data.sucesso && tr) tr.remove(); });
    });
  });

  // Report de eventos: excluir evento e report (AJAX, sem alert)
  document.querySelectorAll('.btn-excluir-evento-reportado').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const tr = this.closest('tr');
      fetch(`/admin/super/reports-eventos/${id}/excluir`, { method: 'POST' })
        .then(res => res.json())
        .then(data => { if (data.sucesso && tr) tr.remove(); });
    });
  });

  // Report de chats: excluir chat e report (AJAX, sem alert)
  document.querySelectorAll('.btn-excluir-chat-reportado').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const tr = this.closest('tr');
      fetch(`/admin/super/reports-chats/${id}/excluir`, { method: 'POST' })
        .then(res => res.json())
        .then(data => { if (data.sucesso && tr) tr.remove(); });
    });
  });

  // Ignorar report (qualquer tipo, AJAX, sem alert)
  document.querySelectorAll('.btn-ignorar-report').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const tipo = this.dataset.tipo; // ex: grupos, eventos, comentarios, chats
      const tr = this.closest('tr');
      fetch(`/admin/super/reports-${tipo}/${id}/dismiss`, { method: 'POST' })
        .then(res => res.json())
        .then(data => { if (data.sucesso && tr) tr.remove(); });
    });
  });

  // Aceitar report de usuário: gera advertência e remove report (AJAX, sem alert)
  document.querySelectorAll('.btn-aceitar-report-usuario').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const id_usuario = this.dataset.usuario;
      const motivo = this.dataset.motivo || 'Report aceito pelo admin';
      const tr = this.closest('tr');
      fetch(`/admin/super/usuarios/${id_usuario}/advertir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, detalhes: 'Advertência automática por report aceito.' })
      })
      .then(() => fetch(`/admin/super/reports-usuarios/${id}/review`, { method: 'POST' }))
      .then(res => res.json())
      .then(data => { if (data.sucesso && tr) tr.remove(); });
    });
  });

  // Previsualizar report (genérico para todos os tipos) - evita múltiplas requisições
  let previsualizarModalAberto = false;
  document.querySelectorAll('.btn-previsualizar-report').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (previsualizarModalAberto) return;
      previsualizarModalAberto = true;
      const id = this.dataset.id;
      const tipo = this.dataset.tipo; // comentario, grupo, evento, usuario
      const modalEl = document.getElementById('modalPrevisualizarReport');
      const conteudo = document.getElementById('modalPrevisualizarReportConteudo');
      conteudo.innerHTML = '<div class="text-center text-muted">Carregando...</div>';
      let url = '';
      if (tipo === 'comentario') url = `/admin/super/comentarios-reportados/${id}/dados`;
      else if (tipo === 'grupo') url = `/admin/super/reports-grupos/${id}/dados`;
      else if (tipo === 'evento') url = `/admin/super/reports-eventos/${id}/dados`;
      else if (tipo === 'usuario') url = `/admin/super/reports-usuarios/${id}/dados`;
      else url = `/admin/super/reports/${id}/dados`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        let html = '';
        if (tipo === 'comentario') {
          html = `<b>Comentário:</b><br><div style="white-space:pre-line">${data.conteudo || ''}</div>`;
        } else if (tipo === 'grupo') {
          html = `<b>Grupo:</b> ${data.nome_grupo || ''}<br><b>Descrição:</b><br><div style="white-space:pre-line">${data.descricao_grupo || ''}</div>`;
        } else if (tipo === 'evento') {
          html = `<b>Evento:</b> ${data.titulo_evento || ''}<br><b>Descrição:</b><br><div style="white-space:pre-line">${data.descricao_evento || ''}</div>`;
        } else if (tipo === 'usuario') {
          html = `<b>Usuário:</b> ${data.nome_usuario || ''}<br><b>Motivo:</b> ${data.motivo || ''}<br><b>Detalhes:</b> ${data.detalhes || ''}`;
        } else {
          html = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        conteudo.innerHTML = html;
      } catch (err) {
        conteudo.innerHTML = '<div class="text-danger">Erro ao carregar dados.</div>';
      }
      // Use Bootstrap modal API para garantir foco correto
      let modal;
      try {
        modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      } catch {
        modal = new bootstrap.Modal(modalEl);
      }
      modal.show();
      // Ao fechar, libera flag para permitir nova abertura
      modalEl.addEventListener('hidden.bs.modal', function handler() {
        previsualizarModalAberto = false;
        modalEl.removeEventListener('hidden.bs.modal', handler);
      });
    });
  });

  // Fechar modais
  document.querySelectorAll('.btn-close-modal, .btn-cancel-advertir, .btn-cancel-banir').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.target;
      if (targetId) {
        document.getElementById(targetId).style.display = 'none';
      }
    });
  });
});
