const { SecaoTraducao, Secao, Idioma } = require('../models');

// Listar todas as traduções de seções
exports.listar = async (req, res) => {
  const traducoes = await SecaoTraducao.findAll({
    include: [
      { model: Secao, as: 'secao' },
      { model: Idioma, as: 'idioma' }
    ]
  });
  res.json(traducoes);
};

// Buscar tradução por seção e idioma
exports.buscarPorId = async (req, res) => {
  const traducao = await SecaoTraducao.findOne({
    where: { id_secao: req.params.id_secao, codigo_idioma: req.params.codigo_idioma },
    include: [
      { model: Secao, as: 'secao' },
      { model: Idioma, as: 'idioma' }
    ]
  });
  if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
  res.json(traducao);
};

// Criar nova tradução
exports.criar = async (req, res) => {
  try {
    const novaTraducao = await SecaoTraducao.create(req.body);
    res.status(201).json(novaTraducao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tradução: ' + err.message });
  }
};

// Atualizar tradução
exports.atualizar = async (req, res) => {
  const traducao = await SecaoTraducao.findOne({
    where: { id_secao: req.params.id_secao, codigo_idioma: req.params.codigo_idioma }
  });
  if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
  await traducao.update(req.body);
  res.json(traducao);
};

// Remover tradução
exports.remover = async (req, res) => {
  const traducao = await SecaoTraducao.findOne({
    where: { id_secao: req.params.id_secao, codigo_idioma: req.params.codigo_idioma }
  });
  if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
  await traducao.destroy();
  res.json({ mensagem: 'Tradução removida com sucesso' });
};
