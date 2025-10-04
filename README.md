# APIs para Controle e Monitoramento

## APIs Disponíveis

- **/api/verificar-palavra**  
  Verifica se um texto contém palavras abusivas.
  - POST `{ texto: "mensagem a ser verificada" }`
  - Resposta: `{ ofensivo: true/false }`

- **/api/reportar**  
  Recebe reports de usuários.
  - POST `{ usuario: "nome", motivo: "motivo", detalhes: "detalhes" }`
  - Resposta: `{ status: "Report recebido", usuario, motivo }`

- **/api/reports**  
  Lista reports recebidos.
  - GET
  - Resposta: lista de reports

- **/api/verificar-documento**  
  Verifica a veracidade de documentos (exemplo fictício).
  - POST `{ documento: "dados", tipo: "crm/coren/etc" }`
  - Resposta: `{ verificado: true/false, mensagem: "..." }`

## Integrações Externas

- **/api/moderar-texto**  
  Usa a [Google Perspective API](https://www.perspectiveapi.com/) para analisar toxicidade de textos.
  - POST `{ texto: "mensagem" }`
  - Resposta: `{ score: 0.0-1.0, ofensivo: true/false }`
  - **Como usar:**  
    1. Crie uma conta no Google Cloud e ative a Perspective API.
    2. Substitua `YOUR_API_KEY` no código pela sua chave.
    3. Consulte a [documentação oficial](https://developers.perspectiveapi.com/s/docs).

- **/api/verificar-crm**  
  Consulta a API pública do Conselho Federal de Medicina para validar CRM.
  - POST `{ crm: "123456", uf: "SP" }`
  - Resposta: `{ resultado: ... }`
  - **Como usar:**  
    1. Veja a [documentação da API Consulta CRM](https://www.consultacrm.com.br/api).
    2. Adapte para outros conselhos (COREN, CREFITO, etc) conforme necessidade.

- **/api/reportar-externo**  
  Envia reports para um sistema externo de tickets (exemplo: Zendesk).
  - POST `{ usuario, motivo, detalhes }`
  - Resposta: `{ status, ticket }`
  - **Como usar:**  
    1. Crie conta em um serviço como Zendesk, Freshdesk, etc.
    2. Gere um token de API e configure no código.
    3. Consulte a [documentação da API do Zendesk](https://developer.zendesk.com/api-reference/ticketing/introduction/).

## O que adaptar

- Substitua as chaves de API e URLs pelos dados reais do seu serviço.
- Para conselhos profissionais, consulte se há API pública ou use scraping (atenção à legalidade).
- Para moderação, você pode usar outras APIs como Microsoft Content Moderator, OpenAI Moderation, etc.
- Para reports, qualquer sistema de tickets com API REST pode ser integrado.

## Como usar e atualizar

1. Instale as dependências:
   ```
   npm install express axios
   ```

2. Configure as chaves de API no código.

3. Execute a API:
   ```
   node public/apiprafuturasaplicacoes.js
   ```

4. Consulte os endpoints conforme descrito acima.

5. Para atualizar ou expandir:
   - Implemente lógica real de verificação de palavras abusivas.
   - Integre com banco de dados para reports.
   - Conecte a serviços de validação de documentos oficiais para médicos/atuantes da área.
   - Adicione autenticação/autorização conforme necessário.

6. Para futuras atualizações:
   - Crie novos endpoints conforme a necessidade do projeto.
   - Documente cada endpoint novo neste README.

---
