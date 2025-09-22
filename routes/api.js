const express = require('express');
const router = express.Router();

const User = require('../models/usuario');
const Event = require('../models/evento');
const Group = require('../models/grupo');

// Rota de estatísticas
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      events: await Event.countDocuments(),
      groups: await Group.countDocuments()
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
  }
});

// Rota de atividades recentes
router.get('/recent-activity', async (req, res) => {
  // Exemplo: buscar últimas postagens, eventos ou grupos criados
  res.json({ message: 'Implementar busca de atividades recentes.' });
});

// Rota de busca
router.get('/search', async (req, res) => {
  // Exemplo: implementar busca por usuários, grupos, eventos, etc.
  res.json({ message: 'Implementar busca.' });
});

module.exports = router;
