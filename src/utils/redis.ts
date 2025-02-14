import Redis from 'ioredis'
import envConfig from '../../env'

export const redis = new Redis(envConfig.redis)

export const redisSet = async (key: string, value: any, expiration: number = envConfig.redis.ttl)=> {
  if(typeof value === 'object') {
    await redis.set(`${envConfig.redis.prefix}${key}`, JSON.stringify(value), "EX", expiration)
  }else{
    await redis.set(`${envConfig.redis.prefix}${key}`, value, "EX", expiration)
  }
}
export const redisGet = async (key: string)=>{
  return await redis.get(`${envConfig.redis.prefix}${key}`)
}