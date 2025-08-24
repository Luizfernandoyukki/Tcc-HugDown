const { Idioma } = require('../models');

// Listar todos os idiomas
exports.listar = async (req, res) => {
  try {
    const idiomas = await Idioma.findAll();
    res.json(idiomas);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao listar idiomas' });
  }
};

// Buscar idioma por código
exports.buscarPorCodigo = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const idioma = await Idioma.findByPk(codigo);
    if (!idioma) return res.status(404).json({ error: 'Idioma não encontrado' });
    res.json(idioma);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao buscar idioma' });
  }
};

// Criar novo idioma
exports.criar = async (req, res) => {
  try {
    const { codigo_idioma, nome_idioma } = req.body;
    // Validação dos campos obrigatórios
    if (!codigo_idioma || !nome_idioma) {
      return res.status(400).json({ error: 'Preencha codigo_idioma e nome_idioma.' });
    }
    const novo = await Idioma.create({ codigo_idioma, nome_idioma });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao criar idioma' });
  }
};

// Atualizar idioma
exports.atualizar = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const idioma = await Idioma.findByPk(codigo);
    if (!idioma) return res.status(404).json({ error: 'Idioma não encontrado' });
    await idioma.update(req.body);
    res.json(idioma);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar idioma' });
  }
};

// Remover idioma
exports.remover = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const idioma = await Idioma.findByPk(codigo);
    if (!idioma) return res.status(404).json({ error: 'Idioma não encontrado' });
    await idioma.destroy();
    res.json({ mensagem: 'Idioma removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao remover idioma' });
  }
};
