const { Administrador, Usuario } = require('../models');

// Listar todos os administradores
exports.listar = async () => {
  try {
    const admins = await Administrador.findAll({
      include: [{ model: Usuario, as: 'usuario' }]
    });
    return admins;
  } catch (err) {
    throw new Error('Erro ao buscar administradores: ' + err.message);
  }
};

// Buscar um administrador por ID
exports.buscarPorId = async (id) => {
  try {
    const admin = await Administrador.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    if (!admin) throw new Error('Administrador não encontrado');
    return admin;
  } catch (err) {
    throw new Error('Erro ao buscar administrador: ' + err.message);
  }
};

// Criar novo administrador
exports.criar = async (dados) => {
  try {
    const novo = await Administrador.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar administrador: ' + err.message);
  }
};

// Atualizar administrador
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Administrador.update(dados, {
      where: { id_admin: id }
    });
    if (!updated) throw new Error('Administrador não encontrado');
    const adminAtualizado = await Administrador.findByPk(id);
    return adminAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar administrador: ' + err.message);
  }
};

// Remover administrador
exports.remover = async (id) => {
  try {
    const deleted = await Administrador.destroy({
      where: { id_admin: id }
    });
    if (!deleted) throw new Error('Administrador não encontrado');
    return { message: 'Administrador removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover administrador: ' + err.message);
  }
};