const { MembroGrupo, Grupo, Usuario } = require('../models');

// Listar todos os membros de grupo
exports.listar = async (req, res) => {
  try {
    const membros = await MembroGrupo.findAll({
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(membros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar membros de grupo: ' + err.message });
  }
};

// Buscar membro por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const membro = await MembroGrupo.findByPk(id, {
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!membro) return res.status(404).json({ error: 'Membro não encontrado' });
    res.json(membro);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar membro: ' + err.message });
  }
};

// Criar novo membro de grupo
exports.criar = async (req, res) => {
  try {
    const { id_grupo, id_usuario, papel_membro, ativo } = req.body;
    // Validação dos campos obrigatórios
    if (!id_grupo || !id_usuario) {
      return res.status(400).json({ error: 'Preencha id_grupo e id_usuario.' });
    }
    // Verifica se já existe membro
    const existente = await MembroGrupo.findOne({
      where: { id_grupo, id_usuario }
    });
    if (existente) {
      return res.status(409).json({ error: 'Usuário já é membro deste grupo.' });
    }
    const novo = await MembroGrupo.create({
      id_grupo,
      id_usuario,
      papel_membro: papel_membro || 'member',
      ativo: ativo !== undefined ? ativo : true
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar membro: ' + err.message });
  }
};

// Atualizar membro de grupo
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await MembroGrupo.update(req.body, {
      where: { id_membro: id }
    });
    if (!updated) return res.status(404).json({ error: 'Membro não encontrado' });
    const membroAtualizado = await MembroGrupo.findByPk(id, {
      include: [
        { model: Grupo, as: 'grupo' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(membroAtualizado);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar membro: ' + err.message });
  }
};

// Remover membro de grupo
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await MembroGrupo.destroy({
      where: { id_membro: id }
    });
    if (!deleted) return res.status(404).json({ error: 'Membro não encontrado' });
    res.json({ message: 'Membro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover membro: ' + err.message });
  }
};
