const { Notificacao, Usuario } = require('../models');

// Listar todas as notificações
exports.listar = async () => {
  try {
    const notificacoes = await Notificacao.findAll({
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    return notificacoes;
  } catch (err) {
    throw new Error('Erro ao buscar notificações: ' + err.message);
  }
};

// Buscar notificação por ID
exports.buscarPorId = async (id) => {
  try {
    const notificacao = await Notificacao.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!notificacao) throw new Error('Notificação não encontrada');
    return notificacao;
  } catch (err) {
    throw new Error('Erro ao buscar notificação: ' + err.message);
  }
};

// Criar nova notificação
exports.criar = async (dados) => {
  try {
    const nova = await Notificacao.create(dados);
    return nova;
  } catch (err) {
    throw new Error('Erro ao criar notificação: ' + err.message);
  }
};

// Atualizar notificação
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Notificacao.update(dados, {
      where: { id_notificacao: id }
    });
    if (!updated) throw new Error('Notificação não encontrada');
    const notificacaoAtualizada = await Notificacao.findByPk(id);
    return notificacaoAtualizada;
  } catch (err) {
    throw new Error('Erro ao atualizar notificação: ' + err.message);
  }
};

// Remover notificação
exports.remover = async (id) => {
  try {
    const deleted = await Notificacao.destroy({
      where: { id_notificacao: id }
    });
    if (!deleted) throw new Error('Notificação não encontrada');
    return { message: 'Notificação removida com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover notificação: ' + err.message);
  }
};