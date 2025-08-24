module.exports = (sequelize, DataTypes) => {
  const Administrador = sequelize.define('Administrador', {
    id_admin: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    nivel_admin: { type: DataTypes.ENUM('super_admin', 'moderator', 'verifier'), allowNull: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'administradores',
    timestamps: false
  });

  Administrador.associate = models => {
    Administrador.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
    Administrador.hasMany(models.DocumentoVerificacao, { as: 'documentosVerificados', foreignKey: 'verificado_por_admin' });
  };

  return Administrador;
};