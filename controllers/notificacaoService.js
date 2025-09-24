const { Notificacao, Usuario, Amizade, ParticipanteEvento, Grupo, MembroGrupo, ProfissionalSaude, DocumentoVerificacao, Postagem, Comentario, Curtida, Compartilhamento, Evento } = require('../models');
const { Op } = require('sequelize');
const webpushService = require('./webpushService');

// Função genérica
async function criarNotificacao({ id_usuario, tipo_notificacao, titulo, mensagem, url_relacionada = null }) {
  await Notificacao.create({
    id_usuario,
    tipo_notificacao,
    titulo,
    mensagem,
    url_relacionada
  });
  // Envia push se houver subscription
  await webpushService.sendPushToUser(id_usuario, {
    title: titulo,
    body: mensagem,
    url: url_relacionada
  });
}

// Amizade
exports.notificarPedidoAmizade = async (id_destinatario) => {
  await criarNotificacao({
    id_usuario: id_destinatario,
    tipo_notificacao: 'friendship',
    titulo: 'Novo pedido de amizade',
    mensagem: 'Você recebeu um novo pedido de amizade.'
  });
};

exports.notificarAmizadeAceita = async (id_solicitante) => {
  await criarNotificacao({
    id_usuario: id_solicitante,
    tipo_notificacao: 'friendship',
    titulo: 'Pedido de amizade aceito',
    mensagem: 'Seu pedido de amizade foi aceito!'
  });
};

exports.notificarAmizadeRejeitada = async (id_solicitante) => {
  await criarNotificacao({
    id_usuario: id_solicitante,
    tipo_notificacao: 'friendship',
    titulo: 'Pedido de amizade rejeitado',
    mensagem: 'Seu pedido de amizade foi rejeitado.'
  });
};

// Comentário
exports.notificarNovoComentarioPost = async (id_autor_post, id_postagem) => {
  await criarNotificacao({
    id_usuario: id_autor_post,
    tipo_notificacao: 'comment',
    titulo: 'Novo comentário em sua postagem',
    mensagem: 'Alguém comentou em sua postagem.',
    url_relacionada: `/postagens/${id_postagem}`
  });
};

exports.notificarComentarioRespondido = async (id_autor_comentario, id_postagem) => {
  await criarNotificacao({
    id_usuario: id_autor_comentario,
    tipo_notificacao: 'comment',
    titulo: 'Seu comentário foi respondido',
    mensagem: 'Alguém respondeu seu comentário.',
    url_relacionada: `/postagens/${id_postagem}`
  });
};

exports.notificarComentarioCurtido = async (id_autor_comentario, id_postagem) => {
  await criarNotificacao({
    id_usuario: id_autor_comentario,
    tipo_notificacao: 'like',
    titulo: 'Seu comentário foi curtido',
    mensagem: 'Alguém curtiu seu comentário.',
    url_relacionada: `/postagens/${id_postagem}`
  });
};

// Postagem
exports.notificarPostagemCurtida = async (id_autor_post, id_postagem) => {
  await criarNotificacao({
    id_usuario: id_autor_post,
    tipo_notificacao: 'like',
    titulo: 'Sua postagem foi curtida',
    mensagem: 'Alguém curtiu sua postagem.',
    url_relacionada: `/postagens/${id_postagem}`
  });
};

exports.notificarPostagemCompartilhada = async (id_autor_post, id_postagem) => {
  await criarNotificacao({
    id_usuario: id_autor_post,
    tipo_notificacao: 'share',
    titulo: 'Sua postagem foi compartilhada',
    mensagem: 'Alguém compartilhou sua postagem.',
    url_relacionada: `/postagens/${id_postagem}`
  });
};

exports.notificarNovoPostAmigo = async (amigos, id_postagem) => {
  for (const amigo of amigos) {
    await criarNotificacao({
      id_usuario: amigo.id_usuario,
      tipo_notificacao: 'post',
      titulo: 'Novo post de um amigo',
      mensagem: 'Seu amigo postou algo novo.',
      url_relacionada: `/postagens/${id_postagem}`
    });
  }
};

// Mensagem direta
exports.notificarMensagemDireta = async (id_destinatario) => {
  await criarNotificacao({
    id_usuario: id_destinatario,
    tipo_notificacao: 'message',
    titulo: 'Nova mensagem direta',
    mensagem: 'Você recebeu uma nova mensagem.'
  });
};

