const { Notificacao, Usuario } = require('../models');

// Listar todas as notificações
exports.listar = async (req, res) => {
  const notificacoes = await Notificacao.findAll({
    include: [{ model: Usuario, as: 'usuario' }]
  });
  res.json(notificacoes);
};

// Buscar notificação por ID
exports.buscarPorId = async (req, res) => {
  const notificacao = await Notificacao.findByPk(req.params.id, {
    include: [{ model: Usuario, as: 'usuario' }]
  });
  if (!notificacao) return res.status(404).json({ error: 'Notificação não encontrada' });
  res.json(notificacao);
};

// Criar nova notificação
exports.criar = async (req, res) => {
  try {
    const novaNotificacao = await Notificacao.create(req.body);
    res.status(201).json(novaNotificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar notificação: ' + err.message });
  }
};

// Atualizar notificação
exports.atualizar = async (req, res) => {
  const notificacao = await Notificacao.findByPk(req.params.id);
  if (!notificacao) return res.status(404).json({ error: 'Notificação não encontrada' });
  await notificacao.update(req.body);
  res.json(notificacao);
};

// Remover notificação
exports.remover = async (req, res) => {
  const notificacao = await Notificacao.findByPk(req.params.id);
  if (!notificacao) return res.status(404).json({ error: 'Notificação não encontrada' });
  await notificacao.destroy();
  res.json({ mensagem: 'Notificação removida com sucesso' });
};
