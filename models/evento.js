module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    id_evento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_organizador: { type: DataTypes.INTEGER, allowNull: false },
    id_categoria: DataTypes.INTEGER,
    titulo_evento: { type: DataTypes.STRING(200), allowNull: false },
    descricao_evento: DataTypes.TEXT,
    data_inicio: { type: DataTypes.DATE, allowNull: false },
    data_fim: DataTypes.DATE,
    local_evento: DataTypes.STRING(500),
    endereco_evento: DataTypes.TEXT,
    tipo_evento: { type: DataTypes.ENUM('in_person', 'online', 'hybrid'), defaultValue: 'in_person' },
    evento_online: { type: DataTypes.BOOLEAN, defaultValue: false },
    link_online: DataTypes.STRING(500),
    max_participantes: DataTypes.INTEGER,
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    latitude: DataTypes.DECIMAL(10,7),
    longitude: DataTypes.DECIMAL(10,7)
  }, {
    tableName: 'eventos',
    timestamps: false
  });

  Evento.associate = models => {
    Evento.belongsTo(models.Usuario, { as: 'organizador', foreignKey: 'id_organizador' });
    Evento.belongsTo(models.Categoria, { as: 'categoria', foreignKey: 'id_categoria' });
    Evento.hasMany(models.ParticipanteEvento, { as: 'participantes', foreignKey: 'id_evento' });
  };

  return Evento;
};