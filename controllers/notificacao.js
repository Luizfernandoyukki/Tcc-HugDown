const { Notificacao, Usuario } = require('../models');

// Listar todas as notificações
exports.listar = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findAll({
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(notificacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar notificação por ID
exports.buscarPorId = async (req, res) => {
  try {
    const notificacao = await Notificacao.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    res.json(notificacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova notificação
exports.criar = async (req, res) => {
  try {
    const novaNotificacao = await Notificacao.create(req.body);
    res.status(201).json(novaNotificacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar notificação
exports.atualizar = async (req, res) => {
  try {
    const notificacao = await Notificacao.findByPk(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    await notificacao.update(req.body);
    res.json(notificacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover notificação
exports.remover = async (req, res) => {
  try {
    const notificacao = await Notificacao.findByPk(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    await notificacao.destroy();
    res.json({ mensagem: 'Notificação removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};