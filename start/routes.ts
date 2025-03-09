import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const ProductsController = () => import('#controllers/products_controller')
import { middleware } from './kernel.js'
const PurchaseController = () => import('#controllers/purchases_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ClientsController = () => import('#controllers/clients_controller')

router.get('/', async ({ response }) => {
  response.send('Olá')
})

router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/user', [UsersController, 'index'])
    router.post('/user', [UsersController, 'store'])
    router.get('/user/:id', [UsersController, 'show'])
    router.put('/user/:id', [UsersController, 'update'])
    router.delete('/user/:id', [UsersController, 'destroy'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/products', [ProductsController, 'index'])
    router.post('/products', [ProductsController, 'store'])
    router.get('/products/:id', [ProductsController, 'show'])
    router.put('/products/:id', [ProductsController, 'update'])
    router.delete('/products/:id', [ProductsController, 'destroy'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/gateways', [GatewaysController, 'index'])
    router.get('/gateways/:id', [GatewaysController, 'show'])
    router.put('/gateways/:id', [GatewaysController, 'update'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/clients', [ClientsController, 'index'])
    router.get('/clients/:id', [ClientsController, 'show'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.post('/purchase', [PurchaseController, 'store'])
    router.get('/purchase', [PurchaseController, 'index'])
    router.get('/purchase/:id', [PurchaseController, 'show'])
    router.post('/purchase/:id/refund', [PurchaseController, 'refund'])
  })
  .use(middleware.auth())
