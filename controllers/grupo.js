const { Grupo, Usuario, MembroGrupo } = require('../models');

// Listar todos os grupos
exports.listar = async () => {
  try {
    const grupos = await Grupo.findAll({
      include: [
        { model: Usuario, as: 'administrador' },
        { model: MembroGrupo, as: 'membros' }
      ]
    });
    return grupos;
  } catch (err) {
    throw new Error('Erro ao buscar grupos: ' + err.message);
  }
};

// Buscar grupo por ID
exports.buscarPorId = async (id) => {
  try {
    const grupo = await Grupo.findByPk(id, {
      include: [
        { model: Usuario, as: 'administrador' },
        { model: MembroGrupo, as: 'membros' }
      ]
    });
    if (!grupo) throw new Error('Grupo não encontrado');
    return grupo;
  } catch (err) {
    throw new Error('Erro ao buscar grupo: ' + err.message);
  }
};

// Criar novo grupo
exports.criar = async (dados) => {
  try {
    const novo = await Grupo.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar grupo: ' + err.message);
  }
};

// Atualizar grupo
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Grupo.update(dados, {
      where: { id_grupo: id }
    });
    if (!updated) throw new Error('Grupo não encontrado');
    const grupoAtualizado = await Grupo.findByPk(id);
    return grupoAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar grupo: ' + err.message);
  }
};

// Remover grupo
exports.remover = async (id) => {
  try {
    const deleted = await Grupo.destroy({
      where: { id_grupo: id }
    });
    if (!deleted) throw new Error('Grupo não encontrado');
    return { message: 'Grupo removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover grupo: ' + err.message);
  }
};