module.exports = (sequelize, DataTypes) => {
  const SecaoTraducao = sequelize.define('SecaoTraducao', {
    id_secao: { type: DataTypes.INTEGER, primaryKey: true },
    codigo_idioma: { type: DataTypes.STRING(10), primaryKey: true },
    nome_secao: DataTypes.STRING(100),
    descricao_secao: DataTypes.TEXT
  }, {
    tableName: 'secoes_traducao',
    timestamps: false
  });

  SecaoTraducao.associate = models => {
    SecaoTraducao.belongsTo(models.Secao, { as: 'secao', foreignKey: 'id_secao' });
    SecaoTraducao.belongsTo(models.Idioma, { as: 'idioma', foreignKey: 'codigo_idioma' });
  };

  return SecaoTraducao;
};