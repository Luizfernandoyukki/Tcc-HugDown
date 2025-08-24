module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_categoria: { type: DataTypes.STRING(100), allowNull: false },
    descricao: DataTypes.TEXT,
    cor_categoria: { type: DataTypes.STRING(7), defaultValue: '#007bff' },
    icone: DataTypes.STRING(50),
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  Categoria.associate = models => {
    Categoria.hasMany(models.CategoriaTraducao, { as: 'traducoes', foreignKey: 'id_categoria' });
    Categoria.hasMany(models.Postagem, { as: 'postagens', foreignKey: 'id_categoria' });
    Categoria.hasMany(models.Evento, { as: 'eventos', foreignKey: 'id_categoria' });
  };

  return Categoria;
};