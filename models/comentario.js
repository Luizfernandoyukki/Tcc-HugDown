module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define('Comentario', {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_postagem: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_autor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_atualizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'comentarios',
    timestamps: false
  });

  Comentario.associate = (models) => {
    Comentario.belongsTo(models.Postagem, {
      foreignKey: 'id_postagem',
      as: 'postagem'
    });
    Comentario.belongsTo(models.Usuario, {
      foreignKey: 'id_autor',
      as: 'autor'
    });
  };

  return Comentario;
};