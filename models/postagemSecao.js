module.exports = (sequelize, DataTypes) => {
  const PostagemSecao = sequelize.define('PostagemSecao', {
    id_postagem: { type: DataTypes.INTEGER, primaryKey: true },
    id_secao: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'postagens_secoes',
    timestamps: false
  });

  PostagemSecao.associate = models => {
    PostagemSecao.belongsTo(models.Postagem, { as: 'postagem', foreignKey: 'id_postagem' });
    PostagemSecao.belongsTo(models.Secao, { as: 'secao', foreignKey: 'id_secao' });
  };

  return PostagemSecao;
};