/**
 * 生产环境配置文件
 */
export const config = {
  systemInfo: {
    name: 'gorgeous admin',
    loginUrl: '',
  },
  signKey: 'gorgeous-admin-server',
  env: 'production', //环境名称
  agreement: "http",
  port: "3000",
  database: {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "",
    password: "",
    database: "",
    synchronize: true,
    entities: [
      "dist/src/entity/*.js"
    ],
    cli: {
      entitiesDir: "dist/src/entity"
    },
    timezone: "+8"
  },
  adminEmail: '', // 系统管理员邮箱
  email: {
    service: '',
    port: 0,
    auth: {
      user: '', // 发送方的邮箱
      pass: '' // smtp 的授权码
    },
    from: '',
  },
  codeRedis: {
    port: 0,          // Redis port
    host: '',   // Redis host
    prefix: 'gorgeous-admin-server-code:', //存诸前缀
    ttl: 60 * 5,  //过期时间
    db: 0
  },
  staticPath: '', // 静态资源放在服务器上的位置
  staticPrefix: '', // 拼接的静态资源url前缀
};
