const { ReportGrupo, Grupo, Usuario } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { id_grupo, motivo } = req.body;
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });
    await ReportGrupo.create({
      id_grupo,
      id_usuario,
      motivo,
      data_report: new Date(),
      status: 'pending'
    });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report de grupo: ' + err.message });
  }
};
