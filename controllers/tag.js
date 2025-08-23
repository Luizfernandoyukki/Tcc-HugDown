const { Tag, TagTraducao } = require('../models');

// Listar todas as tags
exports.listar = async (req, resOrOptions) => {
  const tags = await Tag.findAll({ include: [{ model: TagTraducao, as: 'traducoes' }] });
  if (resOrOptions && resOrOptions.raw) return tags;
  return resOrOptions.json(tags);
};

// Buscar tag por ID
exports.buscarPorId = async (id) => {
  try {
    const tag = await Tag.findByPk(id, {
      include: [
        { model: TagTraducao, as: 'traducoes' }
      ]
    });
    if (!tag) throw new Error('Tag não encontrada');
    return tag;
  } catch (error) {
    throw new Error('Erro ao buscar tag: ' + error.message);
  }
};

// Criar nova tag
exports.criar = async (dados) => {
  try {
    const novaTag = await Tag.create(dados);
    return novaTag;
  } catch (error) {
    throw new Error('Erro ao criar tag: ' + error.message);
  }
};

// Atualizar tag
exports.atualizar = async (id, dados) => {
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) throw new Error('Tag não encontrada');
    await tag.update(dados);
    return tag;
  } catch (error) {
    throw new Error('Erro ao atualizar tag: ' + error.message);
  }
};

// Remover tag
exports.remover = async (id) => {
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) throw new Error('Tag não encontrada');
    await tag.destroy();
    return { mensagem: 'Tag removida com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover tag: ' + error.message);
  }
};

// Buscar tag por slug
exports.buscarPorSlug = async (slug) => {
  try {
    const tag = await Tag.findOne({
      where: { slug },
      include: [
        { model: TagTraducao, as: 'traducoes' }
      ]
    });
    return tag;
  } catch (error) {
    throw new Error('Erro ao buscar tag por slug: ' + error.message);
  }
};