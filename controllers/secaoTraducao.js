const { SecaoTraducao, Secao, Idioma } = require('../models');

// Listar todas as traduções de seções
exports.listar = async (req, res) => {
  try {
    const traducoes = await SecaoTraducao.findAll({
      include: [
        { model: Secao, as: 'secao' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    res.json(traducoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar tradução de seção por ID
exports.buscarPorId = async (req, res) => {
  try {
    const traducao = await SecaoTraducao.findByPk(req.params.id, {
      include: [
        { model: Secao, as: 'secao' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!traducao) {
      return res.status(404).json({ error: 'Tradução de seção não encontrada' });
    }
    res.json(traducao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova tradução de seção
exports.criar = async (req, res) => {
  try {
    const novaTraducao = await SecaoTraducao.create(req.body);
    res.status(201).json(novaTraducao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar tradução de seção
exports.atualizar = async (req, res) => {
  try {
    const traducao = await SecaoTraducao.findByPk(req.params.id);
    if (!traducao) {
      return res.status(404).json({ error: 'Tradução de seção não encontrada' });
    }
    await traducao.update(req.body);
    res.json(traducao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover tradução de seção
exports.remover = async (req, res) => {
  try {
    const traducao = await SecaoTraducao.findByPk(req.params.id);
    if (!traducao) {
      return res.status(404).json({ error: 'Tradução de seção não encontrada' });
    }
    await traducao.destroy();
    res.json({ mensagem: 'Tradução de seção removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};