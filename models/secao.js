module.exports = (sequelize, DataTypes) => {
  const Secao = sequelize.define('Secao', {
    id_secao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_secao: { type: DataTypes.STRING(100), allowNull: false },
    descricao_secao: DataTypes.TEXT,
    icone_secao: DataTypes.STRING(50),
    ordem_exibicao: { type: DataTypes.INTEGER, defaultValue: 0 },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    id_grupo: { type: DataTypes.INTEGER, allowNull: true } // NOVO: seção pode pertencer a um grupo
  }, {
    tableName: 'secoes',
    timestamps: false
  });

  Secao.associate = models => {
    Secao.hasMany(models.SecaoTraducao, { as: 'traducoes', foreignKey: 'id_secao' });
    Secao.hasMany(models.PostagemSecao, { as: 'postagensSecao', foreignKey: 'id_secao' });
    Secao.belongsTo(models.Grupo, { as: 'grupo', foreignKey: 'id_grupo' }); // NOVO
  };

  return Secao;
};