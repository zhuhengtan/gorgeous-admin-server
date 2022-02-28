import { getManager } from 'typeorm'
import { Admin } from '../entity/admin'
const unless = require('koa-unless')

export default function () {
  const authMid = async function (ctx: any, next: any) {
    const api = `${ctx.request.method} ${ctx.request.url.split('?')[0]}`
    const adminRepository = getManager().getRepository(Admin)
    const res = await adminRepository.query(`select * from (select * from (SELECT * from role_operation where role_id in (select role_id from admin_role where admin_id = ${ctx.requestAdmin.id})) as tmp LEFT JOIN operations as o on o.id = tmp.operation_id) as tmp2 WHERE related_api = '${api}'`)
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