import { Context } from 'koa'
import { hash } from 'argon2'
import { getManager } from 'typeorm'

import { User } from '../entity/user'
import { NotFoundException } from '../exceptions'

export default class UserController {
  public static async listUsers(ctx: Context) {
    const userRepository = getManager().getRepository(User)
    const users = await userRepository.find()

    ctx.status = 200
    ctx.body = users
  }

  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne(+ctx.params.id)

    if (user) {
      ctx.status = 200
      ctx.body = user
    } else {
      throw new NotFoundException()
    }
  }

  public static async updateUser(ctx: Context) {
    const { password, id, ...params } = ctx.request.body
    if (password) {
      const newPassword = await hash(password)
      Object.assign(params, { password: newPassword })
    }

    const userRepository = getManager().getRepository(User)
    await userRepository.update(+id, params)
    const updatedUser = await userRepository.findOne(+id)

    if (updatedUser) {
      ctx.status = 200
      ctx.body = updatedUser
    } else {
      throw new NotFoundException()
    }
  }

  public static async deleteUser(ctx: Context) {
    const id = +ctx.request.body.id

    const userRepository = getManager().getRepository(User)
    await userRepository.delete(id)
    ctx.status = 204
  }
}