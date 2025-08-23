const { Administrador, Usuario } = require('../models');

const administradorController = {
  listar: async (req, res) => {
    try {
      const admins = await Administrador.findAll({
        include: [{ model: Usuario, as: 'usuario' }]
      });
      res.json(admins);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar administradores: ' + err.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const admin = await Administrador.findByPk(id, {
        include: [{ model: Usuario, as: 'usuario' }]
      });
      if (!admin) return res.status(404).json({ error: 'Administrador não encontrado' });
      res.json(admin);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar administrador: ' + err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const novo = await Administrador.create(req.body);
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar administrador: ' + err.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await Administrador.update(req.body, {
        where: { id_admin: id }
      });
      if (!updated) return res.status(404).json({ error: 'Administrador não encontrado' });
      const adminAtualizado = await Administrador.findByPk(id);
      res.json(adminAtualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar administrador: ' + err.message });
    }
  },

  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Administrador.destroy({
        where: { id_admin: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Administrador não encontrado' });
      res.json({ message: 'Administrador removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover administrador: ' + err.message });
    }
  }
};

module.exports = administradorController;
