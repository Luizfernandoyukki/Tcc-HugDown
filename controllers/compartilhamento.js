const { Compartilhamento, Postagem, Usuario } = require('../models');

exports.listar = async (req, res) => {
  const compartilhamentos = await Compartilhamento.findAll({
    include: [
      { model: Postagem, as: 'postagem' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  res.json(compartilhamentos);
};

exports.buscarPorId = async (req, res) => {
  const compartilhamento = await Compartilhamento.findByPk(req.params.id, {
    include: [
      { model: Postagem, as: 'postagem' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  if (!compartilhamento) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
  res.json(compartilhamento);
};

exports.criar = async (req, res) => {
  try {
    const novoCompartilhamento = await Compartilhamento.create(req.body);
    res.status(201).json(novoCompartilhamento);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar compartilhamento: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const compartilhamento = await Compartilhamento.findByPk(req.params.id);
  if (!compartilhamento) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
  await compartilhamento.update(req.body);
  res.json(compartilhamento);
};

exports.remover = async (req, res) => {
  const compartilhamento = await Compartilhamento.findByPk(req.params.id);
  if (!compartilhamento) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
  await compartilhamento.destroy();
  res.json({ mensagem: 'Compartilhamento removido com sucesso' });
};
