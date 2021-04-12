import Router from '@koa/router'

import AuthController from './controllers/auth'
import UserController from './controllers/user'

const router = new Router()

// auth related routers
router.post('/auth/login', AuthController.login)
router.post('/auth/register', AuthController.register)

// users related routers
router.get('/users', UserController.listUsers)
router.get('/users/:id', UserController.showUserDetail)
router.put('/users/:id', UserController.updateUser)
router.delete('/users/:id', UserController.deleteUser)

export default router
 