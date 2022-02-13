/**
 * 生产环境配置文件
 */
export const config = {
  env: 'production', //环境名称
  agreement: "http",
  port: "3000",
  database: {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "Zht_test_123",
    database: "coop",
    synchronize: true,
    entities: [
      "dist/src/entity/*.js"
    ],
    cli: {
      entitiesDir: "dist/src/entity"
    },
    timezone: "+8"
  },
  adminEmail: 'zhuhengtan@126.com', // 系统管理员邮箱
};
