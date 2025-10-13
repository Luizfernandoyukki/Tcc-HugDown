// Evita duplicidade de declaração no navegador
if (typeof window !== 'undefined') {
  if (window._blokdepalavroesLoaded) {
    // Já carregado, não executa novamente
    window._blokdepalavroesSkip = true;
  } else {
    window._blokdepalavroesLoaded = true;
    window._blokdepalavroesSkip = false;
    console.log('[blokdepalavroes.js] Iniciando carregamento do filtro de palavrões...');
  }
}

// Só executa o resto do código se não estiver pulando (no navegador)
if (typeof window === 'undefined' || !window._blokdepalavroesSkip) {
  // Lista extensiva de palavras ofensivas em português
  const palavrasBase = [
    // ========== PALAVRÕES E OFENSAS GRAVES ==========
    'caralho', 'porra', 'merda', 'bosta', 'cocô', 'cagar', 'foder', 'fodido',
    'foda', 'cu', 'buceta', 'xoxota', 'pau', 'rola', 'pica', 'piroca', 'pinto',
    'punheta', 'masturbar', 'orgia', 'anal', 'oral', 'vaginal', 'cuzão', 
    'cusão', 'cusinho', 'bucetão', 'xota', 'piru', 'gozar', 'gozada', 'porra',
    'cacetada', 'cacetão', 'caralhada', 'caralhinho', 'caralhões', 'pirocada',
    'pirocona', 'roluda', 'roludão', 'pausudo', 'pentelhada', 'pentelho',
    
    // ========== OFENSAS PESSOAIS GRAVES ==========
    'filho da puta', 'fdp', 'arrombado', 'desgraçado', 'vadia', 'piranha', 
    'puta', 'prostituta', 'vagabunda', 'cachorra', 'biscate', 'meretriz',
    'corna', 'corno', 'cornudo', 'filho de uma égua', 'filho da mãe',
    'mãe é puta', 'sua mãe', 'tua mãe', 'mãe dele', 'mãe dela', 'mãe da puta',
    'pariu uma égua', 'pariu um burro', 'retardado', 'debil mental',
    
    // ========== TERMOS PEJORATIVOS GRAVES ==========
    'escória', 'lixoso', 'asqueroso', 'degenerado', 'pervertido', 'tarado',
    'depravado', 'desprezível', 'abjeto', 'repulsivo', 'nojento', 'repugnante',
    'imbecil', 'idiota', 'estúpido', 'burro', 'animal', 'bestão', 'ignorante',
    'incapaz', 'inútil', 'imprestável', 'merdinha', 'lixão humano',
    
    // ========== OFENSAS DISCRIMINATÓRIAS GRAVES ==========
    'veado', 'bicha', 'sapatão', 'traveco', 'travesti', 'quenga', 'mulata',
    'viado', 'baitola', 'fresco', 'boiola', 'sapatão', 'sapatao', 'sapatão',
    'traveco', 'travequinho', 'travecão',
    
    // ========== PALAVRÕES EM INGLÊS ==========
    'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'motherfucker', 'dick',
    'pussy', 'cunt', 'whore', 'slut', 'fag', 'faggot', 'cock', 'wanker', 'twat',
    'bullshit', 'damn', 'hell', 'piss', 'piss off', 'son of a bitch', 'dickhead',
    'ass', 'smartass', 'dumbass', 'jackass',
    
    // ========== PALAVRÕES EM ESPANHOL ==========
    'puta', 'mierda', 'coño', 'carajo', 'joder', 'maricón', 'puto', 'zorra',
    'verga', 'picha', 'culero', 'cabrón', 'gilipollas', 'hijo de puta',
    'madre mía', 'hostia', 'jodido', 'concha', 'pendejo', 'boludo',
    
    // ========== ABREVIAÇÕES OFENSIVAS ==========
    'vtmnc', 'vtnc', 'pqp', 'fdps', 'cpg', 'vsf', 'vsfd', 'fdc', 'tnc',
    'vai se fuder', 'vai tomar no cu', 'vai se foder', 'vai tomar no seu cu',
    'vai pra puta que pariu', 'vai pra pqp', 'vtnc', 'vsfd', 'vsf',
    'foda-se', 'fodase', 'foda se', 'que se foda', 'quese foda',
    
    // ========== OFENSAS RELIGIOSAS GRAVES ==========
    'satânico', 'demoníaco', 'herege', 'deus do caralho', 'jesus do caralho',
    'bíblia do caralho', 'allah do caralho', 'deus é mais', 'jesus amado',
    'virgem santa', 'santa virgem', 'puta que pariu', 'pqp',
    
    // ========== VARIANTES DISFARÇADAS ==========
    'c*ralho', 'p*rra', 'm*rda', 'b*sta', 'c*', 'b*ceta', 'p*u', 'r*la',
    'p*ca', 'p*nto', 'p*nheta', 'f*der', 'f*dido', 'arr*bado', 'desgr*çado',
    'c4r4lh0', 'p0rr4', 'm3rd4', 'b0st4', 'f0d4', 'f0d3r', '4rr0mb4d0',
    'car@lho', 'p@rr@', 'm@rd@', 'b@st@', 'f@der',
    
    // ========== OFENSAS VIOLENTAS ==========
    'estuprador', 'abusador', 'pedófilo', 'estuprar', 'violar', 'abusar', 'molestar',
    'assassino', 'matar', 'morrer', 'se mata', 'se matar', 'suicídio', 'suicida',
    'bater', 'espancar', 'agredir', 'violência', 'ameaçar', 'amarrar', 'sequestrar',
    
    // ========== OFENSAS RACIAIS E XENÓFOBAS ==========
    'macaco', 'preto noia', 'negão burro', 'judeu ladrão', 'árabe terrorista',
    'japa', 'china', 'alemão nazista', 'português burro', 'baiano preguiçoso',
    'paulista metido', 'carioca malandro', 'mineiro mão de vaca',
    
    // ========== OFENSAS SEXUAIS EXPLÍCITAS ==========
    'chupar', 'mamar', 'chupada', 'mamada', 'meter', 'comer o cu', 'dar o cu',
    'dar o rabo', 'dar a bunda', 'dar a xota', 'transar', 'trepar', 'foder',
    'sexo oral', 'boquete', 'punhetão', 'punhetinha', 'gozada', 'porrada',
    
    // ========== TERMOS DE ÓDIO E INTOLERÂNCIA ==========
    'odeio você', 'te odeio', 'odeio gente', 'odeio mulher', 'odeio homem',
    'odeio gay', 'odeio negro', 'odeio judeu', 'morte aos', 'morram todos',
    'espero que morra', 'quero que morra', 'vai morrer', 'vai se foder',
    
    // ========== OFENSAS CORPORAIS ==========
    'gordo nojento', 'gorda fedida', 'magrelo', 'feio pra caralho', 'fedorento',
    'bafo de onça', 'cara de cavalo', 'orelha de abano', 'nariz de palhaço',
    'boca de siri', 'perna de pau', 'olho torto', 'careca', 'calvo', 'barrigudo'
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

  // Função para gerar variações simples e limitar quantidade
  function gerarVariaçõesSimplesLimitada(palavra) {
    if (!palavra || palavra.length < 4) return [];
    const semAcento = palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const inicioAsterisco = '*' + palavra;
    const fimAsterisco = palavra + '*';
    return [
      palavra,
      semAcento,
      inicioAsterisco,
      fimAsterisco
    ];
  }

  // Sistema de detecção otimizado (limitado)
  function criarExpressoesOfensivas() {
    console.log('[blokdepalavroes.js] Gerando expressões ofensivas (limitado)...');
    let todasPalavras = [];
    palavrasBase.forEach(palavra => {
      if (!palavra || palavra.length < 4) return;
      todasPalavras = todasPalavras.concat(gerarVariaçõesSimplesLimitada(palavra));
    });
    // Remove duplicatas e ordena por tamanho
    return [...new Set(todasPalavras)].sort((a, b) => b.length - a.length);
  }

  // Gera lista final otimizada
  let palavrasOfensivas = [];
  let bloqueioAtivo = false;

  // Gera lista em background (não trava a UI)
  function gerarPalavrasOfensivasAssincrono(callback) {
    console.log('[blokdepalavroes.js] Iniciando geração assíncrona de palavras ofensivas...');
    setTimeout(() => {
      palavrasOfensivas = criarExpressoesOfensivas();
      bloqueioAtivo = true;
      console.log('[blokdepalavroes.js] Palavras ofensivas geradas:', palavrasOfensivas.length);
      if (typeof callback === 'function') callback();
    }, 0);
  }

  // Sistema de detecção melhorada
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
    const valorOriginal = elemento.value !== undefined ? elemento.value : elemento.textContent;
    const valor = valorOriginal.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let conteudoModificado = valorOriginal;
    
    // Substitui cada palavra ofensiva por ***
    palavrasOfensivas.forEach(palavra => {
      const padrao = palavra.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (padrao.length < 2) return;
      // Regex para detectar a palavra (sem limites de palavra, para pegar no meio)
      const regex = new RegExp(padrao.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      conteudoModificado = conteudoModificado.replace(regex, '***');
    });

    // Atualiza o campo sem alert
    if (elemento.value !== undefined) {
      elemento.value = conteudoModificado;
    } else {
      elemento.textContent = conteudoModificado;
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
      ;
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

      // Sempre reativa o filtro ao mudar de tela (SPA ou navegação AJAX)
      window.addEventListener('pageshow', function() {
        gerarPalavrasOfensivasAssincrono(function() {
          bloquearPalavrasOfensivas();
        });
      });
    });
  }

  // Exporta para Node.js apenas se NÃO estiver no navegador
  if (typeof window === 'undefined' && typeof module !== 'undefined' && module.exports) {
    console.log('[blokdepalavroes.js] Executando bloco Node.js de exportação...');
    palavrasOfensivas = criarExpressoesOfensivas();
    bloqueioAtivo = true;
    console.log('[blokdepalavroes.js] Palavras ofensivas geradas para Node.js:', palavrasOfensivas.length);
    module.exports = {
      palavrasOfensivas,
      bloquearPalavrasOfensivas,
      verificarConteudoOfensivo,
      gerarPalavrasOfensivasAssincrono,
      criarExpressoesOfensivas
    };
    console.log('[blokdepalavroes.js] Exportação concluída para Node.js');
    // NÃO coloque return aqui!
  }
}