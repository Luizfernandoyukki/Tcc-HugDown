module.exports = (sequelize, DataTypes) => {
  const CategoriaTraducao = sequelize.define('CategoriaTraducao', {
    id_categoria: { type: DataTypes.INTEGER, primaryKey: true },
    codigo_idioma: { type: DataTypes.STRING(10), primaryKey: true },
    nome_categoria: DataTypes.STRING(100),
    descricao: DataTypes.TEXT
  }, {
    tableName: 'categorias_traducao',
    timestamps: false
  });

  CategoriaTraducao.associate = models => {
    CategoriaTraducao.belongsTo(models.Categoria, { as: 'categoria', foreignKey: 'id_categoria' });
    CategoriaTraducao.belongsTo(models.Idioma, { as: 'idioma', foreignKey: 'codigo_idioma' });
  };

  return CategoriaTraducao;
};