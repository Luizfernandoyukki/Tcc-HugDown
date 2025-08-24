module.exports = (sequelize, DataTypes) => {
  const Idioma = sequelize.define('Idioma', {
    codigo_idioma: { type: DataTypes.STRING(10), primaryKey: true },
    nome_idioma: { type: DataTypes.STRING(100), allowNull: false }
  }, {
    tableName: 'idiomas',
    timestamps: false
  });

  Idioma.associate = models => {
    Idioma.hasMany(models.CategoriaTraducao, { as: 'categoriasTraducao', foreignKey: 'codigo_idioma' });
    Idioma.hasMany(models.SecaoTraducao, { as: 'secoesTraducao', foreignKey: 'codigo_idioma' });
    Idioma.hasMany(models.TagTraducao, { as: 'tagsTraducao', foreignKey: 'codigo_idioma' });
  };

  return Idioma;
};