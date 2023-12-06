import Router from '@koa/router'

import { upload } from '../utils/upload'
import AuthController from '../controllers/toB/auth'
import CommonController from '../controllers/common'

// TEMPLATE IMPORT TAG

const toBRouter = new Router()
toBRouter.prefix('/api/b')

toBRouter.post('/common/upload', upload.single('file'), CommonController.upload)

toBRouter.post('/auth/login', AuthController.login)
toBRouter.get('/auth/pages', AuthController.getPages)
toBRouter.get('/auth/page', AuthController.getPage)
toBRouter.get('/auth/all-apis', AuthController.getAllApis)
toBRouter.delete('/auth/page', AuthController.deletePage)
toBRouter.post('/auth/page', AuthController.createPage)
toBRouter.put('/auth/page', AuthController.updatePage)
toBRouter.delete('/auth/operation', AuthController.deleteOperation)

toBRouter.get('/auth/roles', AuthController.getRoleList)
toBRouter.get('/auth/role', AuthController.getRole)
toBRouter.get('/auth/all-operations', AuthController.getAllOperations)
toBRouter.post('/auth/role', AuthController.createRole)
toBRouter.put('/auth/role', AuthController.updateRole)
toBRouter.delete('/auth/role', AuthController.deleteRole)

toBRouter.get('/auth/admins', AuthController.getAdminList)
toBRouter.get('/auth/admin', AuthController.getAdminDetail)
toBRouter.get('/auth/all-roles', AuthController.getAllRoles)
toBRouter.post('/auth/admin', AuthController.createAdmin)
toBRouter.put('/auth/admin', AuthController.updateAdmin)
toBRouter.delete('/auth/admin', AuthController.deleteAdmin)
toBRouter.post('/auth/admin/reset-password', AuthController.resetAdminPwd)
toBRouter.post('/auth/send-change-password-code', AuthController.sendChangePwdCode)
toBRouter.post('/auth/admin/change-password', AuthController.changePwd)
toBRouter.post('/auth/update-avatar', AuthController.updateAvatar)
toBRouter.get('/auth/admin-auth', AuthController.getAdminAuth)

toBRouter.post('/auth/generate-server-crud', AuthController.generateServerCRUD)
toBRouter.get('/auth/generated-entity', AuthController.getGeneratedEntityDetail)

// TEMPLATE ROUTES TAG

export { toBRouter }
