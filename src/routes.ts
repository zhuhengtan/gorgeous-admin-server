import Router from '@koa/router'

import AuthController from './controllers/auth'
import UserController from './controllers/user'

const router = new Router()

router.post('/api/auth/login', AuthController.login)


export { router }
