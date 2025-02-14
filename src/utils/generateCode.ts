import shell from 'shelljs'
import fs from 'fs'
import { ColumnType } from 'typeorm'
import { Context, Next } from 'koa'
import { dasherize, tableize, underscore } from 'inflected'
import nunjucks from 'nunjucks'
export interface Column {
  name: string
  type: string
  columnName?: string
  columnType?: ColumnType
  default?: any
  comment?: string
}

export interface Field {
  id: string
  title: string
  name: string
  type: string
  columnName: string
  comment: string
  columnType: ColumnType
  columnDefaultValue: string | number | boolean
  editable: boolean
  editComponent: string
}

interface Props {
  entityName: string
  columns: Column[]
}

export const generateCURD = async ({
  entityName,
  columns,
}: Props, ctx: Context, next: Next) => {
  nunjucks.configure({
    autoescape: false,
  })

  // 生成entity
  const className = entityName[0].toUpperCase() + entityName.substring(1) // 类名
  const tableName = tableize(entityName) // 表名

  const projectRoot = process.cwd()


  const entityRes = nunjucks.render(`${projectRoot}/src/entity/entityTemplate.njk`, {
    className,
    tableName,
    columns
  })
  const entityPath = `${projectRoot}/src/entity/${entityName}.ts`

  if (fs.existsSync(entityPath)) {
    return -1
  }
  fs.writeFileSync(entityPath, entityRes)

  // 生成controller
  const controllerRes = nunjucks.render(`${projectRoot}/src/controllers/controllerTemplate.njk`, {
    className,
    entityName,
  })
  const controllerPath = `${projectRoot}/src/controllers/toB/${entityName}.ts`
  if (fs.existsSync(controllerPath)) {
    return -2
  }
  fs.writeFileSync(controllerPath, controllerRes)

  // 生成routes
  const toBRoutesPath = `${projectRoot}/src/routes/toBRoutes.ts`
  const pluralRouteName = dasherize(tableize(entityName))
  const routeName = dasherize(underscore(entityName))
  const routesStr = nunjucks.render(`${projectRoot}/src/routes/toBRoutesTemplate.njk`, { pluralRouteName, routeName, className })
  const importStr = `import ${className}Controller from '../controllers/toB/${entityName}'\n// TEMPLATE IMPORT TAG`
  shell.sed('-i', '// TEMPLATE IMPORT TAG', importStr, toBRoutesPath)
  shell.sed('-i', '// TEMPLATE ROUTES TAG', routesStr, toBRoutesPath)
  return [
    {
      name: '页面详情',
      key: 'page-detail',
      relatedApi: 'GET /api/b/auth/page'
    },
    {
      name: '查看列表',
      key: 'list',
      relatedApi: `GET /api/b/${pluralRouteName}`,
    },
    {
      name: '查看详情',
      key: 'detail',
      relatedApi: `GET /api/b/${routeName}`,
    },
    {
      name: '新增',
      key: 'create',
      relatedApi: `POST /api/b/${routeName}`,
    },
    {
      name: '更新',
      key: 'update',
      relatedApi: `PUT /api/b/${routeName}`,
    },
    {
      name: '删除',
      key: 'delete',
      relatedApi: `DELETE /api/b/${routeName}`,
    }
  ]
}