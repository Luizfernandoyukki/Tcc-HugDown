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
    res.status(500).json({ error: error.message });
  }
};

// Buscar mensagem direta por ID
exports.buscarPorId = async (req, res) => {
  try {
    const mensagem = await MensagemDireta.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova mensagem direta
exports.criar = async (req, res) => {
  try {
    const novaMensagem = await MensagemDireta.create(req.body);
    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar mensagem direta
exports.atualizar = async (req, res) => {
  try {
    const mensagem = await MensagemDireta.findByPk(req.params.id);
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    await mensagem.update(req.body);
    res.json(mensagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover mensagem direta
exports.remover = async (req, res) => {
  try {
    const mensagem = await MensagemDireta.findByPk(req.params.id);
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    await mensagem.destroy();
    res.json({ mensagem: 'Mensagem removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};