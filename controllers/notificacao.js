const { Notificacao, Usuario } = require('../models');

// Listar todas as notificações
exports.listar = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findAll({
      include: [{ model: Usuario, as: 'usuario' }]
    });
    res.json(notificacoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificações: ' + err.message });
  }
};

// Buscar notificação por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const notificacao = await Notificacao.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    if (!notificacao) return res.status(404).json({ error: 'Notificação não encontrada' });
    res.json(notificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificação: ' + err.message });
  }
};

// Criar nova notificação
exports.criar = async (req, res) => {
  try {
    const { id_usuario, tipo_notificacao, titulo, mensagem, url_relacionada, lida } = req.body;
    // Validação dos campos obrigatórios
    if (!id_usuario || !tipo_notificacao || !titulo) {
      return res.status(400).json({ error: 'Preencha id_usuario, tipo_notificacao e titulo.' });
    }
    const nova = await Notificacao.create({
      id_usuario,
      tipo_notificacao,
      titulo,
      mensagem,
      url_relacionada,
      lida: lida !== undefined ? lida : false
    });
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar notificação: ' + err.message });
  }
};

// Atualizar notificação
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Notificacao.update(req.body, {
      where: { id_notificacao: id }
    });
    if (!updated) return res.status(404).json({ error: 'Notificação não encontrada' });
    const notificacaoAtualizada = await Notificacao.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    res.json(notificacaoAtualizada);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar notificação: ' + err.message });
  }
};

// Remover notificação
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Notificacao.destroy({
      where: { id_notificacao: id }
    });
    if (!deleted) return res.status(404).json({ error: 'Notificação não encontrada' });
    res.json({ message: 'Notificação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover notificação: ' + err.message });
  }
};
