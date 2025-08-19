module.exports = (sequelize, DataTypes) => {
  const Postagem = sequelize.define('Postagem', {
    id_postagem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_autor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_categoria: {
      type: DataTypes.INTEGER
    },
    tipo_postagem: {
      type: DataTypes.ENUM('text', 'photo', 'video', 'article'),
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT
    },
    url_midia: {
      type: DataTypes.STRING(500)
    },
    tipo_midia: {
      type: DataTypes.STRING(50)
    },
    artigo_cientifico: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    visualizacoes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    },
    privacidade: {
      type: DataTypes.ENUM('public', 'friends', 'private'),
      defaultValue: 'public'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7)
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7)
    }
  }, {
    tableName: 'postagens',
    timestamps: false
  });

  Postagem.associate = (models) => {
    Postagem.belongsTo(models.Usuario, {
      foreignKey: 'id_autor',
      as: 'autor'
    });
    Postagem.belongsTo(models.Categoria, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });
    Postagem.hasMany(models.Comentario, {
      foreignKey: 'id_postagem',
      as: 'comentarios'
    });
    Postagem.hasMany(models.Curtida, {
      foreignKey: 'id_postagem',
      as: 'curtidas'
    });
    Postagem.hasMany(models.Compartilhamento, {
      foreignKey: 'id_postagem',
      as: 'compartilhamentos'
    });
    Postagem.hasMany(models.PostagemTag, {
      foreignKey: 'id_postagem',
      as: 'tags'
    });
    Postagem.hasMany(models.PostagemSecao, {
      foreignKey: 'id_postagem',
      as: 'secoes'
    });
  };
  
  return Postagem;
};