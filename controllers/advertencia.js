const { Advertencia, Usuario, Notificacao } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { id_usuario, motivo, detalhes } = req.body;
    // Cria advertência
    await Advertencia.create({ id_usuario, motivo, detalhes });
    // Conta advertências ativas
    const total = await Advertencia.count({ where: { id_usuario, status: 'ativa' } });
    // Notifica usuário
    await Notificacao.create({
      id_usuario,
      tipo_notificacao: 'system',
      titulo: 'Advertência',
      mensagem: motivo + (detalhes ? `: ${detalhes}` : ''),
      lida: false
    });
    // Bloqueia usuário se atingir 3 advertências
    if (total >= 3) {
      await Usuario.update(
        { bloqueado: true, motivo_bloqueio: 'Limite de advertências atingido', data_bloqueio: new Date() },
        { where: { id_usuario } }
      );
      // Envia e-mail (implemente envio real)
      // sendEmailBloqueio(id_usuario, motivo_bloqueio);
    }
    res.json({ sucesso: true, totalAdvertencias: total });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar advertência: ' + err.message });
  }
};

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
