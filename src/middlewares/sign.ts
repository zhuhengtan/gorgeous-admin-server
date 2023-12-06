import md5 from 'md5'
import envConfig from '../../env'
import { ResCode } from '../utils/code';
const unless = require('koa-unless')

export default function () {
  const mid = async function (ctx: any, next:any) {
    // 取出参数
    let params: any;
    if (ctx.method === 'GET') {
      params = ctx.query
    } else {
      params = ctx.request.body
    }

    // 判断签名
    if (!params.sign || !params.timestamp) {
      ctx.fail('未传入签名或者时间戳！', ResCode.Unauthorized)
      return
    } else {
      const { timestamp, sign } = params;
      if(Math.abs(timestamp - new Date().valueOf()) > 10000) {
        ctx.fail('签名过期！', ResCode.Unauthorized)
        return
      }
      const keysArray = Object.keys(params).sort();
      const checkSign = md5(`${timestamp}${envConfig.signKey}`).toUpperCase()
      if(checkSign === sign) {
        return await next()
      } else {
        ctx.fail('签名错误！', ResCode.Unauthorized)
        return
      }
    }
  }
  mid.unless = unless

  return mid
}