import multer from '@koa/multer'
import { randomUUID } from 'crypto'
import envConfig from '../../env'

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, envConfig.staticPath)
  // },
  // filename: function (req, file, cb) {
  //   let type = file.originalname.split('.')[1]
  //   cb(null, `${randomUUID()}.${type}`)
  // },
})
//文件上传限制
const limits = {
  fields: 10, //非文件字段的数量
  fileSize: 10 * 1024 * 1024, //文件大小 单位 b
  files: 1, //文件数量
}
export const upload = multer({ limits, storage })