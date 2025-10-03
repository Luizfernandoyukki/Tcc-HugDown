module.exports = (sequelize, DataTypes) => {
  const ReportGrupo = sequelize.define('ReportGrupo', {
    id_report: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_grupo: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.TEXT, allowNull: false },
    data_report: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'), defaultValue: 'pending' }
  }, {
    tableName: 'reports_grupos',
    timestamps: false
  });

  ReportGrupo.associate = models => {
    ReportGrupo.belongsTo(models.Grupo, { foreignKey: 'id_grupo', as: 'grupo' });
    ReportGrupo.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  };

  return ReportGrupo;
};
