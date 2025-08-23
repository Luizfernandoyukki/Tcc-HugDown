const { Usuario, Idioma, Amizade } = require('../models');
const { Op } = require('sequelize');

// Listar todos os usuários
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Idioma, as: 'idioma' }]
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários: ' + err.message });
  }
};

// Buscar usuário por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Idioma, as: 'idioma' }]
    });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário: ' + err.message });
  }
};

// Criar novo usuário
exports.criar = async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário: ' + err.message });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário: ' + err.message });
  }
};

// Remover usuário
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    await usuario.destroy();
    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover usuário: ' + err.message });
  }
};

// Buscar sugestões de amigos
exports.sugestoesAmigos = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const amizades = await Amizade.findAll({
      where: {
        status_amizade: 'accepted',
        [Op.or]: [
          { id_solicitante: id_usuario },
          { id_destinatario: id_usuario }
        ]
      }
    });

    const amigosIds = amizades
      .flatMap(a => [a.id_solicitante, a.id_destinatario])
      .filter(id => id !== Number(id_usuario));

    const sugestoes = await Usuario.findAll({
      where: {
        id_usuario: { [Op.notIn]: [Number(id_usuario), ...amigosIds] },
        ativo: true
      },
      include: [{ model: Idioma, as: 'idioma' }],
      limit: 10
    });

    res.json(sugestoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sugestões de amigos: ' + err.message });
  }
};

