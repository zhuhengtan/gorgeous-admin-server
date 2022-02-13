import Koa, { Next } from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createConnection } from 'typeorm'
import jwt from 'koa-jwt'
import 'reflect-metadata'
import formatResponse from './middlewares/formatResponse'
import auth from './middlewares/auth'

import { router } from './routes'
import { logger } from './logger'
import { JWT_SECRET } from './utils/constants'

import envConfig from '../env/index'
import { Context } from 'koa'
import { User } from './entity/user'
import { getManager } from 'typeorm'

export class App {
  private app: Koa;
  constructor(port: number) {
    this.app = new Koa();
    this.init().then(() => {
      this.start(port);
    }).catch(err => {
      console.log(err);
    });
  }

  // 装配各种中间件
  private async init() {
    // register middleware
    createConnection(envConfig.database as any).then(() => {
      this.app.use(logger())
      this.app.use(cors())
        .use(bodyParser())
        .use(formatResponse())

      // error handling
      this.app.use(async (ctx, next) => {
        try {
          await next()
        } catch (error) {
          ctx.status = error.status || 500
          ctx.body = { message: error.message }
        }
      })

      if(envConfig.env === 'production') {
        this.app.use(auth())
      }
      // response to client request
      this.app.use(jwt({ secret: JWT_SECRET }).unless({
        // 登录接口不需要验证
        path: ['/api/auth/login']
      }))
      this.app.use(async (ctx: Context, next: Next) => {
        if (ctx.state.user) {
          const re = getManager().getRepository(User)
          ctx.requester = await re.findOne(ctx.state.user.id)
        }
        await next()
      })
      // routes with jwt validate
      this.app.use(router.routes())
      this.app.use(router.allowedMethods())
    }).catch((err: string) => {
      console.log('TypeORM connection error:', err)
    })
  }

  private start(port: number) {
    this.app.listen(port, async () => {
      console.log(`service is started, listening port: ${port}`);
    });
  }
}