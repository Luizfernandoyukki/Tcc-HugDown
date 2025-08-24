const { Compartilhamento, Postagem, Usuario } = require('../models');

const compartilhamentoController = {
  // Listar todos os compartilhamentos
  listar: async (req, res) => {
    try {
      const compartilhamentos = await Compartilhamento.findAll({
        include: [
          { model: Postagem, as: 'postagem' },
          { model: Usuario, as: 'usuario' }
        ]
      });
      res.json(compartilhamentos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar compartilhamentos: ' + err.message });
    }
  },

  // Buscar compartilhamento por ID
  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const compartilhamento = await Compartilhamento.findByPk(id, {
        include: [
          { model: Postagem, as: 'postagem' },
          { model: Usuario, as: 'usuario' }
        ]
      });
      if (!compartilhamento) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
      res.json(compartilhamento);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar compartilhamento: ' + err.message });
    }
  },

  // Criar novo compartilhamento
  criar: async (req, res) => {
    try {
      const { id_postagem, id_usuario, mensagem_compartilhamento } = req.body;
      // Validação dos campos obrigatórios
      if (!id_postagem || !id_usuario) {
        return res.status(400).json({ error: 'Preencha id_postagem e id_usuario.' });
      }
      const novo = await Compartilhamento.create({
        id_postagem,
        id_usuario,
        mensagem_compartilhamento
      });
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar compartilhamento: ' + err.message });
    }
  },

  // Atualizar compartilhamento
  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await Compartilhamento.update(req.body, {
        where: { id_compartilhamento: id }
      });
      if (!updated) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
      const compartilhamentoAtualizado = await Compartilhamento.findByPk(id);
      res.json(compartilhamentoAtualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar compartilhamento: ' + err.message });
    }
  },

  // Remover compartilhamento
  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Compartilhamento.destroy({
        where: { id_compartilhamento: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
      res.json({ message: 'Compartilhamento removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover compartilhamento: ' + err.message });
    }
  }
};

module.exports = compartilhamentoController;
