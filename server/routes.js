const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const VendorsController = require('./controllers/VendorsController')
const ItemsController = require('./controllers/ItemsController')
const AssaysController = require('./controllers/AssaysController')
const OrdersController = require('./controllers/OrdersController')
const DepartmentController = require('./controllers/DepartmentController')
const EntryController = require('./controllers/EntryController')
const HistoryController = require('./controllers/HistoryController')
const isAuthenticated = require('./policies/isAuthenticated')
// define placement of authentication

module.exports = (app) => {
  app.post('/auth/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/auth/user/login', AuthenticationController.userLogin)
  app.post('/auth/admin/login', AuthenticationController.login)
  app.post('/auth/user/update', isAuthenticated, AuthenticationController.update)
  app.post('/auth/user/session', isAuthenticated, AuthenticationController.checkSession)
  app.post('/auth/passwordreset', isAuthenticated, AuthenticationController.reset)
  app.get('/auth/users/get', isAuthenticated, AuthenticationController.getUsers)

  app.get('/departments', DepartmentController.index)
  app.post('/departments', DepartmentController.post)
  app.put('/departments/:deptId', isAuthenticated, DepartmentController.put)

  app.get('/vendors', isAuthenticated, VendorsController.index)
  app.get('/vendors/:vendorId', VendorsController.show)
  app.post('/vendors', isAuthenticated, VendorsController.post)
  app.put('/vendors/:vendorId', isAuthenticated, VendorsController.put)

  app.get('/items', isAuthenticated, ItemsController.index)
  app.post('/items/list', ItemsController.show)
  app.post('/items', isAuthenticated, ItemsController.post)
  app.put('/items/:itemId', isAuthenticated, ItemsController.put)
  app.put('/items/deactivate', isAuthenticated, ItemsController.deactivate)
  app.put('/items/reassign', isAuthenticated, ItemsController.reassign)

  app.get('/assays', isAuthenticated, AssaysController.index)
  app.get('/assays/:assayId', AssaysController.show)
  app.post('/assays', isAuthenticated, AssaysController.post)
  app.put('/assays/:assayId', isAuthenticated, AssaysController.put)

  app.get('/orders', isAuthenticated, OrdersController.index)
  app.get('/orders/:orderId', OrdersController.show)
  app.post('/orders', isAuthenticated, OrdersController.post)
  app.put('/orders/:orderId', isAuthenticated, OrdersController.put)
  app.delete('/orders/:orderId', OrdersController.remove)

  app.get('/entries', EntryController.index)
  app.get('/entries/:entryId', EntryController.show)
  app.post('/entries', EntryController.post)
  app.put('/entries', EntryController.put)
  app.delete('/entries', EntryController.remove)

  app.post('/histories', HistoryController.show)
}
