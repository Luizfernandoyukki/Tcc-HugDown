const { CategoriaTraducao, Categoria, Idioma } = require('../models');

const categoriaTraducaoController = {
  // Listar todas as traduções de categorias
  listar: async (req, res) => {
    try {
      const traducoes = await CategoriaTraducao.findAll({
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Idioma, as: 'idioma' }
        ]
      });
      res.json(traducoes);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar traduções: ' + err.message });
    }
  },

  // Buscar tradução por categoria e idioma
  buscarPorId: async (req, res) => {
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
      res.status(500).json({ error: 'Erro ao buscar tradução: ' + err.message });
    }
  },

  // Criar nova tradução
  criar: async (req, res) => {
    try {
      const nova = await CategoriaTraducao.create(req.body);
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar tradução: ' + err.message });
    }
  },

  // Atualizar tradução
  atualizar: async (req, res) => {
    try {
      const { id_categoria, codigo_idioma } = req.params;
      const [updated] = await CategoriaTraducao.update(req.body, {
        where: { id_categoria, codigo_idioma }
      });
      if (!updated) return res.status(404).json({ error: 'Tradução não encontrada' });
      const traducaoAtualizada = await CategoriaTraducao.findOne({ where: { id_categoria, codigo_idioma } });
      res.json(traducaoAtualizada);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar tradução: ' + err.message });
    }
  },

  // Remover tradução
  remover: async (req, res) => {
    try {
      const { id_categoria, codigo_idioma } = req.params;
      const deleted = await CategoriaTraducao.destroy({
        where: { id_categoria, codigo_idioma }
      });
      if (!deleted) return res.status(404).json({ error: 'Tradução não encontrada' });
      res.json({ message: 'Tradução removida com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover tradução: ' + err.message });
    }
  }
};

module.exports = categoriaTraducaoController;
