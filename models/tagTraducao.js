module.exports = (sequelize, DataTypes) => {
  const TagTraducao = sequelize.define('TagTraducao', {
    id_tag: { type: DataTypes.INTEGER, primaryKey: true },
    codigo_idioma: { type: DataTypes.STRING(10), primaryKey: true },
    nome_tag: DataTypes.STRING(100),
    descricao_tag: DataTypes.TEXT
  }, {
    tableName: 'tags_traducao',
    timestamps: false
  });

  TagTraducao.associate = models => {
    TagTraducao.belongsTo(models.Tag, { as: 'tag', foreignKey: 'id_tag' });
    TagTraducao.belongsTo(models.Idioma, { as: 'idioma', foreignKey: 'codigo_idioma' });
  };

  return TagTraducao;
};