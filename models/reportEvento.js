module.exports = (sequelize, DataTypes) => {
  const ReportEvento = sequelize.define('ReportEvento', {
    id_report: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_evento: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.TEXT, allowNull: false },
    detalhes: DataTypes.TEXT,
    data_report: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'), defaultValue: 'pending' }
  }, {
    tableName: 'reports_eventos',
    timestamps: false
  });

  ReportEvento.associate = models => {
    ReportEvento.belongsTo(models.Evento, { foreignKey: 'id_evento', as: 'evento' });
    ReportEvento.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  };

  return ReportEvento;
};
