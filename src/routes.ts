import Router from '@koa/router'

import AuthController from './controllers/auth'

const router = new Router()
router.prefix('/api')

router.post('/auth/login', AuthController.login)
router.get('/auth/pages', AuthController.getPages)
router.get('/auth/all-apis', AuthController.getAllApis)
router.delete('/auth/page', AuthController.deletePage)
router.post('/auth/page', AuthController.createPage)
router.put('/auth/page', AuthController.updatePage)
router.get('/auth/roles', AuthController.getRoleList)
router.get('/auth/all-operations', AuthController.getAllOperations)
router.post('/auth/role', AuthController.createRole)
router.put('/auth/role', AuthController.updateRole)
router.delete('/auth/role', AuthController.deleteRole)
router.get('/auth/users', AuthController.getUserList)
router.get('/auth/all-roles', AuthController.getAllRoles)
router.post('/auth/user', AuthController.createUser)
router.put('/auth/user', AuthController.updateUser)
router.delete('/auth/user', AuthController.deleteUser)
router.post('/auth/user/reset-password', AuthController.resetUserPwd)
router.post('/auth/send-change-password-code', AuthController.sendChangePwdCode)
router.post('/auth/user/change-password', AuthController.changePwd)
router.post('/auth/update-avatar', AuthController.updateAvatar)
router.get('/auth/user-auth', AuthController.getUserAuth)


export { router }
