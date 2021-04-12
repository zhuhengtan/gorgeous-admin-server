import { Context } from 'koa'

export default class AuthController {
  static async login(ctx: Context) {
    ctx.body = 'Login controller'
  }

  static async register(ctx: Context) {
    ctx.body = 'Register controller'
  }
}