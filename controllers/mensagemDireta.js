const { MensagemDireta, Usuario } = require('../models');

// Listar todas as mensagens diretas
exports.listar = async (req, res) => {
  const mensagens = await MensagemDireta.findAll({
    include: [
      { model: Usuario, as: 'remetente' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  res.json(mensagens);
};

// Buscar mensagem direta por ID
exports.buscarPorId = async (req, res) => {
  const mensagem = await MensagemDireta.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'remetente' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
  res.json(mensagem);
};

// Criar nova mensagem direta
exports.criar = async (req, res) => {
  try {
    const novaMensagem = await MensagemDireta.create(req.body);
    res.status(201).json(novaMensagem);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar mensagem: ' + err.message });
  }
};

// Atualizar mensagem direta
exports.atualizar = async (req, res) => {
  const mensagem = await MensagemDireta.findByPk(req.params.id);
  if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
  await mensagem.update(req.body);
  res.json(mensagem);
};

// Remover mensagem direta
exports.remover = async (req, res) => {
  const mensagem = await MensagemDireta.findByPk(req.params.id);
  if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
  await mensagem.destroy();
  res.json({ mensagem: 'Mensagem removida com sucesso' });
};
