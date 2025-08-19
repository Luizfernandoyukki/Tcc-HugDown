const { Categoria, CategoriaTraducao, Postagem } = require('../models');

// Listar todas as categorias
exports.listar = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      include: [
        { model: CategoriaTraducao, as: 'traducoes' },
        { model: Postagem, as: 'postagens' }
      ]
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar categorias', details: err.message });
  }
};

// Buscar categoria por ID
exports.buscarPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [
        { model: CategoriaTraducao, as: 'traducoes' },
        { model: Postagem, as: 'postagens' }
      ]
    });
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar categoria', details: err.message });
  }
};

// Criar nova categoria
exports.criar = async (req, res) => {
  try {
    const nova = await Categoria.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar categoria', details: err.message });
  }
};

// Atualizar categoria
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Categoria.update(req.body, {
      where: { id_categoria: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Categoria não encontrada' });
    const categoriaAtualizada = await Categoria.findByPk(req.params.id);
    res.json(categoriaAtualizada);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar categoria', details: err.message });
  }
};

// Remover categoria
exports.remover = async (req, res) => {
  try {
    const deleted = await Categoria.destroy({
      where: { id_categoria: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ message: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover categoria', details: err.message });
    }
};