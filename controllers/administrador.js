const { Administrador, Usuario, ProfissionalSaude } = require('../models');

exports.listar = async (req, res) => {
  const admins = await Administrador.findAll({ include: [{ model: Usuario, as: 'usuario' }] });
  res.json(admins);
};

exports.buscarPorId = async (req, res) => {
  const admin = await Administrador.findByPk(req.params.id, { include: [{ model: Usuario, as: 'usuario' }] });
  if (!admin) return res.status(404).json({ error: 'Administrador não encontrado' });
  res.json(admin);
};

exports.criar = async (req, res) => {
  try {
    const novoAdmin = await Administrador.create(req.body);
    res.status(201).json(novoAdmin);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar administrador: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const admin = await Administrador.findByPk(req.params.id);
  if (!admin) return res.status(404).json({ error: 'Administrador não encontrado' });
  await admin.update(req.body);
  res.json(admin);
};

exports.remover = async (req, res) => {
  const admin = await Administrador.findByPk(req.params.id);
  if (!admin) return res.status(404).json({ error: 'Administrador não encontrado' });
  await admin.destroy();
  res.json({ mensagem: 'Administrador removido com sucesso' });
};

exports.aprovarProfissional = async (req, res) => {
  try {
    const id = req.params.id;
    const profissional = await ProfissionalSaude.findByPk(id);
    if (!profissional) return res.status(404).json({ error: 'Profissional não encontrado' });

    // Atualiza status do profissional
    await profissional.update({
      status_verificacao: 'aprovado',
      data_verificacao: new Date(),
      verificado_por: req.session.userId // id do admin
    });

    // Atualiza campo verificado do usuário
    const usuario = await Usuario.findByPk(profissional.id_usuario);
    if (usuario) {
      await usuario.update({ verificado: true });
    }

    res.json({ mensagem: 'Profissional aprovado e usuário verificado!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao aprovar profissional: ' + err.message });
  }
};
