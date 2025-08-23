const { TagTraducao, Tag, Idioma } = require('../models');

// Listar todas as traduções de tags
exports.listar = async (req, res) => {
  try {
    const traducoes = await TagTraducao.findAll({
      include: [
        { model: Tag, as: 'tag' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    res.json(traducoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar traduções de tags: ' + error.message });
  }
};

// Buscar tradução de tag por ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const traducao = await TagTraducao.findByPk(id, {
      include: [
        { model: Tag, as: 'tag' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!traducao) return res.status(404).json({ error: 'Tradução de tag não encontrada' });
    res.json(traducao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tradução de tag: ' + error.message });
  }
};

// Criar nova tradução de tag
exports.criar = async (req, res) => {
  try {
    const novaTraducao = await TagTraducao.create(req.body);
    res.status(201).json(novaTraducao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tradução de tag: ' + error.message });
  }
};

// Atualizar tradução de tag
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const traducao = await TagTraducao.findByPk(id);
    if (!traducao) return res.status(404).json({ error: 'Tradução de tag não encontrada' });
    await traducao.update(req.body);
    res.json(traducao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tradução de tag: ' + error.message });
  }
};

// Remover tradução de tag
exports.remover = async (req, res) => {
  try {
    const { id } = req.params;
    const traducao = await TagTraducao.findByPk(id);
    if (!traducao) return res.status(404).json({ error: 'Tradução de tag não encontrada' });
    await traducao.destroy();
    res.json({ mensagem: 'Tradução de tag removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover tradução de tag: ' + error.message });
  }
};
