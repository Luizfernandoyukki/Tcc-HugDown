const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/auth');
const controllers = require('../controllers/index.js');
const { postagemController, categoriaController, tagController } = controllers;
const zlib = require('zlib');

// Função utilitária para converter lat/lng em endereço (estado, país)
async function getLocationFromLatLng(lat, lng) {
  if (!lat || !lng) return '';
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { timeout: 3000 }); // timeout de 3s
    const data = await res.json();
    const estado = data.address?.state || '';
    const pais = data.address?.country || '';
    return [estado, pais].filter(Boolean).join(', ');
  } catch (err) {
    // Se falhar, retorna valor padrão
    return 'Localização indisponível';
  }
}

// Cache simples em memória (com dados comprimidos)
const feedCache = {
  compressed: null,
  posts: [],
  timestamp: 0
};
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutos
const PAGE_SIZE = 20;

// Função para atualizar o cache
async function updateFeedCache() {
  let posts = await postagemController.listar({}, { raw: true });
  // Ordena por data_criacao decrescente
  posts = posts.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
  // Limita a 20 postagens mais recentes
  posts = posts.slice(0, PAGE_SIZE);
  // Adiciona campo endereco em cada post
  for (const post of posts) {
    if (post.latitude && post.longitude) {
      post.endereco = await getLocationFromLatLng(post.latitude, post.longitude);
    } else {
      post.endereco = '';
    }
  }
  feedCache.posts = posts;
  feedCache.timestamp = Date.now();
  // Comprime os dados do cache
  feedCache.compressed = zlib.gzipSync(JSON.stringify(posts));
}

// --- NOVO: Atualização automática do cache a cada 1 minuto ---
setInterval(async () => {
  try {
    await updateFeedCache();
    // Opcional: console.log('[FeedCache] Atualizado automaticamente');
  } catch (err) {
    console.error('[FeedCache] Erro ao atualizar cache:', err);
  }
}, 60 * 1000); // 1 minuto

// Página do feed protegida (com filtro por categoria/tag)
router.get('/', requireLogin, async (req, res) => {
  const { categoria, tag } = req.query;
  let posts;

  if (categoria && tag) {
    posts = await postagemController.listarPorCategoriaETag(req, { id_categoria: categoria, id_tag: tag, raw: true });
  } else if (categoria) {
    posts = await postagemController.listarPorCategoria(req, { id_categoria: categoria, raw: true });
  } else if (tag) {
    posts = await postagemController.listarPorTag(req, { id_tag: tag, raw: true });
  } else {
    // Usa cache apenas se não houver filtro
    if (!feedCache.posts.length || Date.now() - feedCache.timestamp > CACHE_DURATION_MS) {
      await updateFeedCache();
    }
    posts = feedCache.posts;
  }

  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });

  res.render('feed', {
    categorias: categorias.slice(0, 4),
    todasCategorias: categorias,
    tags,
    usuario: req.session.userId ? req.session.usuario : null,
    posts
  });
});

// API para carregar mais postagens (scroll infinito/paginação) - envia comprimido
router.get('/api/feed', requireLogin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;

  if (!feedCache.posts.length || Date.now() - feedCache.timestamp > CACHE_DURATION_MS) {
    await updateFeedCache();
  }
  const posts = feedCache.posts.slice(startIdx, endIdx);
  const compressed = zlib.gzipSync(JSON.stringify(posts));
  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Content-Type', 'application/json');
  res.send(compressed);
});

module.exports = router;
