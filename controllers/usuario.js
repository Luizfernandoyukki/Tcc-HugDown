const { Usuario, Idioma, Amizade, Postagem, ProfissionalSaude } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { deletePublicFile } = require('../utils/fileCleaner'); // adicione entre os requires no topo

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
    // Log dos dados recebidos (detalhado)
    console.log('[CADASTRO][REQ.METHOD]', req.method);
    console.log('[CADASTRO][REQ.HEADERS]', req.headers);
    console.log('[CADASTRO][REQ.BODY]', req.body);
    if (req.file) {
      console.log('[CADASTRO][REQ.FILE]', req.file);
    }
    if (req.files) {
      console.log('[CADASTRO][REQ.FILES]', req.files);
    }
    console.log('[CADASTRO][CHECKBOX][profissional_saude]:', req.body.profissional_saude);

    // Log individual de cada campo
    [
      'email', 'nome_real', 'sobrenome_real', 'nome_usuario', 'telefone', 'endereco',
      'cidade', 'estado', 'cep', 'pais', 'genero', 'data_nascimento', 'senha',
      'idioma_preferido', 'biografia', 'fuso_horario', 'profissional_saude',
      'tipo_registro', 'numero_registro', 'uf_registro', 'instituicao', 'especialidade'
    ].forEach(campo => {
      console.log(`[CADASTRO][CAMPO] ${campo}:`, req.body[campo]);
    });

    // Se não chegou nenhum dado, loga e retorna erro amigável
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('[CADASTRO][ERRO] Nenhum dado recebido no req.body');
      return res.status(400).render('cadastro', { error: 'Nenhum dado recebido. Verifique o formulário e tente novamente.' });
    }

    // Extrai os dados do body ou do FormData
    let {
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
      biografia,
      fuso_horario
    } = req.body;

    // Busca do sistema se não vier do formulário
    if (!idioma_preferido) idioma_preferido = req.headers['accept-language']?.split(',')[0] || 'pt-BR';
    if (!fuso_horario) fuso_horario = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || 'America/Sao_Paulo';
    if (!pais) pais = 'Brasil';

    // Remove máscara do telefone e cep se vierem mascarados
    if (telefone) telefone = telefone.replace(/\D/g, '');
    if (cep) cep = cep.replace(/\D/g, '');

    // Validação dos campos obrigatórios (apenas os do formulário principal)
    const camposObrigatorios = [
      'email', 'nome_real', 'sobrenome_real', 'nome_usuario', 'telefone', 'endereco',
      'cidade', 'estado', 'cep', 'senha', 'genero', 'data_nascimento', 'idioma_preferido', 'pais'
    ];
    let camposFaltando = [];
    camposObrigatorios.forEach(campo => {
      if (!req.body[campo] || !String(req.body[campo]).trim()) {
        camposFaltando.push(campo);
      }
    });
    if (camposFaltando.length > 0) {
      const msg = 'Preencha todos os campos obrigatórios: ' + camposFaltando.join(', ');
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ error: msg });
      }
      return res.render('cadastro', { error: msg });
    }

    // Checa duplicidade de email e nome_usuario
    const emailExistente = await Usuario.findOne({ where: { email: req.body.email } });
    if (emailExistente) {
      const msg = 'Já existe um usuário com este e-mail.';
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ error: msg });
      }
      return res.render('cadastro', { error: msg });
    }
    const usuarioExistente = await Usuario.findOne({ where: { nome_usuario: req.body.nome_usuario } });
    if (usuarioExistente) {
      const msg = 'Já existe um usuário com este nome de usuário.';
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ error: msg });
      }
      return res.render('cadastro', { error: msg });
    }

    // Criptografa a senha antes de salvar
    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    // Foto de perfil (agora espera caminho relativo vindo do front)
    let foto_perfil = null;
    if (req.file) {
      foto_perfil = '/images/perfis/' + req.file.filename;
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
      fuso_horario
    });

    // Documento de verificação (somente se profissional_saude marcado)
    if (req.body.profissional_saude === '1') {
      const { DocumentoVerificacao } = require('../models');
      let caminho_arquivo = null;
      if (req.body.documento_comprobatorio) {
        caminho_arquivo = '/images/docs/' + req.body.documento_comprobatorio;
      }
      await DocumentoVerificacao.create({
        id_usuario: novoUsuario.id_usuario,
        tipo_documento: req.body.tipo_registro,
        numero_documento: req.body.numero_registro,
        instituicao: req.body.instituicao,
        caminho_arquivo,
        status: 'pending',
        observacoes: req.body.especialidade || null
      });
    }

    // Sempre responde JSON de sucesso, nunca faz redirect
    return res.json({ success: true, msg: 'Cadastro realizado com sucesso! Faça login para continuar.' });
  } catch (err) {
    // Tratamento de erro de validação do Sequelize
    let mensagemErro = 'Erro ao criar usuário';
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      mensagemErro = err.errors ? err.errors.map(e => e.message).join('; ') : err.message;
    } else if (err.message) {
      mensagemErro = err.message;
    }
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({ error: mensagemErro });
    }
    return res.status(500).render('cadastro', { error: mensagemErro });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Foto de perfil (espera caminho relativo vindo do front)
    if (req.body.foto_perfil) {
      req.body.foto_perfil = '/images/perfis/' + req.body.foto_perfil;
    }

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

    // Apaga foto de perfil física se existir localmente
    try {
      const foto = usuario.foto_perfil;
      if (foto) {
        deletePublicFile(foto);
      }
    } catch (err) {
      console.warn('[USUARIO][REMOVER] erro ao remover foto de perfil:', err.message);
    }

    // Remove mídias associadas às postagens deste usuário (se houver)
    try {
      const postagens = await Postagem.findAll({ where: { id_autor: id } });
      for (const post of postagens) {
        const midia = post.url_midia;
        if (midia && typeof midia === 'string') {
          deletePublicFile(midia);
        }
      }
    } catch (err) {
      console.warn('[USUARIO][REMOVER] erro ao remover mídias de postagens:', err.message);
    }

    // Agora remove o usuário (CASCATA deve remover postagens/relacionados no DB)
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

    // Nova checagem: usuário bloqueado
    if (usuario.bloqueado) {
      // Monta mensagem com motivo e data se disponível
      let motivo = usuario.motivo_bloqueio ? `Motivo: ${usuario.motivo_bloqueio}. ` : '';
      let infoData = usuario.data_bloqueio ? `Data do bloqueio: ${usuario.data_bloqueio}` : '';
      const msg = `Conta bloqueada. ${motivo}${infoData}`.trim();
      // Log breve
      console.warn(`[LOGIN] Tentativa de login bloqueada para usuário ${usuario.email} (id ${usuario.id_usuario})`);
      return res.render('login', { error: msg || 'Conta bloqueada.', isLoggedIn: false });
    }

    // Verifica se a senha está correta
    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) {
      return res.render('login', { error: 'Senha incorreta!', isLoggedIn: false });
    }

    // Autenticação bem-sucedida
    req.session.userId = usuario.id_usuario;
    req.session.isLoggedIn = true;

    // Verifica se é administrador e qual papel
    const { Administrador } = require('../models');
    const admin = await Administrador.findOne({ where: { id_usuario: usuario.id_usuario } });
    if (admin) {
      if (admin.nivel_admin === 'super_admin') {
        return res.redirect('/admin/super');
      }
      if (admin.nivel_admin === 'moderator') {
        return res.redirect('/admin/moderador');
      }
      if (admin.nivel_admin === 'verifier') {
        return res.redirect('/admin/verificador');
      }
    }

    return res.redirect('/');
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
        'id_usuario', 'nome_usuario', 'nome_real', 'sobrenome_real', 'email', 'foto_perfil', 'biografia', 'cidade', 'estado', 'pais', 'verificado'
      ],
      include: [
        {
          model: Postagem,
          as: 'postagens',
          attributes: ['id_postagem', 'titulo', 'resumo', 'url_midia', 'data_criacao']
        },
        {
          model: require('../models').Amizade,
          as: 'amizadesSolicitadas',
          where: { status_amizade: 'accepted' },
          required: false,
          include: [{
            model: require('../models').Usuario,
            as: 'destinatario', // amigo é o destinatario
            attributes: ['id_usuario', 'nome_usuario', 'foto_perfil']
          }]
        },
        {
          model: require('../models').Amizade,
          as: 'amizadesRecebidas',
          where: { status_amizade: 'accepted' },
          required: false,
          include: [{
            model: require('../models').Usuario,
            as: 'solicitante', // amigo é o solicitante
            attributes: ['id_usuario', 'nome_usuario', 'foto_perfil']
          }]
        },
        {
          model: require('../models').ProfissionalSaude,
          as: 'profissionalSaude',
          where: { status_verificacao: 'aprovado' },
          required: false
        }
      ]
    });
    if (!usuario) {
      console.warn('[CONTROLLER] Usuário não encontrado:', id);
      return null;
    }

    // Junta todos os amigos das duas associações
    let amigos = [];
    if (usuario.amizadesSolicitadas && Array.isArray(usuario.amizadesSolicitadas)) {
      amigos = amigos.concat(usuario.amizadesSolicitadas.map(a => a.destinatario).filter(Boolean));
    }
    if (usuario.amizadesRecebidas && Array.isArray(usuario.amizadesRecebidas)) {
      amigos = amigos.concat(usuario.amizadesRecebidas.map(a => a.solicitante).filter(Boolean));
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
      verificado: usuario.verificado,
      profissionalSaude: usuario.profissionalSaude ? usuario.profissionalSaude[0] : null,
      postagens: usuario.postagens || [],
      amigos
    };
  } catch (err) {
    console.error('[CONTROLLER][ERROR] Erro ao buscar perfil completo:', err);
    return null;
  }
};