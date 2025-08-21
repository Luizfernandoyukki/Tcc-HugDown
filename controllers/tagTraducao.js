const { TagTraducao, Tag, Idioma } = require('../models');

// Listar todas as traduções de tags
exports.listar = async () => {
  try {
    const traducoes = await TagTraducao.findAll({
      include: [
        { model: Tag, as: 'tag' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    return traducoes;
  } catch (error) {
    throw new Error('Erro ao buscar traduções de tags: ' + error.message);
  }
};

// Buscar tradução de tag por ID
exports.buscarPorId = async (id) => {
  try {
    const traducao = await TagTraducao.findByPk(id, {
      include: [
        { model: Tag, as: 'tag' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!traducao) throw new Error('Tradução de tag não encontrada');
    return traducao;
  } catch (error) {
    throw new Error('Erro ao buscar tradução de tag: ' + error.message);
  }
};

// Criar nova tradução de tag
exports.criar = async (dados) => {
  try {
    const novaTraducao = await TagTraducao.create(dados);
    return novaTraducao;
  } catch (error) {
    throw new Error('Erro ao criar tradução de tag: ' + error.message);
  }
};

// Atualizar tradução de tag
exports.atualizar = async (id, dados) => {
  try {
    const traducao = await TagTraducao.findByPk(id);
    if (!traducao) throw new Error('Tradução de tag não encontrada');
    await traducao.update(dados);
    return traducao;
  } catch (error) {
    throw new Error('Erro ao atualizar tradução de tag: ' + error.message);
  }
};

// Remover tradução de tag
exports.remover = async (id) => {
  try {
    const traducao = await TagTraducao.findByPk(id);
    if (!traducao) throw new Error('Tradução de tag não encontrada');
    await traducao.destroy();
    return { mensagem: 'Tradução de tag removida com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover tradução de tag: ' + error.message);
  }
};