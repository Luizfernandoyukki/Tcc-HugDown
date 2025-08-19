module.exports = (sequelize, DataTypes) => {
  const PostagemTag = sequelize.define('PostagemTag', {
    id_postagem: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_tag: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'postagens_tags',
    timestamps: false
  });

  PostagemTag.associate = (models) => {
    PostagemTag.belongsTo(models.Postagem, {
      foreignKey: 'id_postagem',
      as: 'postagem'
    });
    PostagemTag.belongsTo(models.Tag, {
      foreignKey: 'id_tag',
      as: 'tag'
    });
  };

  return PostagemTag;
};