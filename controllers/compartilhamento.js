const { Compartilhamento, Postagem, Usuario } = require('../models');

// Listar todos os compartilhamentos
exports.listar = async () => {
  try {
    const compartilhamentos = await Compartilhamento.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    return compartilhamentos;
  } catch (err) {
    throw new Error('Erro ao buscar compartilhamentos: ' + err.message);
  }
};

// Buscar compartilhamento por ID
exports.buscarPorId = async (id) => {
  try {
    const compartilhamento = await Compartilhamento.findByPk(id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!compartilhamento) throw new Error('Compartilhamento não encontrado');
    return compartilhamento;
  } catch (err) {
    throw new Error('Erro ao buscar compartilhamento: ' + err.message);
  }
};

// Criar novo compartilhamento
exports.criar = async (dados) => {
  try {
    const novo = await Compartilhamento.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar compartilhamento: ' + err.message);
  }
};

// Atualizar compartilhamento
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Compartilhamento.update(dados, {
      where: { id_compartilhamento: id }
    });
    if (!updated) throw new Error('Compartilhamento não encontrado');
    const compartilhamentoAtualizado = await Compartilhamento.findByPk(id);
    return compartilhamentoAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar compartilhamento: ' + err.message);
  }
};

// Remover compartilhamento
exports.remover = async (id) => {
  try {
    const deleted = await Compartilhamento.destroy({
      where: { id_compartilhamento: id }
    });
    if (!deleted) throw new Error('Compartilhamento não encontrado');
    return { message: 'Compartilhamento removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover compartilhamento: ' + err.message);
  }
};