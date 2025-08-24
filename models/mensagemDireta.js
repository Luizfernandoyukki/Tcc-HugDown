module.exports = (sequelize, DataTypes) => {
  const MensagemDireta = sequelize.define('MensagemDireta', {
    id_mensagem: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_remetente: { type: DataTypes.INTEGER, allowNull: false },
    id_destinatario: { type: DataTypes.INTEGER, allowNull: false },
    conteudo: DataTypes.TEXT,
    url_midia: DataTypes.STRING(500),
    tipo_midia: DataTypes.STRING(50),
    lida: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'mensagens_diretas',
    timestamps: false
  });

  MensagemDireta.associate = models => {
    MensagemDireta.belongsTo(models.Usuario, { as: 'remetente', foreignKey: 'id_remetente' });
    MensagemDireta.belongsTo(models.Usuario, { as: 'destinatario', foreignKey: 'id_destinatario' });
  };

  return MensagemDireta;
};