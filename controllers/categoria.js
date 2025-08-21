const { Categoria, CategoriaTraducao, Postagem } = require('../models');

// Listar todas as categorias
exports.listar = async () => {
  try {
    const categorias = await Categoria.findAll({
      include: [
        { model: CategoriaTraducao, as: 'traducoes' },
        { model: Postagem, as: 'postagens' }
      ]
    });
    return categorias;
  } catch (err) {
    throw new Error('Erro ao buscar categorias: ' + err.message);
  }
};

// Buscar categoria por ID
exports.buscarPorId = async (id) => {
  try {
    const categoria = await Categoria.findByPk(id, {
      include: [
        { model: CategoriaTraducao, as: 'traducoes' },
        { model: Postagem, as: 'postagens' }
      ]
    });
    if (!categoria) throw new Error('Categoria não encontrada');
    return categoria;
  } catch (err) {
    throw new Error('Erro ao buscar categoria: ' + err.message);
  }
};

// Criar nova categoria
exports.criar = async (dados) => {
  try {
    const nova = await Categoria.create(dados);
    return nova;
  } catch (err) {
    throw new Error('Erro ao criar categoria: ' + err.message);
  }
};

// Atualizar categoria
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Categoria.update(dados, {
      where: { id_categoria: id }
    });
    if (!updated) throw new Error('Categoria não encontrada');
    const categoriaAtualizada = await Categoria.findByPk(id);
    return categoriaAtualizada;
  } catch (err) {
    throw new Error('Erro ao atualizar categoria: ' + err.message);
  }
};

// Remover categoria
exports.remover = async (id) => {
  try {
    const deleted = await Categoria.destroy({
      where: { id_categoria: id }
    });
    if (!deleted) throw new Error('Categoria não encontrada');
    return { message: 'Categoria removida com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover categoria: ' + err.message);
  }
};