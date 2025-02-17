import { Context, Next } from 'koa'
import envConfig from '../../env'
import fs from 'fs'
import { saveToCos } from '../utils/cos'
import qs from 'qs'
import { getManager } from 'typeorm'

export default class CommonController {
  public static async upload(ctx: Context, next: Next) {
    // if(!isSigned(params)) {
    //   ctx.fail(401, '签名错误')
    //   return await next()
    // }
    const file = ctx.file
    const path = file.path
    
    const reader = fs.createReadStream(path)
    const extName = file.originalname.split(".")
    let newFilename = new Date().getTime() + "." + extName[extName.length - 1];

    let cosResult = await saveToCos(`/${newFilename}`, reader);

    ctx.success('上传成功！', {
      url: `https://${cosResult.Location}`,
    })
    return await next()
  }

  public static async getEntityOptions(ctx: Context, next: Next) {
    const params = qs.parse(ctx.querystring)
    const { entityName, relations = [] } = params as { entityName: string, relations: string[] }
    const entityRepository = getManager().getRepository(entityName)

    const list = await entityRepository.find({
      relations,
    })
    ctx.success('获取成功！', list)
    return await next()
  }
}