// Documento verificação
exports.notificarDocumentoAprovado = async (id_usuario) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Documento aprovado',
    mensagem: 'Seu documento de verificação foi aprovado.'
  });
};

exports.notificarDocumentoRejeitado = async (id_usuario) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Documento rejeitado',
    mensagem: 'Seu documento de verificação foi rejeitado.'
  });
};

// Profissional de saúde
exports.notificarProfissionalAprovado = async (id_usuario) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Profissional de saúde aprovado',
    mensagem: 'Seu cadastro de profissional de saúde foi aprovado.'
  });
};

exports.notificarProfissionalRejeitado = async (id_usuario) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Profissional de saúde rejeitado',
    mensagem: 'Seu cadastro de profissional de saúde foi rejeitado.'
  });
};

// Evento
exports.notificarAdicionadoEvento = async (id_usuario, evento) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'event',
    titulo: 'Adicionado a um evento',
    mensagem: `Você foi adicionado ao evento "${evento.titulo_evento}".`,
    url_relacionada: `/eventos/${evento.id_evento}`
  });
};

exports.notificarEventoConfirmado = async (id_usuario, evento) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'event',
    titulo: 'Confirmação de participação em evento',
    mensagem: `Sua participação no evento "${evento.titulo_evento}" foi confirmada.`,
    url_relacionada: `/eventos/${evento.id_evento}`
  });
};

exports.notificarEventoCancelado = async (id_usuario, evento) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'event',
    titulo: 'Evento cancelado',
    mensagem: `O evento "${evento.titulo_evento}" foi cancelado.`,
    url_relacionada: `/eventos/${evento.id_evento}`
  });
};

exports.notificarEventoProximo = async (id_usuario, evento) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'event',
    titulo: 'Evento próximo',
    mensagem: `O evento "${evento.titulo_evento}" começa em breve!`,
    url_relacionada: `/eventos/${evento.id_evento}`
  });
};

exports.notificarEventoAlterado = async (id_usuario, evento) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'event',
    titulo: 'Evento alterado',
    mensagem: `O evento "${evento.titulo_evento}" foi alterado.`,
    url_relacionada: `/eventos/${evento.id_evento}`
  });
};

exports.notificarEventoCanceladoParticipante = async (participantes, evento) => {
  for (const participante of participantes) {
    await exports.notificarEventoCancelado(participante.id_usuario, evento);
  }
};

// Grupo
exports.notificarAdicionadoGrupo = async (id_usuario, grupo) => {
  await criarNotificacao({
    id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Adicionado a um grupo',
    mensagem: `Você foi adicionado ao grupo "${grupo.nome_grupo}".`,
    url_relacionada: `/grupos/${grupo.id_grupo}`
  });
};

exports.notificarMensagemGrupo = async (membros, grupo, mensagem) => {
  for (const membro of membros) {
    await criarNotificacao({
      id_usuario: membro.id_usuario,
      tipo_notificacao: 'message',
      titulo: `Nova mensagem no grupo "${grupo.nome_grupo}"`,
      mensagem,
      url_relacionada: `/grupos/${grupo.id_grupo}`
    });
  }
};

// Aviso global/comunidade
exports.notificarAvisoGlobal = async (usuarios, aviso) => {
  for (const usuario of usuarios) {
    await criarNotificacao({
      id_usuario: usuario.id_usuario,
      tipo_notificacao: 'system',
      titulo: aviso.titulo,
      mensagem: aviso.mensagem,
      url_relacionada: aviso.url_relacionada || null
    });
  }
};

// Job/middleware para eventos próximos (exemplo para rodar 1x por dia)
exports.notificarEventosProximosJob = async () => {
  const agora = new Date();
  const daquiUmDia = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
  const eventos = await Evento.findAll({
    where: {
      data_inicio: {
        [Op.between]: [agora, daquiUmDia]
      },
      ativo: true
    }
  });
  for (const evento of eventos) {
    const participantes = await ParticipanteEvento.findAll({ where: { id_evento: evento.id_evento } });
    for (const participante of participantes) {
      await exports.notificarEventoProximo(participante.id_usuario, evento);
    }
  }
};
