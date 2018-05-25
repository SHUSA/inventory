// const TestController = require('./sequelize/controllers/TestController')
// const TestController = require('./mongo/controllers/TestController')
const AuthenticationController = require('./mongo/controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./mongo/policies/AuthenticationControllerPolicy')
// const isAuthenticated = require('./mongo/policies/isAuthenticated')
const VendorsController = require('./mongo/controllers/VendorsController')
const ItemsController = require('./mongo/controllers/ItemsController')
const AssaysController = require('./mongo/controllers/AssaysController')
const OrdersController = require('./mongo/controllers/OrdersController')

module.exports = (app) => {
  // app.post('/test', TestController.post)
  // app.put('/test2', TestController.put)
  // app.get('/test3', TestController.index)

  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login', AuthenticationController.login)

  app.get('/vendors', VendorsController.index)
  app.post('/vendors', VendorsController.post)
  app.put('/vendors/:vendorId', VendorsController.put)

  app.get('/items', ItemsController.index)
  app.get('/items/:itemId', ItemsController.show)
  app.post('/items', ItemsController.post)
  app.put('/items/:itemId', ItemsController.put)

  app.get('/assays', AssaysController.index)
  app.get('/assays/:assayId', AssaysController.show)
  app.post('/assays', AssaysController.post)
  app.put('/assays/:assayId', AssaysController.put)

  app.get('/orders', OrdersController.index)
  app.get('/orders/:orderId', OrdersController.show)
  app.post('/orders', OrdersController.post)
  app.put('/orders/:orderId', OrdersController.put)
  app.delete('/orders/:orderId', OrdersController.remove)
}
