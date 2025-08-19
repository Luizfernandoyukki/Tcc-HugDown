module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_categoria: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    cor_categoria: {
      type: DataTypes.STRING(7),
      defaultValue: '#007bff'
    },
    icone: {
      type: DataTypes.STRING(50)
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Postagem, {
      foreignKey: 'id_categoria',
      as: 'postagens'
    });
    Categoria.hasMany(models.CategoriaTraducao, {
      foreignKey: 'id_categoria',
      as: 'traducoes'
    });
  };

  return Categoria;
};