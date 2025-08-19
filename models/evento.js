module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    id_evento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_organizador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_categoria: {
      type: DataTypes.INTEGER
    },
    titulo_evento: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descricao_evento: {
      type: DataTypes.TEXT
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_fim: {
      type: DataTypes.DATE
    },
    local_evento: {
      type: DataTypes.STRING(500)
    },
    endereco_evento: {
      type: DataTypes.TEXT
    },
    tipo_evento: {
      type: DataTypes.ENUM('in_person', 'online', 'hybrid'),
      defaultValue: 'in_person'
    },
    evento_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    link_online: {
      type: DataTypes.STRING(500)
    },
    max_participantes: {
      type: DataTypes.INTEGER
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7)
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7)
    }
  }, {
    tableName: 'eventos',
    timestamps: false
  });

  Evento.associate = (models) => {
    Evento.belongsTo(models.Usuario, {
      foreignKey: 'id_organizador',
      as: 'organizador'
    });
    Evento.belongsTo(models.Categoria, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });
    Evento.hasMany(models.ParticipanteEvento, {
      foreignKey: 'id_evento',
      as: 'participantes'
    });
  };
  return Evento;
};