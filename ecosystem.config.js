module.exports = {
  apps: [
    {
      name: 'hugdown',
      script: 'app.js', // ou 'bin/www' se seu projeto usar esse entrypoint
      instances: process.env.WEB_CONCURRENCY || 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
