module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id_tag: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_tag: DataTypes.STRING,
    descricao_tag: DataTypes.TEXT,
    uso_contador: DataTypes.INTEGER,
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'tags',
    timestamps: false
  });

  Tag.associate = models => {
    Tag.hasMany(models.TagTraducao, { as: 'traducoes', foreignKey: 'id_tag' });
    Tag.belongsToMany(models.Postagem, {
      through: 'postagens_tags',
      as: 'postagens',
      foreignKey: 'id_tag',
      otherKey: 'id_postagem'
    });
  };

  return Tag;
};