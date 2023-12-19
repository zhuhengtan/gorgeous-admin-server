/**
 * 开发环境配置文件
 */
const path = require('path');
export const config = {
  systemInfo: {
    name: 'gorgeous admin',
    loginUrl: 'http://localhost:3000/login',
  },
  signKey: 'gorgeous-admin-server',
  env: 'development', //环境名称
  jwtSecret: 'gorgeous-admin',
  agreement: "http",
  port: "4000",
  database: {// 数据库相关
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    charset: "utf8mb4",
    username: "root",
    password: "",
    database: "gorgeous_admin_server",
    synchronize: true,
    entities: [
      path.join(__dirname, '../src/entity/*.{ts,js}'),
    ],
    cli: {
      entitiesDir: path.join(__dirname, "../src/entity"),
    },
    timezone: "+8"
  },
  adminEmail: '', // 系统管理员邮箱
  email: { // 发送邮件相关
    service: '163',
    port: 465,
    auth: {
      user: '', // 发送方的邮箱
      pass: '' // smtp 的授权码
    },
    from: '"示例发件人" <example@163.com>',
  },
  redis: {
    port: 0,          // Redis port
    host: '',   // Redis host
    db: 0,
    prefix: 'gorgeous-admin-server-code:', //存诸前缀
    ttl: 60 * 5,  //过期时间
  },
  tencent: {
    secretId: '',
    secretKey: '',
    cosv5: {
      bucket: '',
      region: '',
      prefix: '', // path where you put your resource
    },
    sms: {
      region: '',
      endpoint: '',
    },
  },
  staticPath: '', // 静态资源放在服务器上的位置
  staticPrefix: '', // 拼接的静态资源url前缀
};