// Emoji picker simples
if (!window.customElements.get('emoji-picker')) {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-dm');
  const btnEmoji = document.getElementById('btn-emoji');
  const inputMsg = document.getElementById('mensagem');
  const btnClip = document.getElementById('btn-clip');
  const inputImg = document.getElementById('imagem-chat');
  const btnEnviar = document.getElementById('btn-enviar-msg');
  const msgBox = document.querySelector('.dm-messages');
  const temaSelect = document.getElementById('tema-chat');
  const amigoId = form.action.match(/conversa\/(\d+)/)[1];

  // Emoji picker popup usando emoji-picker-element
  let emojiPicker = null;
  btnEmoji.addEventListener('click', function(e) {
    e.preventDefault();
    if (emojiPicker) {
      emojiPicker.remove();
      emojiPicker = null;
      return;
    }
    emojiPicker = document.createElement('emoji-picker');
    emojiPicker.style.position = 'absolute';
    emojiPicker.style.zIndex = 1000;
    const rect = btnEmoji.getBoundingClientRect();
    emojiPicker.style.left = rect.left + 'px';
    emojiPicker.style.top = (rect.bottom + window.scrollY) + 'px';
    document.body.appendChild(emojiPicker);

    emojiPicker.addEventListener('emoji-click', event => {
      inputMsg.value += event.detail.unicode;
      emojiPicker.remove();
      emojiPicker = null;
      inputMsg.focus();
    });

    // Fecha ao clicar fora
    setTimeout(() => {
      document.addEventListener('mousedown', function handler(ev) {
        if (emojiPicker && !emojiPicker.contains(ev.target) && ev.target !== btnEmoji) {
          emojiPicker.remove();
          emojiPicker = null;
          document.removeEventListener('mousedown', handler);
        }
      });
    }, 10);
  });

  // Clique no clipe abre o file input
  btnClip.addEventListener('click', function(e) {
    if (e.target.tagName !== 'INPUT') {
      inputImg.click();
    }
  });

  // Mostra o nome do arquivo selecionado ACIMA do campo de digitação (inputMsg)
  const fileNameDiv = document.createElement('div');
  fileNameDiv.id = 'file-name-preview';
  fileNameDiv.style.fontSize = '0.95em';
  fileNameDiv.style.color = '#198754';
  fileNameDiv.style.marginBottom = '4px';

  // Insere o preview logo acima do campo de digitação
  inputMsg.parentNode.parentNode.insertBefore(fileNameDiv, inputMsg.parentNode);

  inputImg.addEventListener('change', function() {
    if (inputImg.files && inputImg.files.length > 0) {
      fileNameDiv.textContent = 'Arquivo selecionado: ' + inputImg.files[0].name;
    } else {
      fileNameDiv.textContent = '';
    }
  });

  // Atualização automática das mensagens (polling simples)
  async function atualizarMensagens(scrollToBottom = false) {
    try {
      const res = await fetch(`/mensagens-diretas/conversa/${amigoId}/json`);
      if (!res.ok) return;
      const data = await res.json();
      let novoHtml = '';
      if (!data.mensagens.length) {
        novoHtml = '<p class="text-muted">Nenhuma mensagem ainda.</p>';
      } else {
        data.mensagens.forEach(m => {
          novoHtml += `
            <div class="d-flex mb-2 ${m.id_remetente === data.usuario.id_usuario ? 'justify-content-end' : 'justify-content-start'}">
              <div class="dm-bubble p-2 rounded" style="background:${m.id_remetente === data.usuario.id_usuario ? '#e0ffe0' : '#f0f0f0'};max-width:70%;">
                <span class="small text-muted">${m.id_remetente === data.usuario.id_usuario ? 'Você' : data.amigo.nome_usuario}</span>
                ${m.emoji ? `<span class="fs-3 ms-2">${m.emoji}</span>` : ''}
                ${m.url_midia ? `<img class="img-fluid me-2" src="${m.url_midia}" alt="Imagem" style="max-width:120px;max-height:120px;">` : ''}
                <br>${m.conteudo || ''}
                <br><span class="text-muted small">${new Date(m.data_envio).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          `;
        });
      }
      // Atualiza o chat e sempre faz scroll para o final ao recarregar ou enviar
      msgBox.innerHTML = novoHtml;
      msgBox.scrollTop = msgBox.scrollHeight;
    } catch (err) {}
  }

  // Polling rápido para atualização em tempo quase real
  setInterval(() => atualizarMensagens(), 1200);

  // Remova qualquer listener duplicado antes de adicionar
  if (window._dmSubmitHandler) {
    form.removeEventListener('submit', window._dmSubmitHandler);
  }
  // Adicione apenas UMA VEZ o listener de submit
  window._dmSubmitHandler = async function(e) {
    e.preventDefault();
    if (form.classList.contains('enviando-msg')) return; // já está enviando, ignora

    btnEnviar.disabled = true;
    form.classList.add('enviando-msg');
    setTimeout(() => form.classList.remove('enviando-msg'), 1200);

    // Garante que o campo não está desabilitado ou readonly
    inputMsg.disabled = false;
    inputMsg.readOnly = false;
    form.querySelector('[name="conteudo"]').value = inputMsg.value;
    const formData = new FormData(form);
    const conteudo = (formData.get('conteudo') || '').trim();
    const temImagem = inputImg.files.length > 0;
    if (!conteudo && !temImagem) {
      btnEnviar.disabled = false;
      inputMsg.focus();
      return;
    }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData
      });
      inputMsg.value = '';
      inputImg.value = '';
      fileNameDiv.textContent = '';
      if (res.ok) {
        await atualizarMensagens(true);
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
    btnEnviar.disabled = false;
  };
  form.addEventListener('submit', window._dmSubmitHandler);

  // Carrega mensagens ao abrir a tela e sempre faz scroll para o final
  atualizarMensagens(true);

  // Troca de tema (carrega CSS diferente)
  function aplicarTemaChat(tema) {
    document.body.className = 'tema-' + tema;
    // Remove CSS antigo
    document.querySelectorAll('link[data-chat-tema]').forEach(link => link.remove());
    // Carrega CSS do tema se não for padrão
    if (tema !== 'padrao') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/stylesheets/mensagensDiretas/tema-${tema}.css`;
      link.setAttribute('data-chat-tema', 'true');
      document.head.appendChild(link);
    }
  }
  if (temaSelect) {
    temaSelect.addEventListener('change', function() {
      aplicarTemaChat(this.value);
      // Salvar tema no backend se quiser persistir
    });
    // Aplica o tema inicial
    aplicarTemaChat(temaSelect.value);
  }

  // Modal denunciar amigo
  function abrirModalDenunciarAmigo() {
    // Cria modal se não existir
    let modal = document.getElementById('modalDenunciarAmigo');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalDenunciarAmigo';
      modal.className = 'modal fade show';
      modal.style.display = 'block';
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Denunciar Amigo</h5>
              <button type="button" class="btn-close" id="fecharModalDenunciarAmigo"></button>
            </div>
            <div class="modal-body">
              <form id="formDenunciarAmigo">
                <div class="mb-3">
                  <label for="motivoDenuncia" class="form-label">Motivo</label>
                  <select class="form-select" id="motivoDenuncia" name="motivo" required>
                    <option value="spam">Spam</option>
                    <option value="ofensa">Ofensa</option>
                    <option value="conteudo_inadequado">Conteúdo inadequado</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="detalhesDenuncia" class="form-label">Detalhes</label>
                  <textarea class="form-control" id="detalhesDenuncia" name="detalhes" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-danger">Enviar denúncia</button>
              </form>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      // Fecha modal
      modal.querySelector('#fecharModalDenunciarAmigo').onclick = () => modal.remove();
      // Envio AJAX
      modal.querySelector('#formDenunciarAmigo').onsubmit = async function(e) {
        e.preventDefault();
        const motivo = modal.querySelector('#motivoDenuncia').value;
        const detalhes = modal.querySelector('#detalhesDenuncia').value;
        try {
          await fetch('/report-amigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_destinatario: amigoId,
              motivo,
              detalhes
            })
          });
          modal.remove();
          alert('Denúncia enviada com sucesso!');
        } catch (err) {
          alert('Erro ao enviar denúncia.');
        }
      };
    }
  }

  // Botão denunciar amigo
  document.getElementById('btn-denunciar-amigo')?.addEventListener('click', function() {
    abrirModalDenunciarAmigo();
  });

  // Botão deletar amigo
  document.getElementById('btn-deletar-amigo')?.addEventListener('click', function() {
    if (confirm('Deseja remover este amigo?')) {
      fetch(`/amizades/remover/${amigoId}`, { method: 'POST' })
        .then(() => location.href = '/mensagens-diretas');
    }
  });
});