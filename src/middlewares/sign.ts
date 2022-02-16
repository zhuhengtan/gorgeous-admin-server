import md5 from 'md5'
import envConfig from '../../env'

export default function () {
  return async function (ctx: any, next:any) {
    // 取出参数
    let params: any;
    if (ctx.method === 'GET') {
      params = ctx.query
    } else {
      params = ctx.request.body
    }

    // 判断签名
    if (!params.sign || !params.timestamp) {
      ctx.fail('未传入签名或者时间戳！', 401)
      return await next()
    } else {
      const { timestamp, sign } = params;
      const keysArray = Object.keys(params).sort();
      const checkSign = md5(`${keysArray.filter((key) => (key !== 'timestamp' && key !== 'sign')).map((key) => params[key]).join('')}${timestamp}${envConfig.signKey}`).toUpperCase()
      if(checkSign === sign) {
        return await next()
      }else {
        ctx.fail('签名错误！', 401)
        return
      }
    }
  }
}