const { Categoria, CategoriaTraducao, Postagem } = require('../models');

const categoriaController = {
  listar: async (req, resOrOptions) => {
    try {
      const categorias = await Categoria.findAll({
        include: [
          { model: CategoriaTraducao, as: 'traducoes' },
          { model: Postagem, as: 'postagens' }
        ]
      });
      categorias.sort((a, b) => a.nome_categoria.localeCompare(b.nome_categoria));
      // Se for chamado para view, retorna array
      if (resOrOptions && resOrOptions.raw) return categorias;
      // Se for API, responde JSON
      return resOrOptions.json(categorias);
    } catch (err) {
      resOrOptions.status(500).json({ error: 'Erro ao buscar categorias: ' + err.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const categoria = await Categoria.findByPk(id, {
        include: [
          { model: CategoriaTraducao, as: 'traducoes' },
          { model: Postagem, as: 'postagens' }
        ]
      });
      if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
      res.json(categoria);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar categoria: ' + err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome_categoria, descricao, cor_categoria, icone, ativo } = req.body;
      // Validação do campo obrigatório
      if (!nome_categoria) {
        return res.status(400).json({ error: 'Preencha o nome da categoria.' });
      }
      // Cria a categoria
      const nova = await Categoria.create({
        nome_categoria,
        descricao,
        cor_categoria,
        icone,
        ativo: ativo !== undefined ? ativo : true
      });
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar categoria: ' + err.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await Categoria.update(req.body, {
        where: { id_categoria: id }
      });
      if (!updated) return res.status(404).json({ error: 'Categoria não encontrada' });
      const categoriaAtualizada = await Categoria.findByPk(id);
      res.json(categoriaAtualizada);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar categoria: ' + err.message });
    }
  },

  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Categoria.destroy({
        where: { id_categoria: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Categoria não encontrada' });
      res.json({ message: 'Categoria removida com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover categoria: ' + err.message });
    }
  },

  buscarPorNome: async (nome, options) => {
    const categoria = await Categoria.findOne({
      where: { nome_categoria: nome },
      include: [
        { model: CategoriaTraducao, as: 'traducoes' },
        { model: Postagem, as: 'postagens' }
      ]
    });
    // Se chamado para view, retorna objeto
    if (options && options.raw) return categoria;
    // Se chamado por rota API, responde JSON
    if (!categoria) return options && options.status ? options.status(404).json({ error: 'Categoria não encontrada' }) : null;
    return options && options.json ? options.json(categoria) : categoria;
  }
};

module.exports = categoriaController;
