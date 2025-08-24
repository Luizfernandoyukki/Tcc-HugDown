module.exports = (sequelize, DataTypes) => {
  const ParticipanteEvento = sequelize.define('ParticipanteEvento', {
    id_participante: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_evento: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    status_participacao: { type: DataTypes.ENUM('confirmed', 'maybe', 'not_going', 'canceled'), defaultValue: 'confirmed' },
    data_inscricao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'participantes_evento',
    timestamps: false
  });

  ParticipanteEvento.associate = models => {
    ParticipanteEvento.belongsTo(models.Evento, { as: 'evento', foreignKey: 'id_evento' });
    ParticipanteEvento.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
  };

  return ParticipanteEvento;
};