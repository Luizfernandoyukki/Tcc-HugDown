// Lista extensiva de palavras ofensivas em português
const palavrasBase = [
  // Palavras ofensivas básicas
  'idiota', 'burro', 'otário', 'babaca', 'imbecil', 'estúpido', 'cretino', 
  'tonto', 'besta', 'asno', 'palhaço', 'panaca', 'trouxa', 'mané', 'tapado', 
  'nojento', 'ridículo', 'moleque', 'vagabundo', 'canalha', 'pateta', 'animal', 
  'ignorante', 'jumento', 'burrice', 'imbecilidade', 'estupidez', 'cretinice',
  
  // Ofensas mais graves
  'filho da puta', 'fdp', 'arrombado', 'desgraçado', 'maldito', 'demonio', 
  'diabo', 'corno', 'cornudo', 'puta', 'prostituta', 'vadia', 'piranha', 
  'vagabunda', 'cachorra', 'galinha', 'biscate', 'meretriz', 'desprezível',
  
  // Termos pejorativos
  'lixo', 'escória', 'lixoso', 'nojento', 'repugnante', 'asqueroso', 
  'nojento', 'fedorento', 'porco', 'sujo', 'imundo', 'degenerado', 
  'pervertido', 'doente', 'louco', 'doido', 'maluco', 'retardado',
  
  // Ofensas raciais e discriminatórias
  'preto burro', 'negro sujo', 'macaco', 'crioulo', 'judeu avarento', 
  'árabe sujo', 'japa', 'china', 'baiano', 'paraíba', 'nordestino burro',
  'gay', 'veado', 'bicha', 'sapatão', 'sapatão', 'traveco', 'transgenero',
  
  // Palavras de baixo calão
  'caralho', 'porra', 'merda', 'bosta', 'cocô', 'cagar', 'foder', 'fodido',
  'cu', 'buceta', 'xoxota', 'pau', 'rola', 'pica', 'piroca', 'pinto',
  'punheta', 'masturbar', 'orgia', 'sexo', 'anal', 'oral', 'vaginal',
  
  // Insultos relacionados à aparência
  'feio', 'horrível', 'monstro', 'deformado', 'gordo', 'obeso', 'baleia',
  'magrelo', 'ossudo', 'anão', 'baixinho', 'alto demais', 'careca', 
  'calvo', 'cabelo ruim', 'dentuço', 'orelhudo', 'narigudo',
  
  // Ofensas à inteligência e capacidade
  'burro pra caralho', 'analfabeto', 'ignorante', 'limitado', 'incapaz',
  'incompetente', 'impotente', 'fracassado', 'perdedor', 'inútil', 
  'imprestável', 'medíocre', 'péssimo', 'horrível',
  
  // Termos violentos e agressivos
  'matar', 'morrer', 'assassinar', 'esfaquear', 'espancar', 'bater', 
  'agredir', 'estuprador', 'abusador', 'pedófilo', 'sequestrador',
  'bandido', 'marginal', 'criminoso', 'ladrão', 'assaltante',
  
  // Gírias ofensivas regionais
  'otário', 'tanso', 'xarope', 'bocó', 'tapado', 'lesado', 'grosso',
  'grosseria', 'mal-educado', 'malcriado', 'sem-vergonha', 'safado',
  
  // Ofensas em inglês (comuns na internet)
  'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'motherfucker', 'dick',
  'pussy', 'cunt', 'whore', 'slut', 'retard', 'nigger', 'fag', 'faggot',
  
  // Palavras ofensivas em espanhol
  'pendejo', 'cabrón', 'puta', 'mierda', 'estúpido', 'idiota', 'gilipollas',
  
  // Abreviações e termos de internet
  'vtmnc', 'vtnc', 'pqp', 'fdps', 'cpg', 'vsf', 'vai se fuder', 'vai tomar no cu',
  
  // Ofensas religiosas
  'satânico', 'demoníaco', 'herege', 'ateu do caralho', 'deus do caralho',
  'jesus do caralho', 'bíblia do caralho'
];

