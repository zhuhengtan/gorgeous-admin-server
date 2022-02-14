/**
 * 开发环境配置文件
 */
export const config = {
  systemInfo: {
    name: 'gorgeous admin',
    loginUrl: 'http://localhost:3000/login',
  },
  env: 'development', //环境名称
  agreement: "http",
  port: "4000",
  database: {// mysql相关
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "",
    database: "gorgeous_admin_server",
    synchronize: true,
    entities: [
      "src/entity/*.ts"
    ],
    cli: {
      entitiesDir: "src/entity"
    },
    timezone: "+8"
  },
  adminEmail: '', // 系统管理员邮箱
  email: { // 发送邮件相关
    service: '163', // example
    port: 465, // example
    auth: {
      user: '', // 发送方的邮箱
      pass: '' // smtp 的授权码
    },
    from: '"example" <example@163.com>',
  },
  codeRedis: {// 存储验证码的redis
    port: 6380,          // Redis port
    host: '127.0.0.1',   // Redis host
    prefix: 'gorgeous-admin-server-code:', //存诸前缀
    ttl: 60 * 5,  //过期时间
    db: 0
  },
};
