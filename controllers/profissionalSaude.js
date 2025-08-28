const { ProfissionalSaude, Usuario, Administrador, DocumentoVerificacao } = require('../models');

// Listar todos os profissionais de saúde
exports.listar = async (req, res) => {
  try {
    const profissionais = await ProfissionalSaude.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Administrador, as: 'administradorVerificador' },
        { model: DocumentoVerificacao, as: 'documentos' }
      ]
    });
    res.json(profissionais);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar profissionais de saúde: ' + err.message });
  }
};

// Buscar profissional por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const profissional = await ProfissionalSaude.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Administrador, as: 'administradorVerificador' },
        { model: DocumentoVerificacao, as: 'documentos' }
      ]
    });
    if (!profissional) return res.status(404).json({ error: 'Profissional não encontrado' });
    res.json(profissional);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar profissional: ' + err.message });
  }
};

// Criar novo profissional de saúde
exports.criar = async (req, res) => {
  try {
    const novo = await ProfissionalSaude.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar profissional: ' + err.message });
  }
};

// Atualizar profissional
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const profissional = await ProfissionalSaude.findByPk(id);
    if (!profissional) return res.status(404).json({ error: 'Profissional não encontrado' });
    await profissional.update(req.body);
    res.json(profissional);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar profissional: ' + err.message });
  }
};

// Remover profissional
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const profissional = await ProfissionalSaude.findByPk(id);
    if (!profissional) return res.status(404).json({ error: 'Profissional não encontrado' });
    await profissional.destroy();
    res.json({ mensagem: 'Profissional removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover profissional: ' + err.message });
  }
};