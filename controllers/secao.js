const { Secao, SecaoTraducao } = require('../models');

// Listar todas as seções
exports.listar = async () => {
  try {
    const secoes = await Secao.findAll({
      include: [
        { model: SecaoTraducao, as: 'traducoes' }
      ]
    });
    return secoes;
  } catch (error) {
    throw new Error('Erro ao buscar seções: ' + error.message);
  }
};

// Buscar seção por ID
exports.buscarPorId = async (id) => {
  try {
    const secao = await Secao.findByPk(id, {
      include: [
        { model: SecaoTraducao, as: 'traducoes' }
      ]
    });
    if (!secao) throw new Error('Seção não encontrada');
    return secao;
  } catch (error) {
    throw new Error('Erro ao buscar seção: ' + error.message);
  }
};

// Criar nova seção
exports.criar = async (dados) => {
  try {
    const novaSecao = await Secao.create(dados);
    return novaSecao;
  } catch (error) {
    throw new Error('Erro ao criar seção: ' + error.message);
  }
};

// Atualizar seção
exports.atualizar = async (id, dados) => {
  try {
    const secao = await Secao.findByPk(id);
    if (!secao) throw new Error('Seção não encontrada');
    await secao.update(dados);
    return secao;
  } catch (error) {
    throw new Error('Erro ao atualizar seção: ' + error.message);
  }
};

// Remover seção
exports.remover = async (id) => {
  try {
    const secao = await Secao.findByPk(id);
    if (!secao) throw new Error('Seção não encontrada');
    await secao.destroy();
    return { mensagem: 'Seção removida com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover seção: ' + error.message);
  }
};