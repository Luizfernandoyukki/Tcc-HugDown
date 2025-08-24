module.exports = (sequelize, DataTypes) => {
  const Amizade = sequelize.define('Amizade', {
    id_amizade: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_solicitante: { type: DataTypes.INTEGER, allowNull: false },
    id_destinatario: { type: DataTypes.INTEGER, allowNull: false },
    status_amizade: { type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'), defaultValue: 'pending' },
    data_solicitacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_atualizacao: DataTypes.DATE
  }, {
    tableName: 'amizades',
    timestamps: false
  });

  Amizade.associate = models => {
    Amizade.belongsTo(models.Usuario, { as: 'solicitante', foreignKey: 'id_solicitante' });
    Amizade.belongsTo(models.Usuario, { as: 'destinatario', foreignKey: 'id_destinatario' });
  };

  return Amizade;
};