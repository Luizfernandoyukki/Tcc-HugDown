module.exports = (sequelize, DataTypes) => {
  const ReportComentario = sequelize.define('ReportComentario', {
    id_report: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_comentario: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.TEXT, allowNull: false },
    snapshot_comentario: { type: DataTypes.TEXT, allowNull: false },
    data_report: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'), defaultValue: 'pending' }
  }, {
    tableName: 'reports_comentarios',
    timestamps: false
  });

  ReportComentario.associate = models => {
    ReportComentario.belongsTo(models.Comentario, { foreignKey: 'id_comentario', as: 'comentario' });
    ReportComentario.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  };

  return ReportComentario;
};
