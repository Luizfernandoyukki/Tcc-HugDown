module.exports = (sequelize, DataTypes) => {
  const ProfissionalSaude = sequelize.define('ProfissionalSaude', {
    id_profissional: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_registro: {
      type: DataTypes.ENUM('CRM', 'COREN', 'CRF', 'CREFITO', 'CRP', 'OUTRO'),
      allowNull: false
    },
    numero_registro: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    uf_registro: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    especialidade: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    instituicao: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    data_registro: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status_verificacao: {
      type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado'),
      defaultValue: 'pendente'
    },
    data_solicitacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_verificacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verificado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'profissionais_saude',
    timestamps: false
  });

  ProfissionalSaude.associate = models => {
    ProfissionalSaude.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    ProfissionalSaude.belongsTo(models.Administrador, { foreignKey: 'verificado_por', as: 'administradorVerificador' });
    ProfissionalSaude.hasMany(models.DocumentoVerificacao, { foreignKey: 'id_profissional', as: 'documentos' });
  };

  return ProfissionalSaude;
};