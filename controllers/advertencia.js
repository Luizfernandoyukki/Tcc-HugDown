const { Advertencia, Usuario, Notificacao } = require('../models');
const nodemailer = require('nodemailer');

exports.criar = async (req, res) => {
  try {
    const { id_usuario, motivo, detalhes } = req.body;
    // Cria advertência
    await Advertencia.create({ id_usuario, motivo, detalhes });
    // Conta advertências ativas
    const total = await Advertencia.count({ where: { id_usuario, status: 'ativa' } });
    // LOG backend: número de advertências após criar
    console.log(`[BACKEND][ADVERTENCIAS] Usuário ${id_usuario} agora tem ${total} advertências (tabela advertencias).`);
    // Notifica usuário
    await Notificacao.create({
      id_usuario,
      tipo_notificacao: 'system',
      titulo: 'Advertência',
      mensagem: motivo + (detalhes ? `: ${detalhes}` : ''),
      lida: false
    });

    // Envia e-mail de advertência
    const usuario = await Usuario.findByPk(id_usuario);
    if (usuario && usuario.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"HugDown" <no-reply@seudominio.com>',
        to: usuario.email,
        subject: 'Advertência recebida - HugDown',
        text: `Você recebeu uma advertência em sua conta HugDown.\nMotivo: ${motivo}${detalhes ? '\nDetalhes: ' + detalhes : ''}\n\nSe tiver dúvidas, entre em contato com SuporteHugDown@gmail.com.`
      });
    }

    // Bloqueia usuário se atingir 3 advertências
    let banidoAgora = false;
    if (total >= 3 && !usuario.bloqueado) {
      await Usuario.update(
        { bloqueado: true, motivo_bloqueio: 'Limite de advertências atingido', data_bloqueio: new Date() },
        { where: { id_usuario } }
      );
      await Notificacao.create({
        id_usuario,
        tipo_notificacao: 'system',
        titulo: 'Conta banida',
        mensagem: 'Sua conta foi banida por exceder o limite de advertências. Motivo: Limite de advertências atingido. Para recorrer, entre em contato pelo e-mail SuporteHugDown@gmail.com.',
        lida: false
      });
      if (usuario && usuario.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"HugDown" <no-reply@seudominio.com>',
          to: usuario.email,
          subject: 'Conta banida - HugDown',
          text: `Sua conta foi banida por exceder o limite de advertências.\nMotivo: Limite de advertências atingido.\nPara recorrer, entre em contato com SuporteHugDown@gmail.com.`
        });
      }
      banidoAgora = true;
    }
    // Retorne status para o frontend (sem alert JS)
    res.json({ sucesso: true, totalAdvertencias: total, banido: banidoAgora });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar advertência: ' + err.message });
  }
};

// Lista todas as advertências agrupadas por usuário
exports.listarTodasAgrupadas = async (req, res) => {
  try {
    const todas = await Advertencia.findAll({ where: { status: 'ativa' } });
    // Agrupa por id_usuario
    const agrupado = {};
    todas.forEach(adv => {
      const id = adv.id_usuario;
      if (!agrupado[id]) agrupado[id] = [];
      agrupado[id].push(adv);
    });
    // Monta objeto: id_usuario -> { total, advertencias }
    const resultado = {};
    Object.keys(agrupado).forEach(id => {
      resultado[id] = {
        total: agrupado[id].length,
        advertencias: agrupado[id]
      };
    });
    // LOG backend: agrupamento
    console.log('[BACKEND][ADVERTENCIAS][AGRUPADO] Total global:', todas.length, '| Por usuário:', Object.keys(resultado).map(id => `${id}: ${resultado[id].total}`).join(', '));
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar advertências agrupadas: ' + err.message });
  }
};

// Lista as advertências de um usuário específico
exports.listarPorUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id;
    const advertencias = await Advertencia.findAll({ where: { id_usuario, status: 'ativa' } });
    res.json({ total: advertencias.length, advertencias });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar advertências: ' + err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const adv = await Advertencia.findByPk(id);
    if (!adv) return res.status(404).json({ error: 'Advertência não encontrada' });
    await adv.update({ status: 'removida' });
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover advertência: ' + err.message });
  }
};
