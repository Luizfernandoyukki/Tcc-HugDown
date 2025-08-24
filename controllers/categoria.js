const { Categoria, CategoriaTraducao } = require('../models');

exports.listar = async (req, resOrOptions) => {
  const categorias = await Categoria.findAll({ include: [{ model: CategoriaTraducao, as: 'traducoes' }] });
  if (resOrOptions && resOrOptions.raw) return categorias;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(categorias);
  return categorias;
};

exports.buscarPorId = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id, { include: [{ model: CategoriaTraducao, as: 'traducoes' }] });
  if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
  res.json(categoria);
};

exports.criar = async (req, res) => {
  try {
    const novaCategoria = await Categoria.create(req.body);
    res.status(201).json(novaCategoria);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar categoria: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
  await categoria.update(req.body);
  res.json(categoria);
};

exports.remover = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
  await categoria.destroy();
  res.json({ mensagem: 'Categoria removida com sucesso' });
};

exports.buscarPorNome = async (nome) => {
  return await Categoria.findOne({ where: { nome_categoria: nome } });
};
