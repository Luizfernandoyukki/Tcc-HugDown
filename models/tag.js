module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id_tag: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_tag: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    descricao_tag: {
      type: DataTypes.TEXT
    },
    uso_contador: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'tags',
    timestamps: false
  });

  Tag.associate = (models) => {
    Tag.hasMany(models.PostagemTag, {
      foreignKey: 'id_tag',
      as: 'postagensTag'
    });
    Tag.hasMany(models.TagTraducao, {
      foreignKey: 'id_tag',
      as: 'traducoes'
    });
  };
  
  return Tag;
};