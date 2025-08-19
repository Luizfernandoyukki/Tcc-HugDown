const { Administrador, Usuario } = require('../models');

// Listar todos os administradores
exports.listar = async (req, res) => {
  try {
    const admins = await Administrador.findAll({
      include: [{ model: Usuario, as: 'usuario' }]
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar administradores', details: err.message });
  }
};

// Buscar um administrador por ID
exports.buscarPorId = async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    if (!admin) return res.status(404).json({ error: 'Administrador não encontrado' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar administrador', details: err.message });
  }
};

// Criar novo administrador
exports.criar = async (req, res) => {
  try {
    const novo = await Administrador.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar administrador', details: err.message });
  }
};

// Atualizar administrador
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Administrador.update(req.body, {
      where: { id_admin: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Administrador não encontrado' });
    const adminAtualizado = await Administrador.findByPk(req.params.id);
    res.json(adminAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar administrador', details: err.message });
  }
};

// Remover administrador
exports.remover = async (req, res) => {
  try {
    const deleted = await Administrador.destroy({
      where: { id_admin: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Administrador não encontrado' });
    res.json({ message: 'Administrador removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover administrador', details: err.message });
  }
};