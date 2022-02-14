import Redis from 'ioredis'
import envConfig from '../../env'

export const codeRedis = new Redis(envConfig.codeRedis)