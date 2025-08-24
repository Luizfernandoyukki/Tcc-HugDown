const { Usuario, Idioma, Amizade, Postagem } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Listar todos os usuários
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Idioma, as: 'idioma' }, { model: Postagem, as: 'postagens' }]
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários: ' + err.message });
  }
};

// Buscar usuário por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Idioma, as: 'idioma' }, { model: Postagem, as: 'postagens' }]
    });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário: ' + err.message });
  }
};

// Criar novo usuário
exports.criar = async (req, res) => {
  try {
    // Extrai os dados do body ou do FormData
    const {
      email,
      nome_real,
      sobrenome_real,
      nome_usuario,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
      pais,
      genero,
      data_nascimento,
      senha,
      idioma_preferido,
      verificado,
      ativo,
      biografia
    } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !nome_real || !sobrenome_real || !nome_usuario || !telefone || !endereco || !cidade || !estado || !cep || !senha || !genero || !data_nascimento || !idioma_preferido || !pais) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    // Criptografa a senha antes de salvar
    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    // Foto de perfil (se veio via upload)
    let foto_perfil = null;
    if (req.file && req.file.filename) {
      foto_perfil = '/perfis/' + req.file.filename; // Caminho relativo para servir via express.static
    } else if (req.body.foto_perfil) {
      foto_perfil = req.body.foto_perfil;
    }

    // Cria o usuário
    const novoUsuario = await Usuario.create({
      email,
      nome_real,
      sobrenome_real,
      nome_usuario,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
      pais,
      genero,
      data_nascimento,
      senha_hash,
      idioma_preferido,
      verificado: false, // sempre false no cadastro
      ativo: true,       // sempre true no cadastro
      foto_perfil,
      biografia
    });

    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário: ' + err.message });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário: ' + err.message });
  }
};

// Remover usuário
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    await usuario.destroy();
    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover usuário: ' + err.message });
  }
};

// Buscar sugestões de amigos
exports.sugestoesAmigos = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const amizades = await Amizade.findAll({
      where: {
        status_amizade: 'accepted',
        [Op.or]: [
          { id_solicitante: id_usuario },
          { id_destinatario: id_usuario }
        ]
      }
    });

    const amigosIds = amizades
      .flatMap(a => [a.id_solicitante, a.id_destinatario])
      .filter(id => id !== Number(id_usuario));

    const sugestoes = await Usuario.findAll({
      where: {
        id_usuario: { [Op.notIn]: [Number(id_usuario), ...amigosIds] },
        ativo: true
      },
      include: [{ model: Idioma, as: 'idioma' }],
      limit: 10
    });

    res.json(sugestoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sugestões de amigos: ' + err.message });
  }
};

