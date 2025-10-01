const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');
const { Report, Postagem, Usuario, Notificacao } = require('../models');

// Listar todos os reports para o painel ADM (dados simples)
router.get('/admin/super/postagens/reportadas', reportsController.listarSimples);

// Visualizar detalhes de um report específico
router.get('/admin/super/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ error: 'Report não encontrado' });
    res.json({ snapshot_post: report.snapshot_post, motivo: report.motivo });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar report: ' + err.message });
  }
});

// Excluir postagem referida (cascata)
router.post('/admin/super/postagens/:id/excluir', async (req, res) => {
  const { id } = req.params;
  try {
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
    await postagem.destroy(); // Remove postagem e tudo que tem ON DELETE CASCADE
    res.redirect('/admin/super'); // Redireciona para painel após exclusão
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir postagem: ' + err.message });
  }
});

// Advertir usuário (enviar notificação)
router.post('/admin/super/usuarios/:id/advertir', async (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Cria notificação de advertência
    await Notificacao.create({
      id_usuario: usuario.id_usuario,
      tipo_notificacao: 'system',
      titulo: 'Advertência',
      mensagem: mensagem,
      url_relacionada: '',
      lida: false
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao advertir usuário: ' + err.message });
  }
});

module.exports = router;
