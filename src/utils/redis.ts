import Redis from 'ioredis'
import envConfig from '../../env'

export const redis = new Redis(envConfig.redis)

export const redisSet = async (key: string, value: any, expiryMode: string | any[] = 'EX', expiration: number = envConfig.redis.ttl)=> {
  if(typeof value === 'object') {
    await redis.set(`${envConfig.redis.prefix}${key}`, JSON.stringify(value), expiryMode, expiration)
  }else{
    await redis.set(`${envConfig.redis.prefix}${key}`, value, expiryMode, expiration)
  }
}
export const redisGet = async (key: string)=>{
  return await redis.get(`${envConfig.redis.prefix}${key}`)
}