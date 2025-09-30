const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/auth');
const controllers = require('../controllers/index.js');
const { postagemController, categoriaController, tagController } = controllers;

// Função utilitária para converter lat/lng em endereço (estado, país)
async function getLocationFromLatLng(lat, lng) {
  if (!lat || !lng) return '';
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const data = await res.json();
  const estado = data.address?.state || '';
  const pais = data.address?.country || '';
  return [estado, pais].filter(Boolean).join(', ');
}

// Página do feed protegida
router.get('/', requireLogin, async (req, res) => {
  // Busca categorias (limitadas a 4), todas as tags, e postagens
  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });
  let posts = await postagemController.listar(req, { raw: true });

  // Adiciona campo endereco em cada post
  for (const post of posts) {
    if (post.latitude && post.longitude) {
      post.endereco = await getLocationFromLatLng(post.latitude, post.longitude);
    } else {
      post.endereco = '';
    }
  }

  res.render('feed', {
    categorias: categorias.slice(0, 4),
    todasCategorias: categorias,
    tags,
    usuario: req.session.userId ? req.session.usuario : null,
    posts
  });
});

module.exports = router;
