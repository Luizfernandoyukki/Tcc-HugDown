const { MembroGrupo, Grupo, Usuario } = require('../models');

// Listar todos os membros de grupos
exports.listar = async (req, res) => {
  try {
    const membros = await MembroGrupo.findAll({
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(membros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar membro de grupo por ID
exports.buscarPorId = async (req, res) => {
  try {
    const membro = await MembroGrupo.findByPk(req.params.id, {
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!membro) {
      return res.status(404).json({ error: 'Membro de grupo não encontrado' });
    }
    res.json(membro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo membro de grupo
exports.criar = async (req, res) => {
  try {
    const novoMembro = await MembroGrupo.create(req.body);
    res.status(201).json(novoMembro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar membro de grupo
exports.atualizar = async (req, res) => {
  try {
    const membro = await MembroGrupo.findByPk(req.params.id);
    if (!membro) {
      return res.status(404).json({ error: 'Membro de grupo não encontrado' });
    }
    await membro.update(req.body);
    res.json(membro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover membro de grupo
exports.remover = async (req, res) => {
  try {
    const membro = await MembroGrupo.findByPk(req.params.id);
    if (!membro) {
      return res.status(404).json({ error: 'Membro de grupo não encontrado' });
    }
    await membro.destroy();
    res.json({ mensagem: 'Membro de grupo removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};