module.exports = (sequelize, DataTypes) => {
  const DocumentoVerificacao = sequelize.define('DocumentoVerificacao', {
    id_documento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_documento: {
      type: DataTypes.ENUM('graduacao', 'pos_graduacao', 'crm', 'crefito', 'coren', 'other'),
      allowNull: false
    },
    numero_documento: {
      type: DataTypes.STRING(100)
    },
    instituicao: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    caminho_arquivo: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'),
      defaultValue: 'pending'
    },
    data_submissao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_verificacao: {
      type: DataTypes.DATE
    },
    verificado_por_admin: {
      type: DataTypes.INTEGER
    },
    observacoes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'documentos_verificacao',
    timestamps: false
  });

  DocumentoVerificacao.associate = (models) => {
    DocumentoVerificacao.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
    DocumentoVerificacao.belongsTo(models.Administrador, {
      foreignKey: 'verificado_por_admin',
      as: 'adminVerificador'
      });
  };

  return DocumentoVerificacao;
};