const { Curtida, Postagem, Usuario } = require('../models');

// Listar todas as curtidas
exports.listar = async () => {
  try {
    const curtidas = await Curtida.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    return curtidas;
  } catch (err) {
    throw new Error('Erro ao buscar curtidas: ' + err.message);
  }
};

// Buscar curtida por ID
exports.buscarPorId = async (id) => {
  try {
    const curtida = await Curtida.findByPk(id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!curtida) throw new Error('Curtida não encontrada');
    return curtida;
  } catch (err) {
    throw new Error('Erro ao buscar curtida: ' + err.message);
  }
};

// Criar nova curtida
exports.criar = async (dados) => {
  try {
    const nova = await Curtida.create(dados);
    return nova;
  } catch (err) {
    throw new Error('Erro ao criar curtida: ' + err.message);
  }
};

// Remover curtida
exports.remover = async (id) => {
  try {
    const deleted = await Curtida.destroy({
      where: { id_curtida: id }
    });
    if (!deleted) throw new Error('Curtida não encontrada');
    return { message: 'Curtida removida com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover curtida: ' + err.message);
  }
};