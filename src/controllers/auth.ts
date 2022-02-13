import { Context, Next } from 'koa'
import { verify, hash } from 'argon2'
import { getManager } from 'typeorm'
import jwt from 'jsonwebtoken'

import { User } from '../entity/user'
import { JWT_SECRET } from '../utils/constants'
import { UnauthorizedException } from '../exceptions'
import envConfig from '../../env/index'

export default class AuthController {
  static async login(ctx: Context, next: Next) {
    const userRepository = getManager().getRepository(User)
    const { email, password } = ctx.request.body as any

    const user = await userRepository
      .createQueryBuilder()
      .where({ email })
      .addSelect('User.password')
      .getOne()

    if (!user) {
      ctx.fail(`没有该用户，请向${envConfig.adminEmail}发送邮件申请权限！`)
    } else if (await verify(user.password, password)) {
      ctx.success('登录成功！', {
        userInfo: user,
        token: jwt.sign({ id: user.id }, JWT_SECRET)
      })
      return await next()
    } else {
      ctx.fail('密码输入错误！')
    }
  }

  static async getUserAuth(ctx: Context, next: Next) {
    
  }
}