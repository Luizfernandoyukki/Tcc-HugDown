const { MensagemDireta, Usuario } = require('../models');

// Listar todas as mensagens diretas
exports.listar = async (req, res) => {
  try {
    const mensagens = await MensagemDireta.findAll({
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens diretas: ' + error.message });
  }
};

// Buscar mensagem direta por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const mensagem = await MensagemDireta.findByPk(id, {
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagem direta: ' + error.message });
  }
};

// Criar nova mensagem direta
exports.criar = async (req, res) => {
  try {
    const { id_remetente, id_destinatario, conteudo, url_midia, tipo_midia, lida } = req.body;
    // Validação dos campos obrigatórios
    if (!id_remetente || !id_destinatario) {
      return res.status(400).json({ error: 'Preencha id_remetente e id_destinatario.' });
    }
    const novaMensagem = await MensagemDireta.create({
      id_remetente,
      id_destinatario,
      conteudo,
      url_midia,
      tipo_midia,
      lida: lida !== undefined ? lida : false
    });
    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar mensagem direta: ' + error.message });
  }
};

// Atualizar mensagem direta
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const mensagem = await MensagemDireta.findByPk(id, {
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    await mensagem.update(req.body);
    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mensagem direta: ' + error.message });
  }
};

// Remover mensagem direta
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const mensagem = await MensagemDireta.findByPk(id);
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    await mensagem.destroy();
    res.json({ message: 'Mensagem removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover mensagem direta: ' + error.message });
  }
};
