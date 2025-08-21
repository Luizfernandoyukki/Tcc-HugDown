const { Comentario, Usuario, Postagem } = require('../models');

// Listar todos os comentários
exports.listar = async () => {
  try {
    const comentarios = await Comentario.findAll({
      include: [
        { model: Usuario, as: 'autor' },
        { model: Postagem, as: 'postagem' }
      ]
    });
    return comentarios;
  } catch (err) {
    throw new Error('Erro ao buscar comentários: ' + err.message);
  }
};

// Buscar comentário por ID
exports.buscarPorId = async (id) => {
  try {
    const comentario = await Comentario.findByPk(id, {
      include: [
        { model: Usuario, as: 'autor' },
        { model: Postagem, as: 'postagem' }
      ]
    });
    if (!comentario) throw new Error('Comentário não encontrado');
    return comentario;
  } catch (err) {
    throw new Error('Erro ao buscar comentário: ' + err.message);
  }
};

// Criar novo comentário
exports.criar = async (dados) => {
  try {
    const novo = await Comentario.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar comentário: ' + err.message);
  }
};

// Atualizar comentário
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Comentario.update(dados, {
      where: { id_comentario: id }
    });
    if (!updated) throw new Error('Comentário não encontrado');
    const comentarioAtualizado = await Comentario.findByPk(id);
    return comentarioAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar comentário: ' + err.message);
  }
};

// Remover comentário
exports.remover = async (id) => {
  try {
    const deleted = await Comentario.destroy({
      where: { id_comentario: id }
    });
    if (!deleted) throw new Error('Comentário não encontrado');
    return { message: 'Comentário removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover comentário: ' + err.message);
  }
};