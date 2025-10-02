Resumo rápido de deploy (Docker + Nginx)

Pré-requisitos (no servidor):
- Docker e docker-compose instalados.
- Portas 80/443 livres (ou ajuste nginx).
- Certificados TLS se for disponibilizar HTTPS (vamos usar /certs no compose).

Passos:

1) Preparar variáveis de ambiente
   - Copie o .env local para o servidor (NÃO versionar).
   - Ajuste: NODE_ENV=production, DB_HOST (se for usar container de DB no compose deixe como 'db'), DB_USER, DB_PASS, DB_NAME, SESSION_SECRET, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, SMTP_*.
   - Exemplo: editar .env com valores do provedor.

2) Criar pastas de armazenamento de uploads
   sudo mkdir -p /srv/hugdown/perfis /srv/hugdown/post /srv/hugdown/docs
   sudo chown -R 1000:1000 /srv/hugdown/perfis /srv/hugdown/post /srv/hugdown/docs
   (monte esses caminhos como volumes se desejar)

3) Build e subida dos containers (no diretório do projeto)
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d

4) Executar migrações (apenas a adição da coluna subscription):
   - Se o pacote mysql-client estiver disponível:
     export $(cat .env | xargs)
     ./scripts/migrate.sh
   - Ou conecte no container db:
     docker exec -i <db_container_name> mysql -u root -p"$DB_PASS" "$DB_NAME" < migrations/add_subscription.sql

5) TLS/HTTPS
   - Se for usar Let's Encrypt com certbot, crie um container certbot ou use ACME no host.
   - Monte certificados em ./certs para nginx (compose já mapeia ./certs -> /etc/ssl/certs)
   - Alternativa: usar um balanceador (Cloud provider) que termina TLS.

6) Verificações pós-deploy
   - docker-compose -f docker-compose.prod.yml ps
   - docker logs -f nome_do_container_app (ou pm2 logs dentro do container)
   - Acesse APP_URL e teste login, upload, web-push (gerar VAPID em produção se necessário).

7) Gerenciamento de processo e logs
   - PM2 já roda no container; para gerenciamento fora do container use docker commands.
   - Configure rotinas de backup do volume db_data e da pasta de uploads.

Gerar novas VAPID keys (se quiser trocar as atuais):
   npx web-push generate-vapid-keys --json
Atualize VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY no .env e reinicie o serviço (docker-compose restart app).

Observações de segurança e produção:
- Nunca deixe .env em repositório público.
- Use secrets do provedor se disponível (Docker secrets / cloud secrets manager).
- Configure backup do MySQL e monitoramento (Health checks, Sentry, Prometheus).
