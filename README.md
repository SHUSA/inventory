# Inventory

> A laboratory inventory project using Vue.js, node, express, and postgres.

## Build Setup

``` bash
# install dependencies
npm install

# start server, defaulted to port 8081
npm start

# start server and create new tables, use bash on Windows
# db must first be created in either Postgres or MYSQL
# check server/config/config.js for settings
NEWDB=true npm start

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Deploy Setup and Use
``` bash
# install dependencies

gem install capistrano
gem install capistrano-npm


# Deploy to Dev enviroment
cap staging deploy


# Deploy to Production enviroment
cap production deploy
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
