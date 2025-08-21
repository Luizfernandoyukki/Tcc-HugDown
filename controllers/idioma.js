const { Idioma, CategoriaTraducao, SecaoTraducao, TagTraducao } = require('../models');

// Listar todos os idiomas
exports.listar = async () => {
  try {
    const idiomas = await Idioma.findAll({
      include: [
        { model: CategoriaTraducao, as: 'categoriasTraducoes' },
        { model: SecaoTraducao, as: 'secoesTraducoes' },
        { model: TagTraducao, as: 'tagsTraducoes' }
      ]
    });
    return idiomas;
  } catch (err) {
    throw new Error('Erro ao buscar idiomas: ' + err.message);
  }
};

// Buscar idioma por código
exports.buscarPorCodigo = async (codigo) => {
  try {
    const idioma = await Idioma.findByPk(codigo, {
      include: [
        { model: CategoriaTraducao, as: 'categoriasTraducoes' },
        { model: SecaoTraducao, as: 'secoesTraducoes' },
        { model: TagTraducao, as: 'tagsTraducoes' }
      ]
    });
    if (!idioma) throw new Error('Idioma não encontrado');
    return idioma;
  } catch (err) {
    throw new Error('Erro ao buscar idioma: ' + err.message);
  }
};

// Criar novo idioma
exports.criar = async (dados) => {
  try {
    const novo = await Idioma.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar idioma: ' + err.message);
  }
};

// Atualizar idioma
exports.atualizar = async (codigo, dados) => {
  try {
    const [updated] = await Idioma.update(dados, {
      where: { codigo_idioma: codigo }
    });
    if (!updated) throw new Error('Idioma não encontrado');
    const idiomaAtualizado = await Idioma.findByPk(codigo);
    return idiomaAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar idioma: ' + err.message);
  }
};

// Remover idioma
exports.remover = async (codigo) => {
  try {
    const deleted = await Idioma.destroy({
      where: { codigo_idioma: codigo }
    });
    if (!deleted) throw new Error('Idioma não encontrado');
    return { message: 'Idioma removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover idioma: ' + err.message);
  }
};