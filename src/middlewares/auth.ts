import { getManager } from 'typeorm'
import { User } from '../entity/user'
const unless = require('koa-unless')

export default function () {
  const authMid = async function (ctx: any, next: any) {
    const api = `${ctx.request.method} ${ctx.request.url.split('?')[0]}`
    const userRepository = getManager().getRepository(User)
    const res = await userRepository.query(`select * from (select * from (SELECT * from role_operation where role_id in (select role_id from user_role where user_id = ${ctx.requester.id})) as tmp LEFT JOIN operations as o on o.id = tmp.operation_id) as tmp2 WHERE related_api = '${api}'`)
    if (res && res.length > 0) {
      return await next()
    }else{
      ctx.fail('没有权限！')
      return
    }
  };

  authMid.unless = unless

  return authMid;
};