const { Amizade, Usuario } = require('../models');
const { Op } = require('sequelize');

exports.listar = async (req, res) => {
  const amizades = await Amizade.findAll({
    include: [
      { model: Usuario, as: 'solicitante' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  res.json(amizades);
};

exports.buscarPorId = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'solicitante' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  res.json(amizade);
};

exports.criar = async (req, res) => {
  try {
    const { id_solicitante, id_destinatario, status_amizade } = req.body;
    // Validação dos campos obrigatórios
    if (!id_solicitante || !id_destinatario) {
      return res.status(400).json({ error: 'Preencha id_solicitante e id_destinatario.' });
    }
    // Cria a amizade
    const nova = await Amizade.create({
      id_solicitante,
      id_destinatario,
      status_amizade: status_amizade || 'pending'
    });
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar amizade: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  await amizade.update(req.body);
  res.json(amizade);
};

exports.remover = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  await amizade.destroy();
  res.json({ mensagem: 'Amizade removida com sucesso' });
};

// Aceitar solicitação de amizade
exports.aceitar = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  await amizade.update({ status_amizade: 'accepted' });
  res.json(amizade);
};

// Rejeitar solicitação de amizade
exports.rejeitar = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  await amizade.update({ status_amizade: 'rejected' });
  res.json(amizade);
};

// Solicitar amizade (com aceitação automática se houver pedido inverso)
exports.solicitar = async (req, res) => {
  const id_solicitante = req.session.userId;
  const id_destinatario = req.body.id_destinatario;

  if (!id_solicitante || !id_destinatario || id_solicitante == id_destinatario) {
    return res.status(400).json({ error: 'Dados inválidos para solicitação de amizade.' });
  }

  // Verifica se já existe amizade aceita
  const amizadeExistente = await Amizade.findOne({
    where: {
      [Op.or]: [
        { id_solicitante, id_destinatario },
        { id_solicitante: id_destinatario, id_destinatario: id_solicitante }
      ],
      status_amizade: 'accepted'
    }
  });
  if (amizadeExistente) {
    return res.status(200).json({ mensagem: 'Vocês já são amigos.' });
  }

  // Verifica se existe pedido inverso pendente
  const pedidoInverso = await Amizade.findOne({
    where: {
      id_solicitante: id_destinatario,
      id_destinatario: id_solicitante,
      status_amizade: 'pending'
    }
  });

  if (pedidoInverso) {
    // Aceita ambos os pedidos
    pedidoInverso.status_amizade = 'accepted';
    await pedidoInverso.save();

    // Opcional: cria registro para o outro lado se não existir
    let pedidoDireto = await Amizade.findOne({
      where: {
        id_solicitante,
        id_destinatario,
      }
    });
    if (!pedidoDireto) {
      pedidoDireto = await Amizade.create({
        id_solicitante,
        id_destinatario,
        status_amizade: 'accepted'
      });
    } else {
      pedidoDireto.status_amizade = 'accepted';
      await pedidoDireto.save();
    }

    // Notifique ambos se quiser
    // ...notificação...

    return res.status(200).json({ mensagem: 'Amizade aceita automaticamente!' });
  }

  // Caso contrário, cria pedido pendente normalmente
  await Amizade.create({
    id_solicitante,
    id_destinatario,
    status_amizade: 'pending'
  });

  // ...notificação...

  return res.status(200).json({ mensagem: 'Pedido de amizade enviado.' });
};

// Novo método para buscar usuários com status de amizade
exports.listarUsuariosComStatus = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { 
        ativo: true,
        id_usuario: { [Op.ne]: req.session.userId }
      },
      attributes: ['id_usuario', 'nome_usuario', 'nome_real', 'sobrenome_real', 'foto_perfil', 'biografia', 'verificado']
    });

    // Buscar todas as amizades relacionadas ao usuário logado
    const amizades = await Amizade.findAll({
      where: {
        [Op.or]: [
          { id_solicitante: req.session.userId },
          { id_destinatario: req.session.userId }
        ]
      }
    });

    // Mapear os status de amizade para cada usuário
    const usuariosComStatus = usuarios.map(usuario => {
      const amizadeExistente = amizades.find(a => 
        (a.id_solicitante === usuario.id_usuario && a.id_destinatario === req.session.userId) ||
        (a.id_destinatario === usuario.id_usuario && a.id_solicitante === req.session.userId)
      );

      return {
        ...usuario.toJSON(),
        amizade: amizadeExistente ? {
          id_amizade: amizadeExistente.id_amizade,
          status_amizade: amizadeExistente.status_amizade,
          id_solicitante: amizadeExistente.id_solicitante
        } : null
      };
    });

    res.render('amizade/index', { 
      usuarios: usuariosComStatus, 
      userId: req.session.userId 
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).render('error', { 
      message: 'Erro ao carregar usuários', 
      error 
    });
  }
};
