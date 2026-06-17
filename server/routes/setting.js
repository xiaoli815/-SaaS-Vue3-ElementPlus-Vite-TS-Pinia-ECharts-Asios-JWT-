import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

/** 角色列表 */
router.get('/roles', (req, res) => {
  return res.json({ code: 200, data: readJSON('setting-roles'), message: 'ok' })
})

/** 编辑角色权限 */
router.put('/role/:id', (req, res) => {
  let data = readJSON('setting-roles')
  const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '角色不存在' })
  data[i].permissions = req.body.permissions
  writeJSON('setting-roles', data)
  return res.json({ code: 200, data: data[i], message: '保存成功' })
})

/** 获取店铺信息 */
router.get('/shop-info', (req, res) => {
  return res.json({ code: 200, data: readJSON('shop-info'), message: 'ok' })
})

/** 更新店铺信息 */
router.put('/shop-info', (req, res) => {
  writeJSON('shop-info', req.body)
  return res.json({ code: 200, data: req.body, message: '保存成功' })
})

/** 获取支付配置 */
router.get('/payment-config', (req, res) => {
  return res.json({ code: 200, data: readJSON('payment-config'), message: 'ok' })
})

/** 更新支付配置 */
router.put('/payment-config', (req, res) => {
  writeJSON('payment-config', req.body)
  return res.json({ code: 200, data: req.body, message: '保存成功' })
})

/** 获取页面装修配置 */
router.get('/page-config', (req, res) => {
  return res.json({ code: 200, data: readJSON('page-config'), message: 'ok' })
})

/** 更新页面装修配置 */
router.put('/page-config', (req, res) => {
  writeJSON('page-config', req.body)
  return res.json({ code: 200, data: req.body, message: '保存成功' })
})

export default router