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
import { toCRouter } from './routes/toCRoutes'
import { logger } from './logger'

import envConfig from '../env/index'
import requestAdmin from './middlewares/requestAdmin'
import requestUser from './middlewares/requestUser'
import moment from 'moment'
import timezone from 'moment-timezone'

import { RateLimit, Stores } from 'koa2-ratelimit'

moment.updateLocale('en', {
  week: { dow: 1 }, // 1 表示周一
})
timezone.tz.setDefault('Asia/Shanghai')

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
      this.app.use(RateLimit.middleware({
        interval: { min: 1 },  // 限制的时间窗口
        max: 100,  // duration时间内的最大请求量
        message: "请求过于频繁，请稍后再试。",  // 超出限制时的返回消息
        store: new Stores.Redis({// 使用redis存储
          host: envConfig.redis.host,
          port: envConfig.redis.port,
          db: envConfig.redis.db,
        }),
      }))
      this.app.use(logger())
      if(envConfig.env === 'development') {
        this.app.use(cors())
      }
      this.app
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
        this.app.use(sign().unless({
          path: [
            '/api/b/common/upload',
            '/api/c/common/upload'
          ]
        }))
      }
      
      // 自定义jwt验证失败返回信息
      this.app.use(function(ctx, next){
        return next().catch((err) => {
          console.log(err)
          if (401 == err.status) {
            err.status = 200
            ctx.fail('登录失效或未登录！', 401)
          } else if(err.message === 'jwt must be provided') {
            ctx.fail('接口header必须传入Authorization字段！', 401)
          } else {
            throw err;
          }
        });
      })
      // jwt中间件
      this.app.use(jwt({ secret: envConfig.jwtSecret }).unless({
        // 登录接口不需要验证
        path: [
          '/api/b/auth/login',
          '/api/c/user/get-login-sms-code',
          '/api/c/user/login-with-sms-code',
          /^\/api\/c\/public/,
        ]
      }))

      // 将请求者用户信息放在ctx上下文中
      this.app.use(requestAdmin().unless({
        path: [/^\/api\/c/,]
      }))
      this.app.use(requestUser().unless({
        path: [/^\/api\/b/,]
      }))

      // 鉴权
      this.app.use(auth().unless({
        path: [
          '/api/b/auth/login',
          '/api/b/auth/admin-auth',
          '/api/b/common/upload',
          /^\/api\/c/,
        ]
      }))

      // 导入路由
      this.app.use(toBRouter.routes())
      this.app.use(toBRouter.allowedMethods())
      
      this.app.use(toCRouter.routes())
      this.app.use(toCRouter.allowedMethods())
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