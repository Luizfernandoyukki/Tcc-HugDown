const { CategoriaTraducao, Categoria, Idioma } = require('../models');

// Listar todas as traduções de categorias
exports.listar = async (req, res) => {
  try {
    const traducoes = await CategoriaTraducao.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    res.json(traducoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar traduções de categoria', details: err.message });
  }
};

// Buscar tradução por categoria e idioma
exports.buscarPorId = async (req, res) => {
  try {
    const { id_categoria, codigo_idioma } = req.params;
    const traducao = await CategoriaTraducao.findOne({
      where: { id_categoria, codigo_idioma },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
    res.json(traducao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tradução', details: err.message });
  }
};

// Criar nova tradução
exports.criar = async (req, res) => {
  try {
    const nova = await CategoriaTraducao.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar tradução', details: err.message });
  }
};

// Atualizar tradução
exports.atualizar = async (req, res) => {
  try {
    const { id_categoria, codigo_idioma } = req.params;
    const [updated] = await CategoriaTraducao.update(req.body, {
      where: { id_categoria, codigo_idioma }
    });
    if (!updated) return res.status(404).json({ error: 'Tradução não encontrada' });
    const traducaoAtualizada = await CategoriaTraducao.findOne({ where: { id_categoria, codigo_idioma } });
    res.json(traducaoAtualizada);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar tradução', details: err.message });
  }
};

// Remover tradução
exports.remover = async (req, res) => {
  try {
    const { id_categoria, codigo_idioma } = req.params;
    const deleted = await CategoriaTraducao.destroy({
      where: { id_categoria, codigo_idioma }
    });
    if (!deleted) return res.status(404).json({ error: 'Tradução não encontrada' });
    res.json({ message: 'Tradução removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover tradução', details: err.message });
  }
};