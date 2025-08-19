module.exports = (sequelize, DataTypes) => {
  const TagTraducao = sequelize.define('TagTraducao', {
    id_tag: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    codigo_idioma: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    nome_tag: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao_tag: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'tags_traducao',
    timestamps: false
  });

  TagTraducao.associate = (models) => {
    TagTraducao.belongsTo(models.Tag, {
      foreignKey: 'id_tag',
      as: 'tag'
    });
    TagTraducao.belongsTo(models.Idioma, {
      foreignKey: 'codigo_idioma',
      as: 'idioma'
    });
  };

  return TagTraducao;
};