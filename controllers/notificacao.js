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

// Função utilitária para criar notificação
exports.criarNotificacao = async ({
  id_usuario,
  tipo_notificacao,
  titulo,
  mensagem,
  url_relacionada = null,
  id_amizade = null,
  id_grupo = null
}) => {
  const { Notificacao } = require('../models');
  const data = {
    id_usuario,
    tipo_notificacao,
    titulo,
    mensagem,
    url_relacionada
  };
  if (id_amizade) data.id_amizade = id_amizade;
  if (id_grupo) data.id_grupo = id_grupo;
  await Notificacao.create(data);
  // ...push notification se necessário...
};
