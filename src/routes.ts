import Router from '@koa/router'

import AuthController from './controllers/auth'
import UserController from './controllers/user'

const unProtectedRouter = new Router()

// auth related routers
unProtectedRouter.post('/auth/login', AuthController.login)
unProtectedRouter.post('/auth/register', AuthController.register)

const protectedRouter = new Router()

// users related routers
protectedRouter.get('/get-users', UserController.listUsers)
protectedRouter.get('/get-user-detail/:id', UserController.showUserDetail)
protectedRouter.post('/update-user', UserController.updateUser)
protectedRouter.post('/delete-users', UserController.deleteUser)

export { unProtectedRouter, protectedRouter }
 