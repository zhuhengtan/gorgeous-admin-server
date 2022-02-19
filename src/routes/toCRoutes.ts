import Router from '@koa/router'

import { upload } from '../utils/upload'
import AuthController from '../controllers/toB/auth'
import CommonController from '../controllers/common'

const toCRouter = new Router()
toCRouter.prefix('/api/c')


export { toCRouter }
