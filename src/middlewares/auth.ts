const KEY = 'd5f81d3d7a694e59ba65eece08f0b252'
import md5 from 'md5'

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
      ctx.fail('access deny', 401)
    } else {
      const { timestamp, sign } = params;
      const keysArray = Object.keys(params).sort();
      const checkSign = md5(`${keysArray.filter((key) => (key !== 'timestamp' && key !== 'sign')).map((key) => params[key]).join('')}${timestamp}${KEY}`).toUpperCase()
      if(checkSign === sign) {
        await next()
      }else {
        ctx.fail('access deny', 401)
        await next()
      }
    }
  }
}