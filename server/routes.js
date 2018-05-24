const TestController = require('./sequelize/controllers/TestController')

module.exports = (app) => {
  app.post('/test', TestController.post)

  app.put('/test', TestController.put)

  app.get('/test', TestController.index)
}
