import { Context, Next } from 'koa'
import envConfig from '../../env'

export default class CommonController {
  public static async upload(ctx: Context, next: Next) {
    // if(!isSigned(params)) {
    //   ctx.fail(401, '签名错误')
    //   return await next()
    // }
    ctx.success('上传成功！', {
      url: envConfig.staticPrefix + (ctx.req as any).file.filename,
    })
  }
}