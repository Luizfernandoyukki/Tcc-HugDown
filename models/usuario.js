module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nome_real: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sobrenome_real: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nome_usuario: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cep: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pais: {
      type: DataTypes.STRING(100),
      defaultValue: 'Brasil'
    },
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    foto_perfil: {
      type: DataTypes.STRING(500)
    },
    biografia: {
      type: DataTypes.TEXT
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_atualizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    idioma_preferido: {
      type: DataTypes.STRING(10),
      defaultValue: 'en-US'
    },
    genero: {
      type: DataTypes.STRING(20)
    },
    data_nascimento: {
      type: DataTypes.DATE
    },
    fuso_horario: {
      type: DataTypes.STRING(50)
    },
    provider_oauth: {
      type: DataTypes.STRING(50)
    },
    id_oauth: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Postagem, {
      foreignKey: 'id_autor',
      as: 'postagens'
    });
    Usuario.hasMany(models.Amizade, {
      foreignKey: 'id_solicitante',
      as: 'amizadesSolicitadas'
    });
    Usuario.hasMany(models.Amizade, {
      foreignKey: 'id_destinatario',
      as: 'amizadesRecebidas'
    });
    Usuario.hasMany(models.Curtida, {
      foreignKey: 'id_usuario',
      as: 'curtidas'
    });
    Usuario.hasMany(models.Comentario, {
      foreignKey: 'id_autor',
      as: 'comentarios'
    });
    Usuario.hasMany(models.Compartilhamento, {
      foreignKey: 'id_usuario',
      as: 'compartilhamentos'
    });
    Usuario.hasMany(models.MensagemDireta, {
      foreignKey: 'id_remetente',
      as: 'mensagensEnviadas'
    });
    Usuario.hasMany(models.MensagemDireta, {
      foreignKey: 'id_destinatario',
      as: 'mensagensRecebidas'
    });
    Usuario.hasMany(models.Grupo, {
      foreignKey: 'id_administrador',
      as: 'gruposAdministrados'
    });
    Usuario.hasMany(models.MembroGrupo, {
      foreignKey: 'id_usuario',
      as: 'gruposMembro'
    });
    Usuario.hasMany(models.FiltroUsuario, {
      foreignKey: 'id_usuario',
      as: 'filtros'
    });
    Usuario.hasMany(models.Notificacao, {
      foreignKey: 'id_usuario',
      as: 'notificacoes'
    });
    Usuario.hasMany(models.DocumentoVerificacao, {
      foreignKey: 'id_usuario',
      as: 'documentosVerificacao'
    });
    Usuario.hasMany(models.ParticipanteEvento, {
      foreignKey: 'id_usuario',
      as: 'eventosParticipante'
    });
    Usuario.hasMany(models.Evento, {
      foreignKey: 'id_organizador',
      as: 'eventosOrganizados'
    });
    Usuario.hasMany(models.Administrador, {
      foreignKey: 'id_usuario',
      as: 'administrador'
    });
  };

  return Usuario;
};