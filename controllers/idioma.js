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
    res.status(500).json({ error: 'Erro ao buscar idiomas', details: err.message });
  }
};

// Buscar idioma por código
exports.buscarPorCodigo = async (req, res) => {
  try {
    const idioma = await Idioma.findByPk(req.params.codigo, {
      include: [
        { model: CategoriaTraducao, as: 'categoriasTraducoes' },
        { model: SecaoTraducao, as: 'secoesTraducoes' },
        { model: TagTraducao, as: 'tagsTraducoes' }
      ]
    });
    if (!idioma) return res.status(404).json({ error: 'Idioma não encontrado' });
    res.json(idioma);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar idioma', details: err.message });
  }
};

// Criar novo idioma
exports.criar = async (req, res) => {
  try {
    const novo = await Idioma.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar idioma', details: err.message });
  }
};

// Atualizar idioma
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Idioma.update(req.body, {
      where: { codigo_idioma: req.params.codigo }
    });
    if (!updated) return res.status(404).json({ error: 'Idioma não encontrado' });
    const idiomaAtualizado = await Idioma.findByPk(req.params.codigo);
    res.json(idiomaAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar idioma', details: err.message });
  }
};

// Remover idioma
exports.remover = async (req, res) => {
  try {
    const deleted = await Idioma.destroy({
      where: { codigo_idioma: req.params.codigo }
    });
    if (!deleted) return res.status(404).json({ error: 'Idioma não encontrado' });
    res.json({ message: 'Idioma removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover idioma', details: err.message });
  }
};