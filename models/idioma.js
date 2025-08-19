module.exports = (sequelize, DataTypes) => {
  const Idioma = sequelize.define('Idioma', {
    codigo_idioma: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    nome_idioma: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'idiomas',
    timestamps: false
  });

  Idioma.associate = (models) => {
    Idioma.hasMany(models.CategoriaTraducao, {
      foreignKey: 'codigo_idioma',
      as: 'categoriasTraducoes'
    });
    Idioma.hasMany(models.SecaoTraducao, {
      foreignKey: 'codigo_idioma',
      as: 'secoesTraducoes'
    });
    Idioma.hasMany(models.TagTraducao, {
      foreignKey: 'codigo_idioma',
      as: 'tagsTraducoes'
    });
  };

  return Idioma;
};