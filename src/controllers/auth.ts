import { Context } from 'koa'
import { verify, hash } from 'argon2'
import { getManager } from 'typeorm'
import jwt from 'jsonwebtoken'

import { User } from '../entity/user'
import { JWT_SECRET } from '../utils/contants'

export default class AuthController {
  static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User)
    const { request: { body: { name, password } }} = ctx

    const user = await userRepository
      .createQueryBuilder()
      .where({ name })
      .addSelect('User.password')
      .getOne()

      if (!user) {
        ctx.status = 401
        ctx.body = { message: '用户名不存在' }
      } else if (await verify(user.password, password )) {
        ctx.status = 200
        ctx.body = { token: jwt.sign({id: user.id }, JWT_SECRET) }
      } else {
        ctx.status = 401
        ctx.body = { message: '密码错误' }
      }
  }

  static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User)

    const newUser = new User()
    const { body: { name, email, password }} = ctx.request
    newUser.name = name
    newUser.email = email
    newUser.password = await hash(password)

    const user = await userRepository.save(newUser)

    ctx.status = 201
    ctx.body = user
  }
}