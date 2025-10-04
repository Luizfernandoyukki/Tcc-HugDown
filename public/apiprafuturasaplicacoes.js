// Express setup básico
const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

// --- API de Controle de Palavras Abusivas ---
app.post('/api/verificar-palavra', (req, res) => {
  const { texto } = req.body;
  // Exemplo: lógica simples, substitua por lógica real
  const palavrasOfensivas = ['exemplo1', 'exemplo2', 'exemplo3'];
  const encontrou = palavrasOfensivas.find(p => texto.toLowerCase().includes(p));
  res.json({ ofensivo: !!encontrou });
});

// --- API de Monitoramento de Reports ---
app.post('/api/reportar', (req, res) => {
  const { usuario, motivo, detalhes } = req.body;
  // Aqui você pode salvar o report em um banco de dados
  res.json({ status: 'Report recebido', usuario, motivo });
});

app.get('/api/reports', (req, res) => {
  // Exemplo: retorna lista fictícia de reports
  res.json([
    { usuario: 'user1', motivo: 'abuso', detalhes: '...' },
    { usuario: 'user2', motivo: 'spam', detalhes: '...' }
  ]);
});

// --- API de Verificação de Documentos ---
app.post('/api/verificar-documento', (req, res) => {
  const { documento, tipo } = req.body;
  // Exemplo: lógica fictícia, substitua por integração real
  if (documento && tipo) {
    res.json({ verificado: true, mensagem: 'Documento aparentemente válido (mock)' });
  } else {
    res.json({ verificado: false, mensagem: 'Dados insuficientes' });
  }
});

// --- API EXTERNA: Moderação de Conteúdo (Google Perspective API) ---
app.post('/api/moderar-texto', async (req, res) => {
  const { texto } = req.body;
  try {
    // Substitua 'YOUR_API_KEY' pela sua chave da Perspective API
    const response = await axios.post(
      'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=YOUR_API_KEY',
      {
        comment: { text: texto },
        languages: ['pt'],
        requestedAttributes: { TOXICITY: {} }
      }
    );
    const score = response.data.attributeScores.TOXICITY.summaryScore.value;
    res.json({ score, ofensivo: score > 0.7 });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar API externa', details: err.message });
  }
});

// --- API EXTERNA: Verificação de Documentos Médicos (Exemplo Fictício) ---
app.post('/api/verificar-crm', async (req, res) => {
  const { crm, uf } = req.body;
  try {
    // Exemplo fictício: substitua pela API real do conselho regional
    // Exemplo real: https://api.consultacrm.com.br/api/index.php?tipo=crm&uf=SP&q=123456
    const url = `https://api.consultacrm.com.br/api/index.php?tipo=crm&uf=${uf}&q=${crm}`;
    const response = await axios.get(url);
    // A resposta real pode variar, adapte conforme a documentação da API
    res.json({ resultado: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar CRM', details: err.message });
  }
});

// --- API EXTERNA: Monitoramento de Reports (Exemplo com Zendesk) ---
app.post('/api/reportar-externo', async (req, res) => {
  const { usuario, motivo, detalhes } = req.body;
  try {
    // Exemplo fictício: integração com Zendesk (ou outro sistema de tickets)
    // Substitua os dados abaixo pelos reais do seu serviço
    const response = await axios.post(
      'https://SEU_SUBDOMINIO.zendesk.com/api/v2/tickets.json',
      {
        ticket: {
          subject: `Report de ${usuario}: ${motivo}`,
          comment: { body: detalhes }
        }
      },
      {
        auth: {
          username: 'SEU_EMAIL/token',
          password: 'SEU_TOKEN'
        }
      }
    );
    res.json({ status: 'Report enviado ao sistema externo', ticket: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar report externo', details: err.message });
  }
});

// Inicialização do servidor (ajuste a porta conforme necessário)
app.listen(3001, () => {
  console.log('API base rodando na porta 3001');
});