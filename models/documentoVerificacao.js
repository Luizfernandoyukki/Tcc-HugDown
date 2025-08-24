module.exports = (sequelize, DataTypes) => {
  const DocumentoVerificacao = sequelize.define('DocumentoVerificacao', {
    id_documento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    tipo_documento: DataTypes.ENUM('graduacao', 'pos_graduacao', 'crm', 'crefito', 'coren', 'other'),
    numero_documento: DataTypes.STRING(100),
    instituicao: DataTypes.STRING(200),
    caminho_arquivo: { type: DataTypes.STRING(500), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'), defaultValue: 'pending' },
    data_submissao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_verificacao: DataTypes.DATE,
    verificado_por_admin: DataTypes.INTEGER,
    observacoes: DataTypes.TEXT
  }, {
    tableName: 'documentos_verificacao',
    timestamps: false
  });

  DocumentoVerificacao.associate = models => {
    DocumentoVerificacao.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
    DocumentoVerificacao.belongsTo(models.Administrador, { as: 'verificador', foreignKey: 'verificado_por_admin' });
  };

  return DocumentoVerificacao;
};