import { config as devConfig } from './development' //开发环境
import { config as prodConfig } from './production'//生产环境

const env = process.env.NODE_ENV

let config = prodConfig

if (env === 'development') {
  config = devConfig
}

export default config
