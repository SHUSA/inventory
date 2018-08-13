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
      user : 'rails',
      host : '10.212.148.42',
      ref  : 'origin/deploy-scripts',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : '/var/www/srl_inventory',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env development',
      "env"  : {
        "NODE_ENV": "development",
        SRL_INVENTORY_HOST: '10.212.148.45',
        PORT: 4040,
      },
      "pre-setup" : "NEWDB=false npm start",
    },
    production : {
      user : 'rails',
      host : '10.212.148.42',
      ref  : 'origin/deploy-scripts',
      repo : 'git@github.com:SHUSA/srl_inventory.git',
      path : '/var/www/srl_inventory',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      "env"  : {
        "NODE_ENV": "production"
      }
    }
  }
};
