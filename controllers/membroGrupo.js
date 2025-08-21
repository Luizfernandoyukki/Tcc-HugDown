const { MembroGrupo, Grupo, Usuario } = require('../models');

// Listar todos os membros de grupo
exports.listar = async () => {
  try {
    const membros = await MembroGrupo.findAll({
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    return membros;
  } catch (err) {
    throw new Error('Erro ao buscar membros de grupo: ' + err.message);
  }
};

// Buscar membro por ID
exports.buscarPorId = async (id) => {
  try {
    const membro = await MembroGrupo.findByPk(id, {
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!membro) throw new Error('Membro não encontrado');
    return membro;
  } catch (err) {
    throw new Error('Erro ao buscar membro: ' + err.message);
  }
};

// Criar novo membro de grupo
exports.criar = async (dados) => {
  try {
    const novo = await MembroGrupo.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar membro: ' + err.message);
  }
};

// Atualizar membro de grupo
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await MembroGrupo.update(dados, {
      where: { id_membro: id }
    });
    if (!updated) throw new Error('Membro não encontrado');
    const membroAtualizado = await MembroGrupo.findByPk(id);
    return membroAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar membro: ' + err.message);
  }
};

// Remover membro de grupo
exports.remover = async (id) => {
  try {
    const deleted = await MembroGrupo.destroy({
      where: { id_membro: id }
    });
    if (!deleted) throw new Error('Membro não encontrado');
    return { message: 'Membro removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover membro: ' + err.message);
  }
};