module.exports = (sequelize, DataTypes) => {
  const Compartilhamento = sequelize.define('Compartilhamento', {
    id_compartilhamento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postagem: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    mensagem_compartilhamento: DataTypes.TEXT,
    data_compartilhamento: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'compartilhamentos',
    timestamps: false
  });

  Compartilhamento.associate = models => {
    Compartilhamento.belongsTo(models.Postagem, { as: 'postagem', foreignKey: 'id_postagem' });
    Compartilhamento.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
  };

  return Compartilhamento;
};