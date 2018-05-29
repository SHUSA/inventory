const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
// const isAuthenticated = require('./policies/isAuthenticated')
const VendorsController = require('./controllers/VendorsController')
const ItemsController = require('./controllers/ItemsController')
const AssaysController = require('./controllers/AssaysController')
const OrdersController = require('./controllers/OrdersController')

module.exports = (app) => {
  // app.post('/test', TestController.post)
  // app.put('/test2', TestController.put)
  // app.get('/test3', TestController.index)

  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login', AuthenticationController.login)

  app.get('/vendors', VendorsController.index)
  app.show('/vendors/:vendorId', VendorsController.show)
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
  app.delete('/orders/:orderId', OrdersController.remove)
}
