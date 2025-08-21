const { CategoriaTraducao, Categoria, Idioma } = require('../models');

// Listar todas as traduções de categorias
exports.listar = async () => {
  try {
    const traducoes = await CategoriaTraducao.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Idioma, as: 'idioma' }
      ]
    });
    return traducoes;
  } catch (err) {
    throw new Error('Erro ao buscar traduções de categoria: ' + err.message);
  }
};

// Buscar tradução por categoria e idioma
exports.buscarPorId = async (id_categoria, codigo_idioma) => {
  try {
    const traducao = await CategoriaTraducao.findOne({
      where: { id_categoria, codigo_idioma },
      include: [
        { model: Categoria, as: 'categoria' },
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
    const nova = await CategoriaTraducao.create(dados);
    return nova;
  } catch (err) {
    throw new Error('Erro ao criar tradução: ' + err.message);
  }
};

// Atualizar tradução
exports.atualizar = async (id_categoria, codigo_idioma, dados) => {
  try {
    const [updated] = await CategoriaTraducao.update(dados, {
      where: { id_categoria, codigo_idioma }
    });
    if (!updated) throw new Error('Tradução não encontrada');
    const traducaoAtualizada = await CategoriaTraducao.findOne({ where: { id_categoria, codigo_idioma } });
    return traducaoAtualizada;
  } catch (err) {
    throw new Error('Erro ao atualizar tradução: ' + err.message);
  }
};

// Remover tradução
exports.remover = async (id_categoria, codigo_idioma) => {
  try {
    const deleted = await CategoriaTraducao.destroy({
      where: { id_categoria, codigo_idioma }
    });
    if (!deleted) throw new Error('Tradução não encontrada');
    return { message: 'Tradução removida com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover tradução: ' + err.message);
  }
};