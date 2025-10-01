const errorHandler = (err, req, res, next) => {
  // Determina o status do erro
  const status = err.status || 500;
  
  // Em produção, não enviamos detalhes do erro
  const error = {
    status: status,
    message: process.env.NODE_ENV === 'production' 
      ? 'Ocorreu um erro inesperado.' 
      : err.message
  };

  // Log do erro apenas em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Renderiza a página de erro
  res.status(status);
  res.render('error', { 
    error,
    title: 'Erro',
    user: req.user
  });
};

module.exports = errorHandler;
