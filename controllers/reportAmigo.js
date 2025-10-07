const { ReportAmigo, Usuario } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { id_destinatario, motivo, detalhes } = req.body;
    const id_remetente = req.session.userId;
    if (!id_remetente) return res.status(401).json({ error: 'Precisa estar logado' });

    const report = await ReportAmigo.create({
      id_remetente,
      id_destinatario,
      motivo,
      detalhes
    });
    res.status(201).json({ sucesso: true, report });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report de amizade: ' + err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const reports = await ReportAmigo.findAll({
      include: [
        { model: Usuario, as: 'remetente' },
        { model: Usuario, as: 'destinatario' }
      ],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports de amizade: ' + err.message });
  }
};
