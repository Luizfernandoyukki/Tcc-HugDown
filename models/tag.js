module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id_tag: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_tag: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descricao_tag: DataTypes.TEXT,
    uso_contador: { type: DataTypes.INTEGER, defaultValue: 0 },
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