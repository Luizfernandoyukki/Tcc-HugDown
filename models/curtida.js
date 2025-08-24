module.exports = (sequelize, DataTypes) => {
  const Curtida = sequelize.define('Curtida', {
    id_curtida: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postagem: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    data_curtida: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'curtidas',
    timestamps: false
  });

  Curtida.associate = models => {
    Curtida.belongsTo(models.Postagem, { as: 'postagem', foreignKey: 'id_postagem' });
    Curtida.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
  };

  return Curtida;
};