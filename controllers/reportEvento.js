const { ReportEvento, Evento, Usuario } = require('../models');

exports.criar = async (req, res) => {
  try {
    // Pega id_evento do body ou da URL
    let id_evento = req.body.id_evento;
    if (!id_evento && req.params && req.params.id) {
      id_evento = req.params.id;
    }
    const { motivo, detalhes } = req.body;
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });

    await ReportEvento.create({
      id_evento,
      id_usuario,
      motivo,
      detalhes
    });
    // Redireciona para /eventos com mensagem de sucesso
    return res.redirect('/eventos?msg=Report enviado com sucesso!');
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report de evento: ' + err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const reports = await ReportEvento.findAll({
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports de evento: ' + err.message });
  }
};
