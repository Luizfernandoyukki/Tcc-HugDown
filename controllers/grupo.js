const { Grupo, Usuario, MembroGrupo } = require('../models');

// Listar todos os grupos
exports.listar = async (req, resOrOptions) => {
  const grupos = await Grupo.findAll({
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  if (resOrOptions && resOrOptions.raw) return grupos;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(grupos);
  return grupos;
};

// Buscar grupo por ID
exports.buscarPorId = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
  res.json(grupo);
};

// Criar novo grupo
exports.criar = async (req, res) => {
  try {
    // Se houver foto do grupo, espera caminho relativo vindo do front
    let foto_grupo = null;
    if (req.body.foto_grupo) {
      foto_grupo = '/images/grupos/' + req.body.foto_grupo;
    }
    const novoGrupo = await Grupo.create({
      nome_grupo: req.body.nome_grupo,
      descricao_grupo: req.body.descricao_grupo || null,
      foto_grupo,
      tipo_privacidade: req.body.tipo_privacidade,
      id_administrador: req.body.id_administrador,
      ativo: true
    });
    res.status(201).json(novoGrupo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar grupo: ' + err.message });
  }
};

// Atualizar grupo
exports.atualizar = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id);
  if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
  await grupo.update(req.body);
  res.json(grupo);
};

// Remover grupo
exports.remover = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id);
  if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
  await grupo.destroy();
  res.json({ mensagem: 'Grupo removido com sucesso' });
};

// Buscar grupo com membros e suas informações
exports.buscarGrupoComMembros = async (id_grupo) => {
  try {
    const grupo = await Grupo.findByPk(id_grupo, {
      include: [
        { 
          model: Usuario, 
          as: 'administrador',
          attributes: ['id_usuario', 'nome_usuario', 'foto_perfil'] 
        },
        { 
          model: MembroGrupo, 
          as: 'membros',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nome_usuario', 'foto_perfil']
          }]
        }
      ]
    });

    // Formatar dados dos membros
    if (grupo && grupo.membros) {
      grupo.membrosFormatados = grupo.membros.map(membro => ({
        id: membro.usuario.id_usuario,
        nome: membro.usuario.nome_usuario,
        foto: membro.usuario.foto_perfil || '/images/default-avatar.png',
        papel: membro.papel_membro,
        isAdmin: membro.papel_membro === 'admin',
        dataEntrada: membro.data_entrada
      }));
    }

    return grupo;
  } catch (err) {
    console.error('[GRUPO] Erro ao buscar grupo com membros:', err);
    throw err;
  }
};
