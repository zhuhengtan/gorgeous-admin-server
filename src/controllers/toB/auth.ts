import { Context, Next } from 'koa'
import { verify, hash } from 'argon2'
import { getManager } from 'typeorm'
import jwt from 'jsonwebtoken'
import { toBRouter } from '../../routes/toBRoutes'

import { JWT_SECRET } from '../../utils/constants'
import envConfig from '../../../env/index'
import { Admin } from '../../entity/admin'
import { Page } from '../../entity/page'
import { Operation } from '../../entity/operation'
import { Role } from '../../entity/role'
import { generateTmpPwd, getRandomCode } from '../../utils'
import { sendMail } from '../../utils/sendEmail'
import { isEmail } from '../../utils/check'
import { redisSet, redisGet } from '../../utils/redis'

export default class AuthController {
  static async login(ctx: Context, next: Next) {
    const adminRepository = getManager().getRepository(Admin)
    const { email, password } = ctx.request.body as any
    if (!email || !password) {
      ctx.fail('参数错误！')
      return await next()
    }

    const admin = await adminRepository
      .createQueryBuilder()
      .where({ email })
      .addSelect('Admin.password')
      .getOne()
    if (!admin) {
      ctx.fail(`没有该用户，请向${envConfig.adminEmail}发送邮件申请权限！`)
      return await next()
    } else if(admin.status === 0) {
      ctx.fail('该账户已封禁，请联系管理员！')
      return await next()
    } else if (await verify(admin.password, password)) {
      ctx.success('登录成功！', {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          adminType: admin.adminType,
          avatar: admin.avatar,
          createdAt: admin.createdAt,
        },
        token: jwt.sign({ id: admin.id }, JWT_SECRET)
      })
      return await next()
    } else {
      ctx.fail('密码输入错误！')
    }
  }

  static async getPages(ctx: Context, next: Next) {
    const { page = 1, pageSize = 10 } = ctx.query
    const pageRepository = getManager().getRepository(Page)
    let list = await pageRepository.find({
      relations: ['operations'],
      skip: (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10),
      take: parseInt(pageSize as string, 10),
      order: {
        createdAt: 'DESC',
      },
    })
    const total = await pageRepository.count()
    ctx.success('获取成功！', { list, total })
    return await next()
  }

  static async getPage(ctx: Context, next: Next) {
    const { id } = ctx.query
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const pageRepository = getManager().getRepository(Page)
    let page = await pageRepository.findOne({
      where: {id},
      relations: ['operations'],
    })
    ctx.success('获取成功！', page)
    return await next()
  }

  static async getAllApis(ctx: Context, next: Next) {
    const list = toBRouter.stack.map((item) => `${item.methods[item.methods.length - 1]} ${item.path}`)
    ctx.success('获取成功！', list)
  }

  static async createPage(ctx: Context, next: Next) {
    const { name, path, operations, pageType, content } = ctx.request.body as any
    if (!name || !path || !operations || !pageType) {
      ctx.fail('参数错误！')
      return await next()
    }
    const operationRepository = getManager().getRepository(Operation)
    const operationEntities = operations.map((item: any) => {
      const tmp = new Operation()
      tmp.name = item.name
      tmp.key = item.key
      tmp.relatedApi = item.relatedApi
      tmp.creator = ctx.requestAdmin
      return tmp
    })
    await operationRepository.save(operationEntities)

    const pageRepository = getManager().getRepository(Page)
    const page = new Page()
    page.name = name
    page.path = path
    page.pageType = pageType
    page.operations = operationEntities
    await pageRepository.save(page)
    ctx.success('创建成功！')
    return await next()
  }

  static async updatePage(ctx: Context, next: Next) {
    const { id, name, path, operations } = ctx.request.body as any
    if (!id || !name || !path || !operations) {
      ctx.fail('参数错误！')
      return await next()
    }
    const pageRepository = getManager().getRepository(Page)
    const page = await pageRepository.findOne(id, {
      relations: ['operations'],
    })
    if (!page) {
      ctx.fail('未找到该页面！')
      return await next()
    }

    page.name = name
    page.path = path
    await pageRepository.save(page)

    const operationRepository = getManager().getRepository(Operation)
    const tmp = operations.map((operation: any)=>{
      const operationEntity = new Operation()
      if(operation.id && String(operation.id).split('_').length === 1) {
        operationEntity.id = operation.id
      }
      operationEntity.name = operation.name
      operationEntity.key = operation.key
      operationEntity.page = page
      operationEntity.creator = ctx.requestAdmin
      operationEntity.relatedApi = operation.relatedApi
      return operationEntity
    })
    await operationRepository.save(tmp)
    
    ctx.success('更新成功！')
    return await next()
  }

  static async deleteOperation(ctx: Context, next: Next) {
    const { id } = ctx.request.body as any
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const operationRepository = getManager().getRepository(Operation)
    await operationRepository.delete(id)

    ctx.success('删除成功！')
    return await next()
  }

  static async deletePage(ctx: Context, next: Next) {
    const { id } = ctx.request.body as any
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const pageRepository = getManager().getRepository(Page)
    const page = await pageRepository.findOne(id, {
      relations: ['operations'],
    })
    if (!page) {
      ctx.fail('未找到该页面！')
      return await next()
    }
    const operationRepository = getManager().getRepository(Operation)
    await operationRepository.remove(page.operations)
    await pageRepository.remove(page)
    ctx.success('删除成功！')
    return await next()
  }

  static async getRoleList(ctx: Context, next: Next) {
    const { page = 1, pageSize = 10 } = ctx.query
    const roleRepository = getManager().getRepository(Role)
    const list = await roleRepository.find({
      relations: ['operations'],
      skip: (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10),
      take: parseInt(pageSize as string, 10),
      order: {
        createdAt: 'DESC',
      },
    })
    const total = await roleRepository.count()
    ctx.success('获取成功！', { list, total })
  }

  static async getRole(ctx: Context, next: Next) {
    const { id } = ctx.query
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const roleRepository = getManager().getRepository(Role)
    let role = await roleRepository.findOne({
      where: {id},
      relations: ['operations'],
    })
    ctx.success('获取成功！', role)
    return await next()
  }

  static async getAllOperations(ctx: Context, next: Next) {
    const pageRepository = getManager().getRepository(Page)
    const list = await pageRepository.find({
      relations: ['operations'],
    })
    ctx.success('获取成功！', list)
    return await next()
  }

  static async createRole(ctx: Context, next: Next) {
    const { name, description='', operationIds } = ctx.request.body as any
    if (!name || !operationIds) {
      ctx.fail('参数错误！')
      return await next()
    }
    const operationRepository = getManager().getRepository(Operation)
    const operations = await operationRepository.findByIds(operationIds)

    const roleRepository = getManager().getRepository(Role)
    const role = new Role()
    role.name = name
    role.description = description
    role.roleType = 2
    role.operations = operations
    role.creator = ctx.requestAdmin
    await roleRepository.save(role)
    ctx.success('创建成功！')
    return await next()
  }

  static async updateRole(ctx: Context, next: Next) {
    const { id, name, description='', operationIds } = ctx.request.body as any
    if (!id || !name || !operationIds) {
      ctx.fail('参数错误！')
      return await next()
    }

    const roleRepository = getManager().getRepository(Role)
    const role = await roleRepository.findOne(id, {
      relations: ['operations'],
    })
    if (!role) {
      ctx.fail('未找到该角色！')
      return await next()
    }
    const operationRepository = getManager().getRepository(Operation)
    const operations = await operationRepository.findByIds(operationIds)

    role.name = name
    role.description = description
    role.operations = operations
    role.creator = ctx.requestAdmin
    await roleRepository.save(role)
    ctx.success('更新成功！')
    return await next()
  }

  static async deleteRole(ctx: Context, next: Next) {
    const { id } = ctx.request.body as any
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    
    const roleRepository = getManager().getRepository(Role)
    const role = await roleRepository.findOne(id, {
      relations: ['operations'],
    })
    if (!role) {
      ctx.fail('未找到该角色！')
      return await next()
    }
    await roleRepository.remove(role)
    ctx.success('删除角色成功！')
    return await next()
  }

  static async getAdminList(ctx: Context, next: Next) {
    const { page = 1, pageSize = 10 } = ctx.query
    const adminRepository = getManager().getRepository(Admin)
    const list = await adminRepository.find({
      relations: ['roles'],
      skip: (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10),
      take: parseInt(pageSize as string, 10),
      order: {
        createdAt: 'DESC',
      },
    })
    const total = await adminRepository.count()
    ctx.success('获取成功！', { list, total })
  }

  static async getAdminDetail(ctx: Context, next: Next){
    const {id} = ctx.query
    if(!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne(id as string, {
      relations: ['roles'],
    })
    ctx.success('获取成功！', admin)
    return await next()
  }

  static async getAllRoles(ctx: Context, next: Next) {
    const roleRepository = getManager().getRepository(Role)
    const list = await roleRepository.find()
    ctx.success('获取成功！', list)
    return await next()
  }

  static async createAdmin(ctx: Context, next: Next) {
    const { name, email, roleIds } = ctx.request.body as any
    if (!name || !email || !roleIds) {
      ctx.fail('参数错误！')
      return await next()
    }
    if (!isEmail(email)) {
      ctx.fail('邮箱格式错误！')
      return await next()
    }
    
    const adminRepository = getManager().getRepository(Admin)
    if(await adminRepository.findOne({where: {email}})){
      ctx.fail('该邮箱已经存在，请检查！')
      return await next()
    }

    const roleRepository = getManager().getRepository(Role)
    const roles = await roleRepository.findByIds(roleIds)

    const pwd = generateTmpPwd(8)
    const admin = new Admin()
    admin.name = name
    admin.password = await hash(pwd)
    admin.email = email
    admin.adminType = 1
    admin.roles = roles
    admin.creator = ctx.requestAdmin
    await adminRepository.save(admin)
    await sendMail({
      subject: '临时密码',
      email,
      text: `您好，已为您开通${envConfig.systemInfo.name}的账户，您的临时密码为：${pwd}，请尽快登录系统（${envConfig.systemInfo.loginUrl}）修改密码！`
    })
    ctx.success('创建成功！')
    return await next()
  }

  static async updateAdmin(ctx: Context, next: Next) {
    const { id, name, email, status, roleIds } = ctx.request.body as any
    if (!id || !name || !email || !roleIds) {
      ctx.fail('参数错误！')
      return await next()
    }

    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne(id, {
      relations: ['roles'],
    })
    if (!admin) {
      ctx.fail('未找到该用户！')
      return await next()
    }
    const roleRepository = getManager().getRepository(Role)
    const roles = await roleRepository.findByIds(roleIds)
    admin.name = name
    admin.email = email
    admin.status = status
    admin.roles = roles
    admin.creator = ctx.requestAdmin
    await adminRepository.save(admin)
    ctx.success('更新成功！')
    return await next()
  }

  static async resetAdminPwd(ctx: Context, next: Next) {
    const { id } = ctx.request.body as any
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne(id)
    if (!admin) {
      ctx.fail('未找到该用户！')
      return await next()
    }
    const newPwd = generateTmpPwd(8)
    admin.password = await hash(newPwd)
    await sendMail({
      subject: '重置密码',
      email: admin.email,
      text: `您好，您的${envConfig.systemInfo.name}账户，密码已重置为：${newPwd}，请尽快登录系统（${envConfig.systemInfo.loginUrl}）修改密码！`
    })
    await adminRepository.save(admin)
    ctx.success('重置成功！')
    return await next()
  }

  static async sendChangePwdCode(ctx: Context, next: Next) {
    const { email } = ctx.request.body as any
    if (!email) {
      ctx.fail('参数错误！')
      return await next()
    }
    if (!isEmail(email)) {
      ctx.fail('邮箱格式错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne({
      where: {
        email
      }
    })
    if (!admin) {
      ctx.fail('该邮箱不存在，请检查！')
      return await next()
    }

    const tmp = await redisGet(email)
    if(tmp) {
      ctx.fail('验证码已经发送，请稍后尝试再次发送！')
      return await next()
    }

    const code = getRandomCode(6)
    await sendMail({
      subject: '修改密码',
      email: email,
      text: `您好，您的${envConfig.systemInfo.name}账户申请修改密码，验证码为：${code}`
    })
    try{
      await redisSet(email, code)
    } catch(e) {
      console.log(e)
    }
    ctx.success('获取成功！')
    return await next()
  }

  static async changePwd(ctx: Context, next: Next) {
    const { email, code, newPassword } = ctx.request.body as any

    console.log(email, code, newPassword)

    if (!code || !email || !newPassword) {
      ctx.fail('参数错误！')
      return await next()
    }
    if (!isEmail(email)) {
      ctx.fail('邮箱格式错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne({
      where: {
        email
      }
    })
    if (!admin) {
      ctx.fail('该邮箱不存在，请检查！')
      return await next()
    }

    const savedCode = await redisGet(email)
    if (!savedCode) {
      ctx.fail('验证码已过期，请再试一次！')
      return await next()
    }
    if (savedCode !== code) {
      ctx.fail('验证码错误，请检查！')
      return await next()
    }

    admin.password = await hash(newPassword)
    await adminRepository.save(admin)
    ctx.success('修改密码成功！')
    return await next()
  }

  static async deleteAdmin(ctx: Context, next: Next) {
    const { id } = ctx.request.body as any
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne(id)
    if (!admin) {
      ctx.fail('未找到该用户！')
      return await next()
    }
    await adminRepository.remove(admin)
    ctx.success('删除用户成功！')
    return await next()
  }

  static async updateAvatar(ctx: Context, next: Next) {
    const { id, avatar } = ctx.request.body as any
    if (!id || avatar) {
      ctx.fail('参数错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne(id)
    if (!admin) {
      ctx.fail('未找到该用户！')
      return await next()
    }
    admin.avatar = avatar
    await adminRepository.save(admin)
    ctx.success('更新头像成功！')
    return await next()
  }

  static async getAdminAuth(ctx: Context, next: Next) {
    const { id } = ctx.query
    if (!id) {
      ctx.fail('参数错误！')
      return await next()
    }
    const adminRepository = getManager().getRepository(Admin)
    const admin = await adminRepository.findOne(id as string, {
      relations: ['roles']
    })
    if(!admin){
      ctx.fail('未找到该用户！')
      return await next()
    }

    const auth = await adminRepository.query(`select o.name as operationName, o.key as operationKey, p.path as pagePath from (SELECT * from role_operation where role_id in (select role_id from admin_role where admin_id = ${id})) as tmp LEFT JOIN operations as o on o.id = tmp.operation_id LEFT JOIN pages as p on p.id = o.page_id ORDER BY pagePath`)
    let res: {[key: string]: Array<{operationKey: string, operationName: string}>} = {}
    auth.forEach((item: {operationKey: string, operationName: string, pagePath: string})=>{
      if(!res[item.pagePath]) {
        res[item.pagePath] = [{
          operationKey: item.operationKey,
          operationName: item.operationName,
        }]
      }else{
        res[item.pagePath].push({
          operationKey: item.operationKey,
          operationName: item.operationName,
        })
      }
    })

    ctx.success('获取成功！', {
      admin,
      auth: res
    })
    return await next()
  }
}