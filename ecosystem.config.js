module.exports = {
  apps : [{
    name      : 'srl_inventory',
    script    : 'server.js',
    env: { 
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    development : {
      user : 'deployer',
      host : '10.212.14178.95',
      ref  : 'origin/beta',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : '/var/www/srl_inventory',
      // 'post-deploy': 'git pull && pm2 list && pm2 expose',
      // 'post-deploy': 'git pull && pm2 delete 0 && pm2 delete 1 && pm2 start',
      // 'post-deploy': 'git pull && node_modules/.bin/sequelize db:migrate:undo',
      'post-deploy': 'git pull && npm install && node_modules/.bin/sequelize db:migrate && npm run build && pm2 reload ecosystem.config.js --env development --update-env && pm2 list && pm2 logs',
      "env"  : {
        'NODE_ENV': "'development'",
        SRL_INVENTORY_HOST: '10.212.17.96',
        SRL_INVENTORY_DB_PORT: 5432,
        PORT: 4040,
        SERVER_PORT: 4042,
        HOST: "10.212.148.42",
        NEWDB: "'false'"
      },
      "post-setup": "HOST=10.212.148.42 PORT=4040 SRL_INVENTORY_HOST=10.212.148.45 npm install && npm start"
    },
    production : {
      user : 'rails',
      host : '10.212.148.42',
      ref  : 'origin/master',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : '/var/www/srl_inventory',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      "env"  : {
        "NODE_ENV": "production"
      }
    }
  }
};
