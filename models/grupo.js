module.exports = (sequelize, DataTypes) => {
  const Grupo = sequelize.define('Grupo', {
    id_grupo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_administrador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_grupo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao_grupo: {
      type: DataTypes.TEXT
    },
    foto_grupo: {
      type: DataTypes.STRING(500)
    },
    tipo_privacidade: {
      type: DataTypes.ENUM('public', 'private', 'secret'),
      defaultValue: 'public'
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'grupos',
    timestamps: false
  });

  Grupo.associate = (models) => {
    Grupo.belongsTo(models.Usuario, {
      foreignKey: 'id_administrador',
      as: 'administrador'
    });
    Grupo.hasMany(models.MembroGrupo, {
      foreignKey: 'id_grupo',
      as: 'membros'
    });
  };

  return Grupo;
};