import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createConnection } from 'typeorm'
import 'reflect-metadata'

import router from './routes'
import { logger } from './logger'

createConnection().then(() => {
  // init koa app instance
  const app = new Koa()

  // register middleware
  app.use(logger())
  app.use(cors())
  app.use(bodyParser())

  // response to client request
  app.use(router.routes())
    .use(router.allowedMethods())

  // run server
  app.listen(3003)
}).catch((err: string) => {
  console.log('TypeORM connection error:', err)
})

