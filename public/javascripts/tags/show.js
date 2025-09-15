document.addEventListener('DOMContentLoaded', function() {
  // Exibe os dados da tag na tela de visualização
  const tagData = window.tagData;
  if (tagData) {
    const tagInfo = document.getElementById('tag-info');
    if (tagInfo) {
      tagInfo.textContent = `Tag: ${tagData.nome_tag} | Descrição: ${tagData.descricao_tag || ''}`;
    }
  }
});