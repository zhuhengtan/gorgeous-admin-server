/**
 * 开发环境配置文件
 */
export const config = {
  env: 'development', //环境名称
  agreement: "http",
  port: "4000",
  database: {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "Codewave20190111",
    database: "gorgeous_admin_server",
    synchronize: true,
    entities: [
      "src/entity/*.ts"
    ],
    cli: {
      entitiesDir: "src/entity"
    },
    timezone: "+8"
  }
};
