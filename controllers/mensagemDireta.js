const { MensagemDireta, Usuario } = require('../models');

// Listar todas as mensagens diretas
exports.listar = async () => {
  try {
    const mensagens = await MensagemDireta.findAll({
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    return mensagens;
  } catch (error) {
    throw new Error('Erro ao buscar mensagens diretas: ' + error.message);
  }
};

// Buscar mensagem direta por ID
exports.buscarPorId = async (id) => {
  try {
    const mensagem = await MensagemDireta.findByPk(id, {
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    if (!mensagem) throw new Error('Mensagem não encontrada');
    return mensagem;
  } catch (error) {
    throw new Error('Erro ao buscar mensagem direta: ' + error.message);
  }
};

// Criar nova mensagem direta
exports.criar = async (dados) => {
  try {
    const novaMensagem = await MensagemDireta.create(dados);
    return novaMensagem;
  } catch (error) {
    throw new Error('Erro ao criar mensagem direta: ' + error.message);
  }
};

// Atualizar mensagem direta
exports.atualizar = async (id, dados) => {
  try {
    const mensagem = await MensagemDireta.findByPk(id);
    if (!mensagem) throw new Error('Mensagem não encontrada');
    await mensagem.update(dados);
    return mensagem;
  } catch (error) {
    throw new Error('Erro ao atualizar mensagem direta: ' + error.message);
  }
};

// Remover mensagem direta
exports.remover = async (id) => {
  try {
    const mensagem = await MensagemDireta.findByPk(id);
    if (!mensagem) throw new Error('Mensagem não encontrada');
    await mensagem.destroy();
    return { mensagem: 'Mensagem removida com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover mensagem direta: ' + error.message);
  }
};