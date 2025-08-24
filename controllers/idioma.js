const { Idioma, CategoriaTraducao, SecaoTraducao, TagTraducao } = require('../models');

// Listar todos os idiomas
exports.listar = async (req, res) => {
  try {
    const idiomas = await Idioma.findAll({
      include: [
        { model: CategoriaTraducao, as: 'categoriasTraducoes' },
        { model: SecaoTraducao, as: 'secoesTraducoes' },
        { model: TagTraducao, as: 'tagsTraducoes' }
      ]
    });
    res.json(idiomas);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao listar idiomas' });
  }
};

// Buscar idioma por código
exports.buscarPorCodigo = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const idioma = await Idioma.findByPk(codigo, {
      include: [
        { model: CategoriaTraducao, as: 'categoriasTraducoes' },
        { model: SecaoTraducao, as: 'secoesTraducoes' },
        { model: TagTraducao, as: 'tagsTraducoes' }
      ]
    });
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
    const [updated] = await Idioma.update(req.body, {
      where: { codigo_idioma: codigo }
    });
    if (!updated) return res.status(404).json({ error: 'Idioma não encontrado' });
    const idiomaAtualizado = await Idioma.findByPk(codigo, {
      include: [
        { model: CategoriaTraducao, as: 'categoriasTraducoes' },
        { model: SecaoTraducao, as: 'secoesTraducoes' },
        { model: TagTraducao, as: 'tagsTraducoes' }
      ]
    });
    res.json(idiomaAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar idioma' });
  }
};

// Remover idioma
exports.remover = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const deleted = await Idioma.destroy({
      where: { codigo_idioma: codigo }
    });
    if (!deleted) return res.status(404).json({ error: 'Idioma não encontrado' });
    res.json({ message: 'Idioma removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao remover idioma' });
  }
};
