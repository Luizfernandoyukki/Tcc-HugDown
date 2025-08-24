const { Secao, SecaoTraducao } = require('../models');

// Listar todas as seções
exports.listar = async (req, res) => {
  try {
    const secoes = await Secao.findAll({
      include: [
        { model: SecaoTraducao, as: 'traducoes' }
      ]
    });
    res.json(secoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seções: ' + error.message });
  }
};

// Buscar seção por ID
exports.buscarPorId = async (req, res) => {
  try {
    const secao = await Secao.findByPk(req.params.id, {
      include: [
        { model: SecaoTraducao, as: 'traducoes' }
      ]
    });
    if (!secao) return res.status(404).json({ error: 'Seção não encontrada' });
    res.json(secao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seção: ' + error.message });
  }
};

// Criar nova seção
exports.criar = async (req, res) => {
  try {
    const { nome_secao, descricao_secao, icone_secao, ordem_exibicao, ativo } = req.body;
    // Validação do campo obrigatório
    if (!nome_secao) {
      return res.status(400).json({ error: 'Preencha o nome da seção.' });
    }
    const novaSecao = await Secao.create({
      nome_secao,
      descricao_secao,
      icone_secao,
      ordem_exibicao,
      ativo: ativo !== undefined ? ativo : true
    });
    res.status(201).json(novaSecao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar seção: ' + error.message });
  }
};

// Atualizar seção
exports.atualizar = async (req, res) => {
  try {
    const secao = await Secao.findByPk(req.params.id);
    if (!secao) return res.status(404).json({ error: 'Seção não encontrada' });
    await secao.update(req.body);
    res.json(secao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar seção: ' + error.message });
  }
};

// Remover seção
exports.remover = async (req, res) => {
  try {
    const secao = await Secao.findByPk(req.params.id);
    if (!secao) return res.status(404).json({ error: 'Seção não encontrada' });
    await secao.destroy();
    res.json({ message: 'Seção removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover seção: ' + error.message });
  }
};
