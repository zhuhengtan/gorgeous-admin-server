import { Context } from 'koa'
import * as argon2 from 'argon2'
import { getManager } from 'typeorm'

import { User } from '../entity/user'
export default class AuthController {
  static async login(ctx: Context) {
    ctx.body = 'Login controller'
  }

  static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User)

    const newUser = new User()
    const { body: { name, email, password }} = ctx.request
    newUser.name = name
    newUser.email = email
    console.log('password', password)
    newUser.password = await argon2.hash(password)

    const user = await userRepository.save(newUser)

    ctx.status = 201
    ctx.body = user
  }
}