module.exports = (sequelize, DataTypes) => {
  const Amizade = sequelize.define('Amizade', {
    id_amizade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_solicitante: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_destinatario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_amizade: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'),
      defaultValue: 'pending'
    },
    data_solicitacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_atualizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'amizades',
    timestamps: false
  });

  Amizade.associate = (models) => {
    Amizade.belongsTo(models.Usuario, {
      foreignKey: 'id_solicitante',
      as: 'solicitante'
    });
    Amizade.belongsTo(models.Usuario, {
      foreignKey: 'id_destinatario',
      as: 'destinatario'
    });
  };

   return Amizade;
};