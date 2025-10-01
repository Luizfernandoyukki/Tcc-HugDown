const { Report, Postagem, Usuario } = require('../models');

exports.criar = async (req, res) => {
  try {
    const { id_postagem, motivo } = req.body;
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });

    // Busca snapshot do post
    const post = await Postagem.findByPk(id_postagem, { include: [{ model: Usuario, as: 'autor' }] });
    if (!post) return res.status(404).json({ error: 'Postagem não encontrada' });

    const snapshot = JSON.stringify({
      id_postagem: post.id_postagem,
      titulo: post.titulo,
      resumo: post.resumo,
      conteudo: post.conteudo,
      url_midia: post.url_midia,
      autor: post.autor ? {
        id_usuario: post.autor.id_usuario,
        nome_usuario: post.autor.nome_usuario,
        foto_perfil: post.autor.foto_perfil
      } : null,
      data_criacao: post.data_criacao,
      data_atualizacao: post.data_atualizacao
    });

    const report = await Report.create({
      id_postagem,
      id_usuario,
      motivo,
      snapshot_post: snapshot
    });

    res.status(201).json({ sucesso: true, report });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar report: ' + err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports: ' + err.message });
  }
};

exports.listarSimples = async (req, res) => {
  try {
    // Busca todos os reports ordenados por data_report
    const reports = await Report.findAll({
      attributes: ['id_report', 'id_postagem', 'motivo', 'snapshot_post'],
      order: [['data_report', 'DESC']]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar reports: ' + err.message });
  }
};
