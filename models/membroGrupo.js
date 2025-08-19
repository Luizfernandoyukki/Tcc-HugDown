module.exports = (sequelize, DataTypes) => {
  const MembroGrupo = sequelize.define('MembroGrupo', {
    id_membro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    papel_membro: {
      type: DataTypes.ENUM('admin', 'moderator', 'member'),
      defaultValue: 'member'
    },
    data_entrada: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'membros_grupo',
    timestamps: false
  });

  MembroGrupo.associate = (models) => {
    MembroGrupo.belongsTo(models.Grupo, {
      foreignKey: 'id_grupo',
      as: 'grupo'
    });
    MembroGrupo.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
  };

  return MembroGrupo;
};