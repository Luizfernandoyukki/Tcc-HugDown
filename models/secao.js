module.exports = (sequelize, DataTypes) => {
  const Secao = sequelize.define('Secao', {
    id_secao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_secao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao_secao: {
      type: DataTypes.TEXT
    },
    icone_secao: {
      type: DataTypes.STRING(50)
    },
    ordem_exibicao: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'secoes',
    timestamps: false
  });

  Secao.associate = (models) => {
    Secao.hasMany(models.PostagemSecao, {
      foreignKey: 'id_secao',
      as: 'postagensSecao'
    });
    Secao.hasMany(models.SecaoTraducao, {
      foreignKey: 'id_secao',
      as: 'traducoes'
    });
  };

  
  return Secao;
};