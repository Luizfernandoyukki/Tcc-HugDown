module.exports = (sequelize, DataTypes) => {
  const CategoriaTraducao = sequelize.define('CategoriaTraducao', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    codigo_idioma: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    nome_categoria: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'categorias_traducao',
    timestamps: false
  });

  CategoriaTraducao.associate = (models) => {
    CategoriaTraducao.belongsTo(models.Categoria, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });
    CategoriaTraducao.belongsTo(models.Idioma, {
      foreignKey: 'codigo_idioma',
      as: 'idioma'
    });
  };

  return CategoriaTraducao;
};