module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define('Comentario', {
    id_comentario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postagem: { type: DataTypes.INTEGER, allowNull: false },
    id_autor: { type: DataTypes.INTEGER, allowNull: false },
    conteudo: { type: DataTypes.TEXT, allowNull: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_atualizacao: DataTypes.DATE,
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'comentarios',
    timestamps: false
  });

  Comentario.associate = models => {
    Comentario.belongsTo(models.Postagem, { as: 'postagem', foreignKey: 'id_postagem' });
    Comentario.belongsTo(models.Usuario, { as: 'autor', foreignKey: 'id_autor' });
  };

  return Comentario;
};