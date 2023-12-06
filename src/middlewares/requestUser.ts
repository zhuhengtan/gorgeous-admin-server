import { Context, Next } from 'koa';
import { getManager } from 'typeorm'
import { User, UserStatus } from '../entity/user';
import { ResCode } from '../utils/code';
import envConfig from '../../env'
import {verify} from 'jsonwebtoken'
const unless = require('koa-unless')

export default function () {
  const customMid = async (ctx: Context, next: Next) => {
    // 这种方法只能拿到经过jwt校验的接口的请求用户，所以如果有的接口可有可无，这里就拿不到user，没有用
    // if (ctx.state.user) {
    //   const re = getManager().getRepository(User)
    //   const user = await re.findOne(ctx.state.user.id)
    //   console.log('customMid', user)
    //   if(user && user.status === UserStatus.Banned) {
    //     ctx.fail('该用户已被禁用！', ResCode.UserIsBanned)
    //     return
    //   }
    //   ctx.requestUser = user
    // }
    const token = ctx.headers.authorization && ctx.headers.authorization.split(' ')[1]; // 获取请求头中的 JWT
    try {
      const userInfo = verify(token || '', envConfig.jwtSecret);
      if(userInfo) {
        const re = getManager().getRepository(User)
        const user = await re.findOne((userInfo as any).id)
        if(user && user.status === UserStatus.Banned) {
          ctx.fail('该用户已被封禁！', ResCode.UserIsBanned)
          return
        }
        ctx.requestUser = user
      } else { 
        ctx.requestUser = null
      }
    } catch (error) {
      console.log(error)
      ctx.requestUser = null
    }
    
    // if (user) {
    //   // 校验成功，将用户信息存储到 ctx.state 中
    //   ctx.state.user = user;
    // }


    await next()
  };

  customMid.unless = unless

  return customMid;
};