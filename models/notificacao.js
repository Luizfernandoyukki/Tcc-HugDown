module.exports = (sequelize, DataTypes) => {
  const Notificacao = sequelize.define('Notificacao', {
    id_notificacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    tipo_notificacao: { 
      type: DataTypes.ENUM(
        'like', 'comment', 'share', 'friendship', 'message', 'event', 'system', 'group_invite', 'advertencia'
      ), 
      allowNull: false 
    },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    mensagem: DataTypes.TEXT,
    url_relacionada: DataTypes.STRING(500),
    lida: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    // Campos relacionais opcionais
    id_amizade: { type: DataTypes.INTEGER, allowNull: true },
    id_grupo: { type: DataTypes.INTEGER, allowNull: true },
    id_evento: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'notificacoes',
    timestamps: false
  });

  Notificacao.associate = models => {
    Notificacao.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
    // Adicione associações se quiser (opcional)
    // Notificacao.belongsTo(models.Amizade, { as: 'amizade', foreignKey: 'id_amizade' });
    // Notificacao.belongsTo(models.Grupo, { as: 'grupo', foreignKey: 'id_grupo' });
    // Notificacao.belongsTo(models.Evento, { as: 'evento', foreignKey: 'id_evento' });
  };

  return Notificacao;
};