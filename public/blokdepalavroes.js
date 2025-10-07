// Lista extensiva de palavras ofensivas em português
const palavrasBase = [
  // ========== PALAVRÕES E OFENSAS GRAVES ==========
  'caralho', 'porra', 'merda', 'bosta', 'cocô', 'cagar', 'foder', 'fodido',
  'foda', 'cu', 'buceta', 'xoxota', 'pau', 'rola', 'pica', 'piroca', 'pinto',
  'punheta', 'masturbar', 'orgia', 'anal', 'oral', 'vaginal', 'cuzão', 
  'cusão', 'cusinho', 'bucetão', 'xota', 'piru', 'gozar', 'gozada',
  
  // ========== OFENSAS PESSOAIS GRAVES ==========
  'filho da puta', 'fdp', 'arrombado', 'desgraçado', 'vadia', 'piranha', 
  'puta', 'prostituta', 'vagabunda', 'cachorra', 'biscate', 'meretriz',
  'corna', 'corno', 'cornudo', 'filho de uma égua',
  
  // ========== TERMOS PEJORATIVOS GRAVES ==========
  'escória', 'lixoso', 'asqueroso', 'degenerado', 'pervertido', 'tarado',
  'depravado', 'desprezível', 'abjeto', 'repulsivo', 'nojento', 'repugnante',
  
  // ========== OFENSAS DISCRIMINATÓRIAS GRAVES ==========
  'veado', 'bicha', 'sapatão', 'traveco', 'travesti', 'quenga', 'mulata',
  
  // ========== PALAVRÕES EM INGLÊS ==========
  'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'motherfucker', 'dick',
  'pussy', 'cunt', 'whore', 'slut', 'fag', 'faggot', 'cock', 'wanker', 'twat',
  
  // ========== PALAVRÕES EM ESPANHOL ==========
  'puta', 'mierda', 'coño', 'carajo', 'joder', 'maricón', 'puto', 'zorra',
  'verga', 'picha', 'culero',
  
  // ========== ABREVIAÇÕES OFENSIVAS ==========
  'vtmnc', 'vtnc', 'pqp', 'fdps', 'cpg', 'vsf', 'vsfd', 'fdc', 'tnc',
  'vai se fuder', 'vai tomar no cu', 'vai se foder', 'vai tomar no seu cu',
  'vai pra puta que pariu',
  
  // ========== OFENSAS RELIGIOSAS GRAVES ==========
  'satânico', 'demoníaco', 'herege', 'deus do caralho', 'jesus do caralho',
  'bíblia do caralho', 'allah do caralho',
  
  // ========== VARIANTES DISFARÇADAS ==========
  'c*ralho', 'p*rra', 'm*rda', 'b*sta', 'c*', 'b*ceta', 'p*u', 'r*la',
  'p*ca', 'p*nto', 'p*nheta', 'f*der', 'f*dido', 'arr*bado', 'desgr*çado',
  
  // ========== OFENSAS VIOLENTAS ==========
  'estuprador', 'abusador', 'pedófilo', 'estuprar', 'violar', 'abusar', 'molestar'
];

// Mapa de substituições comuns para disfarçar palavrões
const substituicoes = [
  ['a', ['@', '4']],
  ['e', ['3']],
  ['i', ['1', '!']],
  ['o', ['0']],
  ['u', ['v']],
  ['s', ['$', '5']],
  ['t', ['7']],
  ['p', ['ph']],
  // Adicione mais se quiser
];

// Função para gerar variações com substituições
function gerarVariaçõesComSimbolos(palavra) {
  if (!palavra || palavra.length < 4) return [];
  let variacoes = new Set();
  variacoes.add(palavra);

  // Gera variações trocando cada letra por símbolo
  function gerarRecursivo(str, idx) {
    if (idx >= str.length) {
      variacoes.add(str);
      return;
    }
    let letra = str[idx].toLowerCase();
    let subs = substituicoes.find(([l]) => l === letra);
    if (subs) {
      for (const s of subs[1]) {
        gerarRecursivo(str.slice(0, idx) + s + str.slice(idx + 1), idx + 1);
      }
    }
    gerarRecursivo(str, idx + 1);
  }
  gerarRecursivo(palavra, 0);

  // Adiciona variações com asteriscos, início/fim, etc
  variacoes.add(palavra.split('').join('*'));
  variacoes.add('*' + palavra);
  variacoes.add(palavra + '*');
  variacoes.add('*' + palavra + '*');

  // Adiciona variações com símbolos no final (ex: put$, put@)
  if (palavra.length > 3) {
    variacoes.add(palavra.slice(0, -1) + '$');
    variacoes.add(palavra.slice(0, -1) + '@');
    variacoes.add(palavra.slice(0, -1) + '!');
    variacoes.add(palavra.slice(0, -1) + '1');
    variacoes.add(palavra.slice(0, -1) + '3');
    variacoes.add(palavra.slice(0, -1) + '4');
    variacoes.add(palavra.slice(0, -1) + '0');
  }

  return Array.from(variacoes);
}

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
    todasPalavras = todasPalavras.concat(gerarVariaçõesComSimbolos(palavra));
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

// --- ADICIONE ESTE BLOCO PARA NODE.JS ---
if (typeof module !== 'undefined' && module.exports) {
  // Gera a lista imediatamente para uso no backend
  palavrasOfensivas = criarExpressoesOfensivas();
  bloqueioAtivo = true;
  module.exports = {
    palavrasOfensivas,
    bloquearPalavrasOfensivas,
    verificarConteudoOfensivo,
    gerarPalavrasOfensivasAssincrono,
    criarExpressoesOfensivas
  };
  // Não execute o código do navegador!
  return;
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

// Inicialização para frontend (navegador)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Permite desativar o filtro globalmente
  if (window.bloquearPalavroes === false) {
    // Não ativa o bloqueio de palavrões nesta página
    return;
  }
  document.addEventListener('DOMContentLoaded', function() {
    gerarPalavrasOfensivasAssincrono(function() {
      bloquearPalavrasOfensivas();
    });

    // Adiciona também para elementos dinâmicos (inclusive campos de comentários)
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            // Aplica filtro em todos os inputs/textareas dentro do nó adicionado
            const campos = node.querySelectorAll
              ? node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]')
              : [];
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
            // Se o próprio nó for um campo de texto, aplica também
            if (
              node.matches &&
              (node.matches('input[type="text"]') || node.matches('textarea') || node.matches('[contenteditable="true"]'))
            ) {
              node.addEventListener('input', function() {
                if (bloqueioAtivo) verificarConteudoOfensivo(this);
              });
              node.addEventListener('paste', function(e) {
                setTimeout(() => {
                  if (bloqueioAtivo) verificarConteudoOfensivo(this);
                }, 10);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Exporta para uso em outros módulos (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    palavrasOfensivas,
    bloquearPalavrasOfensivas,
    verificarConteudoOfensivo,
    gerarPalavrasOfensivasAssincrono,
    criarExpressoesOfensivas
  };
}