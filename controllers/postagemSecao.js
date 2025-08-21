const { PostagemSecao, Postagem, Secao } = require('../models');

// Listar todas as seções de postagens
exports.listar = async () => {
  try {
    const secoes = await PostagemSecao.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Secao, as: 'secao' }
      ]
    });
    return secoes;
  } catch (error) {
    throw new Error('Erro ao buscar seções de postagens: ' + error.message);
  }
};

// Buscar seção de postagem por ID
exports.buscarPorId = async (id) => {
  try {
    const secao = await PostagemSecao.findByPk(id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Secao, as: 'secao' }
      ]
    });
    if (!secao) throw new Error('Seção de postagem não encontrada');
    return secao;
  } catch (error) {
    throw new Error('Erro ao buscar seção de postagem: ' + error.message);
  }
};

// Criar nova seção de postagem
exports.criar = async (dados) => {
  try {
    const novaSecao = await PostagemSecao.create(dados);
    return novaSecao;
  } catch (error) {
    throw new Error('Erro ao criar seção de postagem: ' + error.message);
  }
};

// Atualizar seção de postagem
exports.atualizar = async (id, dados) => {
  try {
    const secao = await PostagemSecao.findByPk(id);
    if (!secao) throw new Error('Seção de postagem não encontrada');
    await secao.update(dados);
    return secao;
  } catch (error) {
    throw new Error('Erro ao atualizar seção de postagem: ' + error.message);
  }
};

// Remover seção de postagem
exports.remover = async (id) => {
  try {
    const secao = await PostagemSecao.findByPk(id);
    if (!secao) throw new Error('Seção de postagem não encontrada');
    await secao.destroy();
    return { mensagem: 'Seção de postagem removida com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover seção de postagem: ' + error.message);
  }
};