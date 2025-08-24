module.exports = (sequelize, DataTypes) => {
  const Postagem = sequelize.define('Postagem', {
    id_postagem: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_autor: { type: DataTypes.INTEGER, allowNull: false },
    id_categoria: DataTypes.INTEGER,
    id_tag: DataTypes.INTEGER,
    tipo_postagem: { type: DataTypes.ENUM('text', 'photo', 'video', 'article'), allowNull: false },
    conteudo: DataTypes.TEXT,
    url_midia: DataTypes.STRING(500),
    tipo_midia: DataTypes.STRING(50),
    titulo: DataTypes.STRING(200),
    resumo: DataTypes.TEXT,
    artigo_cientifico: { type: DataTypes.BOOLEAN, defaultValue: false },
    visualizacoes: { type: DataTypes.INTEGER, defaultValue: 0 },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_atualizacao: DataTypes.DATE,
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    privacidade: { type: DataTypes.ENUM('public', 'friends', 'private'), defaultValue: 'public' },
    latitude: DataTypes.DECIMAL(10,7),
    longitude: DataTypes.DECIMAL(10,7)
  }, {
    tableName: 'postagens',
    timestamps: false
  });

  Postagem.associate = models => {
    Postagem.belongsTo(models.Usuario, { as: 'autor', foreignKey: 'id_autor' });
    Postagem.belongsTo(models.Categoria, { as: 'categoria', foreignKey: 'id_categoria' });
    Postagem.belongsTo(models.Tag, { as: 'tag', foreignKey: 'id_tag' });
    Postagem.hasMany(models.Comentario, { as: 'comentarios', foreignKey: 'id_postagem' });
    Postagem.hasMany(models.Curtida, { as: 'curtidas', foreignKey: 'id_postagem' });
    Postagem.hasMany(models.Compartilhamento, { as: 'compartilhamentos', foreignKey: 'id_postagem' });
    Postagem.hasMany(models.PostagemSecao, { as: 'postagensSecao', foreignKey: 'id_postagem' });
  };

  return Postagem;
};