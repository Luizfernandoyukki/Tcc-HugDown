const { ReportGrupo, Grupo, Usuario } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { id_grupo, motivo, detalhes } = req.body;
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });

    const report = await ReportGrupo.create({
      id_grupo,
      id_usuario,
      motivo,
      detalhes
    });
    res.status(201).json({ sucesso: true, report });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report de grupo: ' + err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const reports = await ReportGrupo.findAll({
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports de grupo: ' + err.message });
  }
};
