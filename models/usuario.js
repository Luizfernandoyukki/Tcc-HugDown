module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false },
    senha_hash: { type: DataTypes.STRING(255), allowNull: false },
    nome_real: { type: DataTypes.STRING(100), allowNull: false },
    sobrenome_real: { type: DataTypes.STRING(100), allowNull: false },
    nome_usuario: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING(20), allowNull: false },
    endereco: { type: DataTypes.STRING(255), allowNull: false },
    cidade: { type: DataTypes.STRING(100), allowNull: false },
    estado: { type: DataTypes.STRING(50), allowNull: false },
    cep: { type: DataTypes.STRING(20), allowNull: false },
    pais: { type: DataTypes.STRING(100), defaultValue: 'Brasil' },
    verificado: { type: DataTypes.BOOLEAN, defaultValue: false },
    foto_perfil: DataTypes.STRING(500),
    biografia: DataTypes.TEXT,
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_atualizacao: DataTypes.DATE,
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    idioma_preferido: { type: DataTypes.STRING(10), defaultValue: 'en-US' },
    genero: DataTypes.STRING(20),
    data_nascimento: DataTypes.DATE,
    fuso_horario: DataTypes.STRING(50),
    provider_oauth: DataTypes.STRING(50),
    id_oauth: DataTypes.STRING(100)
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  Usuario.associate = models => {
    Usuario.hasMany(models.Postagem, { as: 'postagens', foreignKey: 'id_autor' });
    Usuario.hasMany(models.Administrador, { as: 'administrador', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.DocumentoVerificacao, { as: 'documentos', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Amizade, { as: 'amizadesSolicitadas', foreignKey: 'id_solicitante' });
    Usuario.hasMany(models.Amizade, { as: 'amizadesRecebidas', foreignKey: 'id_destinatario' });
    Usuario.hasMany(models.MensagemDireta, { as: 'mensagensEnviadas', foreignKey: 'id_remetente' });
    Usuario.hasMany(models.MensagemDireta, { as: 'mensagensRecebidas', foreignKey: 'id_destinatario' });
    Usuario.hasMany(models.Evento, { as: 'eventosOrganizados', foreignKey: 'id_organizador' });
    Usuario.hasMany(models.ParticipanteEvento, { as: 'participacoesEvento', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Grupo, { as: 'gruposAdministrados', foreignKey: 'id_administrador' });
    Usuario.hasMany(models.MembroGrupo, { as: 'membrosGrupo', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Notificacao, { as: 'notificacoes', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Curtida, { as: 'curtidas', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Compartilhamento, { as: 'compartilhamentos', foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Comentario, { as: 'comentarios', foreignKey: 'id_autor' });
  };

  return Usuario;
};