const { SecaoTraducao, Secao, Idioma } = require('../models');

// Listar todas as traduções de seções
exports.listar = async () => {
  try {
    const traducoes = await SecaoTraducao.findAll({
      include: [
        { model: Secao, as: 'secao' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    return traducoes;
  } catch (err) {
    throw new Error('Erro ao buscar traduções de seções: ' + err.message);
  }
};

// Buscar tradução por seção e idioma
exports.buscarPorId = async (id_secao, codigo_idioma) => {
  try {
    const traducao = await SecaoTraducao.findOne({
      where: { id_secao, codigo_idioma },
      include: [
        { model: Secao, as: 'secao' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!traducao) throw new Error('Tradução não encontrada');
    return traducao;
  } catch (err) {
    throw new Error('Erro ao buscar tradução: ' + err.message);
  }
};

// Criar nova tradução
exports.criar = async (dados) => {
  try {
    const nova = await SecaoTraducao.create(dados);
    return nova;
  } catch (err) {
    throw new Error('Erro ao criar tradução: ' + err.message);
  }
};

// Atualizar tradução
exports.atualizar = async (id_secao, codigo_idioma, dados) => {
  try {
    const [updated] = await SecaoTraducao.update(dados, {
      where: { id_secao, codigo_idioma }
    });
    if (!updated) throw new Error('Tradução não encontrada');
    const traducaoAtualizada = await SecaoTraducao.findOne({ where: { id_secao, codigo_idioma } });
    return traducaoAtualizada;
  } catch (err) {
    throw new Error('Erro ao atualizar tradução: ' + err.message);
  }
};

// Remover tradução
exports.remover = async (id_secao, codigo_idioma) => {
  try {
    const deleted = await SecaoTraducao.destroy({
      where: { id_secao, codigo_idioma }
    });
    if (!deleted) throw new Error('Tradução não encontrada');
    return { message: 'Tradução removida com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover tradução: ' + err.message);
  }
};