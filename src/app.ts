import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createConnection } from 'typeorm'
import jwt from 'koa-jwt'
import 'reflect-metadata'
import formatResponse from './middlewares/formatResponse'
import sign from './middlewares/sign'
import auth from './middlewares/auth'

import { toBRouter } from './routes/toBRoutes'
import { logger } from './logger'
import { JWT_SECRET } from './utils/constants'

import envConfig from '../env/index'
import requestAdmin from './middlewares/requestAdmin'

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
    // 开启数据库链接
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
        this.app.use(sign())
      }
      
      // 自定义jwt验证失败返回信息
      this.app.use(function(ctx, next){
        return next().catch((err) => {
          if (401 == err.status) {
            err.status = 200
            ctx.fail('登录失效或未登录！', 401)
          } else {
            throw err;
          }
        });
      })
      // jwt中间件
      this.app.use(jwt({ secret: JWT_SECRET }).unless({
        // 登录接口不需要验证
        path: ['/api/b/auth/login']
      }))

      // 将请求者用户信息放在ctx上下文中
      this.app.use(requestAdmin().unless({
        path: [/^\/api\/c/,]
      }))

      // 鉴权
      this.app.use(auth().unless({
        path: [
          '/api/b/auth/login',
          '/api/b/auth/admin-auth',
        ]
      }))

      // 导入路由
      this.app.use(toBRouter.routes())
      this.app.use(toBRouter.allowedMethods())
    }).catch((err: string) => {
      console.log('数据库链接错误：', err)
    })
  }

  private start(port: number) {
    this.app.listen(port, async () => {
      console.log(`service is started, listening port: ${port}`);
    });
  }
}