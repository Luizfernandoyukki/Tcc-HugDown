const { Curtida, Postagem, Usuario } = require('../models');

exports.listar = async (req, res) => {
  const curtidas = await Curtida.findAll({
    include: [
      { model: Postagem, as: 'postagem' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  res.json(curtidas);
};

exports.buscarPorId = async (req, res) => {
  const curtida = await Curtida.findByPk(req.params.id, {
    include: [
      { model: Postagem, as: 'postagem' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  if (!curtida) return res.status(404).json({ error: 'Curtida não encontrada' });
  res.json(curtida);
};

exports.criar = async (req, res) => {
  try {
    const novaCurtida = await Curtida.create(req.body);
    res.status(201).json(novaCurtida);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar curtida: ' + err.message });
  }
};

exports.remover = async (req, res) => {
  const curtida = await Curtida.findByPk(req.params.id);
  if (!curtida) return res.status(404).json({ error: 'Curtida não encontrada' });
  await curtida.destroy();
  res.json({ mensagem: 'Curtida removida com sucesso' });
};
