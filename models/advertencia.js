module.exports = (sequelize, DataTypes) => {
  const Advertencia = sequelize.define('Advertencia', {
    id_advertencia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    motivo: DataTypes.TEXT,
    detalhes: DataTypes.TEXT,
    data_advertencia: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('ativa', 'removida'), defaultValue: 'ativa' }
  }, {
    tableName: 'advertencias',
    timestamps: false
  });

  Advertencia.associate = models => {
    Advertencia.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
  };

  return Advertencia;
};
