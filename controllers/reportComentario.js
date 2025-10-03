const { ReportComentario, Comentario, Usuario } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { id_comentario, motivo } = req.body;
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });

    const comentario = await Comentario.findByPk(id_comentario, { include: [{ model: Usuario, as: 'autor' }] });
    if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado' });

    const snapshot = JSON.stringify({
      id_comentario: comentario.id_comentario,
      conteudo: comentario.conteudo,
      autor: comentario.autor ? comentario.autor.nome_usuario : null,
      data_criacao: comentario.data_criacao
    });

    const report = await ReportComentario.create({
      id_comentario,
      id_usuario,
      motivo,
      snapshot_comentario: snapshot
    });

    res.status(201).json({ sucesso: true, report });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report de comentário: ' + err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const reports = await ReportComentario.findAll({
      include: [
        { model: Comentario, as: 'comentario' },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports de comentários: ' + err.message });
  }
};

exports.listarSimples = async (req, res) => {
  try {
    const reports = await ReportComentario.findAll({
      attributes: ['id_report', 'id_comentario', 'motivo', 'snapshot_comentario'],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports de comentários: ' + err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const report = await ReportComentario.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report não encontrado' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar report: ' + err.message });
  }
};
