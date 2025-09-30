module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id_report: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_postagem: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    snapshot_post: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_report: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'reports',
    timestamps: false
  });

  Report.associate = models => {
    Report.belongsTo(models.Postagem, { foreignKey: 'id_postagem', as: 'postagem' });
    Report.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  };

  return Report;
};
