const { PostagemSecao, Postagem, Secao } = require('../models');

// Listar todas as seções de postagens
exports.listar = async (req, res) => {
  try {
    const secoes = await PostagemSecao.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Secao, as: 'secao' }
      ]
    });
    res.json(secoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seções de postagens: ' + error.message });
  }
};

// Buscar seção de postagem por ID
exports.buscarPorId = async (req, res) => {
  try {
    const secao = await PostagemSecao.findByPk(req.params.id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Secao, as: 'secao' }
      ]
    });
    if (!secao) return res.status(404).json({ error: 'Seção de postagem não encontrada' });
    res.json(secao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seção de postagem: ' + error.message });
  }
};

// Criar nova seção de postagem
exports.criar = async (req, res) => {
  try {
    const novaSecao = await PostagemSecao.create(req.body);
    res.status(201).json(novaSecao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar seção de postagem: ' + error.message });
  }
};

// Atualizar seção de postagem
exports.atualizar = async (req, res) => {
  try {
    const secao = await PostagemSecao.findByPk(req.params.id);
    if (!secao) return res.status(404).json({ error: 'Seção de postagem não encontrada' });
    await secao.update(req.body);
    res.json(secao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar seção de postagem: ' + error.message });
  }
};

// Remover seção de postagem
exports.remover = async (req, res) => {
  try {
    const secao = await PostagemSecao.findByPk(req.params.id);
    if (!secao) return res.status(404).json({ error: 'Seção de postagem não encontrada' });
    await secao.destroy();
    res.json({ message: 'Seção de postagem removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover seção de postagem: ' + error.message });
  }
};
