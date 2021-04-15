import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createConnection } from 'typeorm'
import jwt from 'koa-jwt'
import 'reflect-metadata'

import { unProtectedRouter, protectedRouter } from './routes'
import { logger } from './logger'
import { JWT_SECRET } from './utils/contants'

createConnection().then(() => {
  // init koa app instance
  const app = new Koa()

  // register middleware
  app.use(logger())
  app.use(cors())
  app.use(bodyParser())

  // error handling
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = { message: error.message }
    }
  })

  // response to client request
  // routes without jwt validation
  app.use(unProtectedRouter.routes())
    .use(unProtectedRouter.allowedMethods())

  app.use(jwt({ secret: JWT_SECRET }))

  // routes with jwt validate
  app.use(protectedRouter.routes())
    .use(protectedRouter.allowedMethods())

  // run server
  app.listen(3003)
}).catch((err: string) => {
  console.log('TypeORM connection error:', err)
})

