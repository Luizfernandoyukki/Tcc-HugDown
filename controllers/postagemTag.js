const { PostagemTag, Postagem, Tag } = require('../models');

// Listar todas as tags de postagens
exports.listar = async () => {
  try {
    const postagemTags = await PostagemTag.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Tag, as: 'tag' }
      ]
    });
    return postagemTags;
  } catch (error) {
    throw new Error('Erro ao buscar tags de postagens: ' + error.message);
  }
};

// Buscar tag de postagem por ID
exports.buscarPorId = async (id) => {
  try {
    const postagemTag = await PostagemTag.findByPk(id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Tag, as: 'tag' }
      ]
    });
    if (!postagemTag) throw new Error('Tag de postagem não encontrada');
    return postagemTag;
  } catch (error) {
    throw new Error('Erro ao buscar tag de postagem: ' + error.message);
  }
};

// Criar nova tag de postagem
exports.criar = async (dados) => {
  try {
    const novaPostagemTag = await PostagemTag.create(dados);
    return novaPostagemTag;
  } catch (error) {
    throw new Error('Erro ao criar tag de postagem: ' + error.message);
  }
};

// Atualizar tag de postagem
exports.atualizar = async (id, dados) => {
  try {
    const postagemTag = await PostagemTag.findByPk(id);
    if (!postagemTag) throw new Error('Tag de postagem não encontrada');
    await postagemTag.update(dados);
    return postagemTag;
  } catch (error) {
    throw new Error('Erro ao atualizar tag de postagem: ' + error.message);
  }
};

// Remover tag de postagem
exports.remover = async (id) => {
  try {
    const postagemTag = await PostagemTag.findByPk(id);
    if (!postagemTag) throw new Error('Tag de postagem não encontrada');
    await postagemTag.destroy();
    return { mensagem: 'Tag de postagem removida com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover tag de postagem: ' + error.message);
  }
};