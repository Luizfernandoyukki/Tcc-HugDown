module.exports = (sequelize, DataTypes) => {
  const MensagemDireta = sequelize.define('MensagemDireta', {
    id_mensagem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_remetente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_destinatario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT
    },
    url_midia: {
      type: DataTypes.STRING(500)
    },
    tipo_midia: {
      type: DataTypes.STRING(50)
    },
    lida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    data_envio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'mensagens_diretas',
    timestamps: false
  });

  MensagemDireta.associate = (models) => {
    MensagemDireta.belongsTo(models.Usuario, {
      foreignKey: 'id_remetente',
      as: 'remetente'
    });
    MensagemDireta.belongsTo(models.Usuario, {
      foreignKey: 'id_destinatario',
      as: 'destinatario'
    });
      };

  return MensagemDireta;
};