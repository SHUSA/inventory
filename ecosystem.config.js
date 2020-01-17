const host = '10.212.17.95'
const dbHost = '10.212.17.96'
const user = 'deployer'
const path = '/var/www/srl_inventory'
const port = 80
const serverPort = 3000
const devSettings = {
  NODE_ENV: 'development',
  SRL_INVENTORY_HOST: dbHost,
  SRL_INVENTORY_DB_PORT: 5432,
  PORT: port,
  SERVER_PORT: serverPort,
  HOST: host,
  NEWDB: 'false'
}

module.exports = {
  apps : [{
    name      : 'srl_inventory',
    script    : 'server.js',
    env: devSettings,
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  devSettings: devSettings,

  deploy : {
    development : {
      user : user,
      host : host,
      ref  : 'origin/beta',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : path,
      // 'post-deploy': 'git pull && node_modules/.bin/sequelize db:migrate:undo',
      'post-deploy': 'git pull && npm install && node_modules/.bin/sequelize db:migrate && npm run build && pm2 reload ecosystem.config.js --env development --update-env && pm2 list && pm2 logs',
      env  : devSettings,
      'post-setup': `HOST=${host} PORT=${port} SRL_INVENTORY_HOST=${dbHost} npm install && npm start`
    },
    production : {
      user : user,
      host : host,
      ref  : 'origin/master',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : path,
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'env'  : {
        NODE_ENV: 'production'
      }
    }
  }
};
