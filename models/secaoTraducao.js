module.exports = (sequelize, DataTypes) => {
  const SecaoTraducao = sequelize.define('SecaoTraducao', {
    id_secao: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    codigo_idioma: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    nome_secao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao_secao: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'secoes_traducao',
    timestamps: false
  });

  SecaoTraducao.associate = (models) => {
    SecaoTraducao.belongsTo(models.Secao, {
      foreignKey: 'id_secao',
      as: 'secao'
    });
    SecaoTraducao.belongsTo(models.Idioma, {
      foreignKey: 'codigo_idioma',
      as: 'idioma'
    });
  };
  return SecaoTraducao;
};