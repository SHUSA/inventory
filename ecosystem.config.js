const host = '10.212.148.42'
const dbHost = '10.212.148.45'
const user = 'deployer'
const path = '/var/www/srl_inventory'
const port = 4040
const serverPort = 4042

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
      user : user,
      host : host,
      ref  : 'origin/beta',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : path,
      // 'post-deploy': 'git pull && pm2 list && pm2 expose',
      // 'post-deploy': 'git pull && pm2 delete 0 && pm2 delete 1 && pm2 start',
      // 'post-deploy': 'git pull && node_modules/.bin/sequelize db:migrate:undo',
      // 'post-deploy': 'git clone https://github.com/SHUSA/srl_inventory.git && npm install && npm run build && pm2 reload ecosystem.config.js --env development --update-env && pm2 list && pm2 logs',
      'post-deploy': 'git pull && npm install && node_modules/.bin/sequelize db:migrate && npm run build && pm2 reload ecosystem.config.js --env development --update-env && pm2 list && pm2 logs',
      "env"  : {
        'NODE_ENV': "'development'",
        SRL_INVENTORY_HOST: dbHost,
        SRL_INVENTORY_DB_PORT: 5432,
        PORT: port,
        SERVER_PORT: serverPort,
        HOST: host,
        NEWDB: "'false'"
      },
      "post-setup": `HOST=${host} PORT=${port} SRL_INVENTORY_HOST=${dbHost} npm install && npm start`
    },
    production : {
      user : user,
      host : host,
      ref  : 'origin/master',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : path,
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      "env"  : {
        "NODE_ENV": "production"
      }
    }
  }
};
