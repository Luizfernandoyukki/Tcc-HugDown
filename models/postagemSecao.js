module.exports = (sequelize, DataTypes) => {
  const PostagemSecao = sequelize.define('PostagemSecao', {
    id_postagem: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_secao: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'postagens_secoes',
    timestamps: false
  });

  PostagemSecao.associate = (models) => {
    PostagemSecao.belongsTo(models.Postagem, {
      foreignKey: 'id_postagem',
      as: 'postagem'
    });
    PostagemSecao.belongsTo(models.Secao, {
      foreignKey: 'id_secao',
      as: 'secao'
    });
  };
  
  return PostagemSecao;
};