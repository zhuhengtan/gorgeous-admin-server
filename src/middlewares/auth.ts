import { getManager } from 'typeorm'
import { Admin } from '../entity/admin'
const unless = require('koa-unless')

export default function () {
  const authMid = async function (ctx: any, next: any) {
    const api = `${ctx.request.method} ${ctx.request.url.split('?')[0]}`
    const adminRepository = getManager().getRepository(Admin)
    // const res = await adminRepository.query(
    //   `select * from (select * from (SELECT * from role_operation where role_id in (select role_id from admin_role where admin_id = ${ctx.requestAdmin.id})) as tmp LEFT JOIN operations as o on o.id = tmp.operation_id) as tmp2 WHERE JSON_CONTAINS(o.related_apis, '"${api}"', '$') = 1`,
    // )
    const res = await adminRepository.query(
      `SELECT o.*, p.id AS page_id, p.name AS page_name, p.path AS page_path
        FROM operations o
        JOIN role_operation ro ON o.id = ro.operation_id
        JOIN roles r ON ro.role_id = r.id
        JOIN admin_role ar ON r.id = ar.role_id
        JOIN pages p ON o.page_id = p.id
        WHERE ar.admin_id = ?
        AND JSON_CONTAINS(o.related_apis, '"${api}"', '$') = 1
      `,
      [ctx.requestAdmin.id]
  )
    if (res && res.length > 0) {
      return await next()
    } else {
      ctx.fail('没有权限！')
      return
    }
  }

  authMid.unless = unless

  return authMid
}
