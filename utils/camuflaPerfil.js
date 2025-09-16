function gerarUrlPerfil(id) {
  // Gera dois números aleatórios grandes e coloca o id no meio
  const prefix = Math.floor(Math.random() * 1e6) + 1e5;
  const sufix = Math.floor(Math.random() * 1e6) + 1e5;
  return `/perfil/${prefix}_${id}_${sufix}`;
}

function extrairIdPerfil(urlParam) {
  // Espera formato: 123456_1_654321
  const partes = urlParam.split('_');
  if (partes.length === 3) {
    return partes[1];
  }
  return null;
}

module.exports = { gerarUrlPerfil, extrairIdPerfil };
