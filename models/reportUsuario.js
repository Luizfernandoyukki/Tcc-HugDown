module.exports = (sequelize, DataTypes) => {
  const ReportUsuario = sequelize.define('ReportUsuario', {
    id_report: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false }, // usuário denunciado
    id_denunciante: { type: DataTypes.INTEGER, allowNull: false }, // quem fez a denúncia
    motivo: { type: DataTypes.TEXT, allowNull: false },
    detalhes: DataTypes.TEXT,
    data_report: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'), defaultValue: 'pending' }
  }, {
    tableName: 'reports_usuarios',
    timestamps: false
  });

  ReportUsuario.associate = models => {
    ReportUsuario.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuarioDenunciado' });
    ReportUsuario.belongsTo(models.Usuario, { foreignKey: 'id_denunciante', as: 'denunciante' });
  };

  return ReportUsuario;
};
