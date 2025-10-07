module.exports = (sequelize, DataTypes) => {
  const ReportAmigo = sequelize.define('ReportAmigo', {
    id_report: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_remetente: { type: DataTypes.INTEGER, allowNull: false },
    id_destinatario: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.TEXT, allowNull: false },
    detalhes: DataTypes.TEXT,
    data_report: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'), defaultValue: 'pending' }
  }, {
    tableName: 'reports_amigos',
    timestamps: false
  });

  ReportAmigo.associate = models => {
    ReportAmigo.belongsTo(models.Usuario, { foreignKey: 'id_remetente', as: 'remetente' });
    ReportAmigo.belongsTo(models.Usuario, { foreignKey: 'id_destinatario', as: 'destinatario' });
  };

  return ReportAmigo;
};
