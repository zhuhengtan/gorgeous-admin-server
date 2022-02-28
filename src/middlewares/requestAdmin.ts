import { Context, Next } from 'koa';
import { getManager } from 'typeorm'
import { Admin } from '../entity/admin'
const unless = require('koa-unless')

export default function () {
  const customMid = async (ctx: Context, next: Next) => {
    if (ctx.state.user) {
      const re = getManager().getRepository(Admin)
      ctx.requestAdmin = await re.findOne(ctx.state.user.id)
    }
    await next()
  };

  customMid.unless = unless

  return customMid;
};