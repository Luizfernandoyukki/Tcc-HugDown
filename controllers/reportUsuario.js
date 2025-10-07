const { ReportUsuario, Usuario } = require('../models');

// Criar report de usuário (denúncia de perfil)
exports.criar = async (req, res) => {
  try {
    const { id_usuario, motivo, detalhes } = req.body;
    const id_denunciante = req.session.userId;
    if (!id_denunciante) return res.status(401).json({ error: 'Precisa estar logado' });

    const report = await ReportUsuario.create({
      id_usuario,
      id_denunciante,
      motivo,
      detalhes
    });
    res.status(201).json({ sucesso: true, report });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report de usuário: ' + err.message });
  }
};

// Listar reports de usuários
exports.listar = async (req, res) => {
  try {
    const reports = await ReportUsuario.findAll({
      include: [
        { model: Usuario, as: 'usuarioDenunciado' },
        { model: Usuario, as: 'denunciante' }
      ],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports de usuário: ' + err.message });
  }
};
