const TestController = require('./controllers/TestController')

module.exports = (app) => {
  app.post('/', TestController.post)

  app.put('/', TestController.put)

  app.get('/', TestController.get)
}
