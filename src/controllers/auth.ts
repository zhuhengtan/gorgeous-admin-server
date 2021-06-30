import { Context } from 'koa'
import { verify, hash } from 'argon2'
import { getManager } from 'typeorm'
import jwt from 'jsonwebtoken'

import { User } from '../entity/user'
import { JWT_SECRET } from '../utils/constants'
import { UnauthorizedException } from '../exceptions'

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
        throw new UnauthorizedException('The user does not exist')
      } else if (await verify(user.password, password )) {
        ctx.status = 200
        ctx.body = { token: jwt.sign({id: user.id }, JWT_SECRET) }
      } else {
        throw new UnauthorizedException('Wrong password')
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