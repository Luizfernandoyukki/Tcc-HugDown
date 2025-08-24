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

// Buscar tradução de tag por chave composta
exports.buscarPorId = async (req, res) => {
  try {
    const { id_tag, codigo_idioma } = req.params;
    const traducao = await TagTraducao.findOne({
      where: { id_tag, codigo_idioma },
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
    const { id_tag, codigo_idioma, nome_tag, descricao_tag } = req.body;
    // Validação dos campos obrigatórios
    if (!id_tag || !codigo_idioma || !nome_tag) {
      return res.status(400).json({ error: 'Preencha id_tag, codigo_idioma e nome_tag.' });
    }
    const novaTraducao = await TagTraducao.create({
      id_tag,
      codigo_idioma,
      nome_tag,
      descricao_tag
    });
    res.status(201).json(novaTraducao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tradução de tag: ' + error.message });
  }
};

// Atualizar tradução de tag
exports.atualizar = async (req, res) => {
  try {
    const { id_tag, codigo_idioma } = req.params;
    const [updated] = await TagTraducao.update(req.body, {
      where: { id_tag, codigo_idioma }
    });
    if (!updated) return res.status(404).json({ error: 'Tradução de tag não encontrada' });
    const traducaoAtualizada = await TagTraducao.findOne({
      where: { id_tag, codigo_idioma },
      include: [
        { model: Tag, as: 'tag' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    res.json(traducaoAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tradução de tag: ' + error.message });
  }
};

// Remover tradução de tag
exports.remover = async (req, res) => {
  try {
    const { id_tag, codigo_idioma } = req.params;
    const deleted = await TagTraducao.destroy({
      where: { id_tag, codigo_idioma }
    });
    if (!deleted) return res.status(404).json({ error: 'Tradução de tag não encontrada' });
    res.json({ mensagem: 'Tradução de tag removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover tradução de tag: ' + error.message });
  }
};