// Gera variações simples: original, com asteriscos entre letras, com asteriscos no início/fim
function gerarVariaçõesSimples(palavra) {
  if (!palavra || palavra.length < 4) return [];
  const semAcento = palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const entreAsteriscos = palavra.split('').join('*');
  const inicioAsterisco = '*' + palavra;
  const fimAsterisco = palavra + '*';
  const ambosAsterisco = '*' + palavra + '*';
  return [
    palavra,
    semAcento,
    entreAsteriscos,
    inicioAsterisco,
    fimAsterisco,
    ambosAsterisco
  ];
}

// Sistema de detecção otimizado
function criarExpressoesOfensivas() {
  let todasPalavras = [];
  palavrasBase.forEach(palavra => {
    if (!palavra || palavra.length < 4) return;
    todasPalavras = todasPalavras.concat(gerarVariaçõesSimples(palavra));
  });
  // Remove duplicatas e ordena por tamanho
  return [...new Set(todasPalavras)].sort((a, b) => b.length - a.length);
}

// Gera lista final otimizada
let palavrasOfensivas = [];
let bloqueioAtivo = false;

// Gera lista em background (não trava a UI)
function gerarPalavrasOfensivasAssincrono(callback) {
  setTimeout(() => {
    palavrasOfensivas = criarExpressoesOfensivas();
    bloqueioAtivo = true;
    if (typeof callback === 'function') callback();
  }, 0);
}

// Sistema de detecção melhorado
function bloquearPalavrasOfensivas(camposSelector = 'input[type="text"], textarea, [contenteditable="true"]') {
  const campos = document.querySelectorAll(camposSelector);

  campos.forEach(campo => {
    campo.addEventListener('input', function() {
      if (bloqueioAtivo) verificarConteudoOfensivo(this);
    });
    campo.addEventListener('paste', function(e) {
      setTimeout(() => {
        if (bloqueioAtivo) verificarConteudoOfensivo(this);
      }, 10);
    });
  });
}

function verificarConteudoOfensivo(elemento) {
  if (!bloqueioAtivo) return; // Só bloqueia se a lista estiver pronta
  const valorOriginal = elemento.value || elemento.textContent;
  const valor = valorOriginal.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  let conteudoModificado = valorOriginal;
  let ofensasEncontradas = [];
  
  // Verifica cada palavra ofensiva
  palavrasOfensivas.forEach(palavra => {
    const padrao = palavra.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (padrao.length < 2) return;
    
    // Regex para detectar a palavra (considerando limites de palavra)
    const regex = new RegExp(`\\b${padrao.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    
    if (regex.test(valor)) {
      ofensasEncontradas.push(palavra);
      // Substitui por asteriscos
      const regexSubstituicao = new RegExp(padrao, 'gi');
      conteudoModificado = conteudoModificado.replace(regexSubstituicao, '***');
    }
  });
  
  // Se encontrou ofensas, atualiza o campo e mostra alerta
  if (ofensasEncontradas.length > 0) {
    if (elemento.value !== undefined) {
      elemento.value = conteudoModificado;
    } else {
      elemento.textContent = conteudoModificado;
    }
    
    // Sistema de alerta melhorado
    if (ofensasEncontradas.length <= 3) {
      alert(`Atenção: Linguagem ofensiva detectada! Palavras bloqueadas: ${ofensasEncontradas.join(', ')}`);
    } else {
      alert('Atenção: Múltiplas palavras ofensivas detectadas! Conteúdo bloqueado.');
    }
    
    // Foca no campo novamente
    elemento.focus();
  }
}

// Sistema de logging para moderadores
function logOfensasDetectadas(texto, ofensas) {
  if (typeof console !== 'undefined') {
    console.warn('Conteúdo ofensivo detectado:', {
      textoOriginal: texto,
      ofensas: ofensas,
      timestamp: new Date().toISOString(),
      usuario: 'anonimo' // Em sistema real, pegaria do usuário logado
    });
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  gerarPalavrasOfensivasAssincrono(function() {
    bloquearPalavrasOfensivas();
  });

  // Adiciona também para elementos dinâmicos
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          const campos = node.querySelectorAll ? node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]') : [];
          campos.forEach(campo => {
            campo.addEventListener('input', function() {
              if (bloqueioAtivo) verificarConteudoOfensivo(this);
            });
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Exporta para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    palavrasOfensivas,
    bloquearPalavrasOfensivas,
    verificarConteudoOfensivo
  };
}