const { CategoriaTraducao, Categoria, Idioma } = require('../models');

exports.listar = async (req, res) => {
  const traducoes = await CategoriaTraducao.findAll({
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Idioma, as: 'idioma' }
    ]
  });
  res.json(traducoes);
};

exports.buscarPorId = async (req, res) => {
  const traducao = await CategoriaTraducao.findOne({
    where: { id_categoria: req.params.id_categoria, codigo_idioma: req.params.codigo_idioma },
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Idioma, as: 'idioma' }
    ]
  });
  if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
  res.json(traducao);
};

exports.criar = async (req, res) => {
  try {
    const novaTraducao = await CategoriaTraducao.create(req.body);
    res.status(201).json(novaTraducao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tradução: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const traducao = await CategoriaTraducao.findOne({
    where: { id_categoria: req.params.id_categoria, codigo_idioma: req.params.codigo_idioma }
  });
  if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
  await traducao.update(req.body);
  res.json(traducao);
};

exports.remover = async (req, res) => {
  const traducao = await CategoriaTraducao.findOne({
    where: { id_categoria: req.params.id_categoria, codigo_idioma: req.params.codigo_idioma }
  });
  if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
  await traducao.destroy();
  res.json({ mensagem: 'Tradução removida com sucesso' });
};
