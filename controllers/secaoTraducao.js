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
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar traduções de seções: ' + err.message });
  }
};

// Buscar tradução por seção e idioma
exports.buscarPorId = async (req, res) => {
  try {
    const { id_secao, codigo_idioma } = req.params;
    const traducao = await SecaoTraducao.findOne({
      where: { id_secao, codigo_idioma },
      include: [
        { model: Secao, as: 'secao' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!traducao) return res.status(404).json({ error: 'Tradução não encontrada' });
    res.json(traducao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tradução: ' + err.message });
  }
};

// Criar nova tradução
exports.criar = async (req, res) => {
  try {
    const { id_secao, codigo_idioma, nome_secao, descricao_secao } = req.body;
    // Validação dos campos obrigatórios
    if (!id_secao || !codigo_idioma || !nome_secao) {
      return res.status(400).json({ error: 'Preencha id_secao, codigo_idioma e nome_secao.' });
    }
    const nova = await SecaoTraducao.create({
      id_secao,
      codigo_idioma,
      nome_secao,
      descricao_secao
    });
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tradução: ' + err.message });
  }
};

// Atualizar tradução
exports.atualizar = async (req, res) => {
  try {
    const { id_secao, codigo_idioma } = req.params;
    const [updated] = await SecaoTraducao.update(req.body, {
      where: { id_secao, codigo_idioma }
    });
    if (!updated) return res.status(404).json({ error: 'Tradução não encontrada' });

    const traducaoAtualizada = await SecaoTraducao.findOne({
      where: { id_secao, codigo_idioma },
      include: [
        { model: Secao, as: 'secao' },
        { model: Idioma, as: 'idioma' }
      ]
    });

    res.json(traducaoAtualizada);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar tradução: ' + err.message });
  }
};

// Remover tradução
exports.remover = async (req, res) => {
  try {
    const { id_secao, codigo_idioma } = req.params;
    const deleted = await SecaoTraducao.destroy({
      where: { id_secao, codigo_idioma }
    });
    if (!deleted) return res.status(404).json({ error: 'Tradução não encontrada' });
    res.json({ message: 'Tradução removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover tradução: ' + err.message });
  }
};
