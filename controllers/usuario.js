const { Usuario, Idioma, Amizade, Postagem, ProfissionalSaude } = require('../models');
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
    if (!usuario) {
      if (res) return res.status(404).json({ error: 'Usuário não encontrado' });
      return null;
    }
    if (res) return res.json(usuario);
    return usuario; // <-- retorna o objeto para uso interno
  } catch (err) {
    if (res) return res.status(500).json({ error: 'Erro ao buscar usuário: ' + err.message });
    throw err;
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
      biografia,
      fuso_horario // <-- Adicione aqui
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
      verificado: false,
      ativo: true,
      foto_perfil,
      biografia,
      fuso_horario // <-- Salva aqui
    });

    // Se for profissional de saúde, cria registro na tabela correta
    if (req.body.profissional_saude) {
      await ProfissionalSaude.create({
        id_usuario: novoUsuario.id_usuario,
        tipo_registro: req.body.tipo_registro,
        numero_registro: req.body.numero_registro,
        uf_registro: req.body.uf_registro,
        especialidade: req.body.especialidade,
        instituicao: req.body.instituicao,
        data_registro: req.body.data_registro,
        documento_comprobatorio: req.files?.documento_comprobatorio?.[0]?.filename // ou caminho salvo
      });
    }

    res.redirect('/');
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

// Login de usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.render('login', { error: 'Usuário não encontrado!', isLoggedIn: false });
    }

    // Verifica se a senha está correta
    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) {
      return res.render('login', { error: 'Senha incorreta!', isLoggedIn: false });
    }

    // Autenticação bem-sucedida
    req.session.userId = usuario.id_usuario;
    req.session.isLoggedIn = true; // variável global de login

    // Verifica se é administrador
    const { Administrador } = require('../models');
    const admin = await Administrador.findOne({ where: { id_usuario: usuario.id_usuario } });
    if (admin) {
      // Redireciona para painel admin se for administrador
      return res.redirect('/administradores');
    }

    return res.redirect('/'); // Redireciona para a home após login
  } catch (err) {
    return res.render('login', { error: 'Erro ao realizar login: ' + err.message, isLoggedIn: false });
  }
};

// Buscar perfil completo para visualização (sem edição)
exports.buscarPerfilCompleto = async (id) => {
  console.log('[CONTROLLER] buscarPerfilCompleto | id:', id);
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: [
        'id_usuario', 'nome_usuario', 'nome_real', 'sobrenome_real', 'email', 'foto_perfil', 'biografia', 'cidade', 'estado', 'pais'
      ],
      include: [
        {
          model: Postagem,
          as: 'postagens',
          attributes: ['id_postagem', 'titulo', 'resumo', 'url_midia', 'data_criacao']
        },
        {
          model: Amizade,
          as: 'amizades',
          where: { status_amizade: 'accepted' },
          required: false,
          include: [{
            model: Usuario,
            as: 'amigo',
            attributes: ['id_usuario', 'nome_usuario', 'foto_perfil']
          }]
        }
      ]
    });
    console.log('[CONTROLLER] Resultado do banco:', usuario);
    if (!usuario) return null;
    let amigos = [];
    if (usuario.amizades && usuario.amizades.length) {
      amigos = usuario.amizades.map(a => a.amigo);
    }
    return {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
      nome_real: usuario.nome_real,
      sobrenome_real: usuario.sobrenome_real,
      email: usuario.email,
      foto_perfil: usuario.foto_perfil,
      biografia: usuario.biografia,
      cidade: usuario.cidade,
      estado: usuario.estado,
      pais: usuario.pais,
      postagens: usuario.postagens || [],
      amigos
    };
  } catch (err) {
    console.error('[CONTROLLER][ERROR] Erro ao buscar perfil completo:', err);
    return null;
  }
};

// Gerar URL camuflada do perfil "chogue"
exports.gerarUrlPerfilChogue = (id_usuario) => {
  return `/usuarios/chogue_u-@-_${id_usuario}`;
};

// Gerar URL camuflada para perfil próprio
exports.gerarUrlPerfilProprio = (id_usuario) => {
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `/usuarios/perfil-${rand}_${id_usuario}`;
};

// Gerar URL camuflada para perfil de outro usuário
exports.gerarUrlPerfilOutro = (id_usuario) => {
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `/usuarios/u-@-${rand}_${id_usuario}`;
};

