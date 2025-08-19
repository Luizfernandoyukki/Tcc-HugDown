module.exports = (sequelize, DataTypes) => {
  const Notificacao = sequelize.define('Notificacao', {
    id_notificacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_notificacao: {
      type: DataTypes.ENUM('like', 'comment', 'share', 'friendship', 'message', 'event', 'system'),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    mensagem: {
      type: DataTypes.TEXT
    },
    url_relacionada: {
      type: DataTypes.STRING(500)
    },
    lida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'notificacoes',
    timestamps: false
  });

  Notificacao.associate = (models) => {
    Notificacao.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
    };

  return Notificacao;
};