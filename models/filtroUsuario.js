module.exports = (sequelize, DataTypes) => {
  const FiltroUsuario = sequelize.define('FiltroUsuario', {
    id_filtro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_filtro: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    configuracao_filtro: {
      type: DataTypes.JSON,
      allowNull: false
    },
    filtro_ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'filtros_usuario',
    timestamps: false
  });

  FiltroUsuario.associate = (models) => {
    FiltroUsuario.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
  };

  return FiltroUsuario;
};