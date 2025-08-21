const { DocumentoVerificacao, Usuario, Administrador } = require('../models');

// Listar todos os documentos de verificação
exports.listar = async () => {
  try {
    const docs = await DocumentoVerificacao.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Administrador, as: 'adminVerificador' }
      ]
    });
    return docs;
  } catch (err) {
    throw new Error('Erro ao buscar documentos de verificação: ' + err.message);
  }
};

// Buscar documento por ID
exports.buscarPorId = async (id) => {
  try {
    const doc = await DocumentoVerificacao.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Administrador, as: 'adminVerificador' }
      ]
    });
    if (!doc) throw new Error('Documento não encontrado');
    return doc;
  } catch (err) {
    throw new Error('Erro ao buscar documento: ' + err.message);
  }
};

// Criar novo documento de verificação
exports.criar = async (dados) => {
  try {
    const novo = await DocumentoVerificacao.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar documento: ' + err.message);
  }
};

// Atualizar documento de verificação
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await DocumentoVerificacao.update(dados, {
      where: { id_documento: id }
    });
    if (!updated) throw new Error('Documento não encontrado');
    const docAtualizado = await DocumentoVerificacao.findByPk(id);
    return docAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar documento: ' + err.message);
  }
};

// Remover documento de verificação
exports.remover = async (id) => {
  try {
    const deleted = await DocumentoVerificacao.destroy({
      where: { id_documento: id }
    });
    if (!deleted) throw new Error('Documento não encontrado');
    return { message: 'Documento removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover documento: ' + err.message);
  }
};