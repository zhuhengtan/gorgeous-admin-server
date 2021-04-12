import { Context } from 'koa'

export default class UserController {
  static async listUsers(ctx: Context) {
    ctx.body = 'ListUsers controller'
  }

  static async showUserDetail(ctx: Context) {
    ctx.body = `ShowUserDetail controller with ID = ${ctx.params.id}`
  }

  static async updateUser(ctx: Context) {
    ctx.body = `UpdateUser Controller with ID = ${ctx.params.id}`
  }

  static async deleteUser(ctx: Context) {
    ctx.body = `DeleteUser controller with ID = ${ctx.params.id}`
  }
}