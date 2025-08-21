const { Usuario, Idioma, Amizade } = require('../models');
const { Op } = require('sequelize');

// Listar todos os usuários
exports.listar = async (req, res, modoView) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        { model: Idioma, as: 'idioma' }
      ]
    });
    return usuarios; // Apenas retorna os dados!
  } catch (error) {
    throw error;
  }
};

// Buscar usuário por ID
exports.buscarPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [
        { model: Idioma, as: 'idioma' }
      ]
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo usuário
exports.criar = async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover usuário
exports.remover = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    await usuario.destroy();
    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exemplo de sugestão de amigos (ajuste conforme sua lógica)
exports.sugestoesAmigos = async (id_usuario) => {
  try {
    // Busca todos os usuários que NÃO são o próprio usuário e NÃO são amigos já aceitos
    // 1. Busca IDs dos amigos já aceitos
    const amizades = await Amizade.findAll({
      where: {
        status_amizade: 'accepted',
        [Op.or]: [
          { id_solicitante: id_usuario },
          { id_destinatario: id_usuario }
        ]
      }
    });

    // Extrai IDs dos amigos
    const amigosIds = amizades.reduce((ids, amizade) => {
      if (amizade.id_solicitante !== id_usuario) ids.push(amizade.id_solicitante);
      if (amizade.id_destinatario !== id_usuario) ids.push(amizade.id_destinatario);
      return ids;
    }, []);

    // Busca usuários que não são o próprio usuário e não estão na lista de amigos
    const sugestoes = await Usuario.findAll({
      where: {
        id_usuario: {
          [Op.notIn]: [id_usuario, ...amigosIds]
        },
        ativo: true
      },
      include: [
        { model: Idioma, as: 'idioma' }
      ],
      limit: 10 // Limite de sugestões
    });

    return sugestoes;
  } catch (error) {
    throw error;
  }
};