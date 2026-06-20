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

// ==================== 运费规则管理（后台管理） ====================

/** 获取运费规则列表 */
router.get('/c-shipping-rules', (req, res) => {
  const rules = readJSON('c-shipping-rules')
  return res.json({ code: 200, data: rules, message: 'ok' })
})

/** 新增运费规则 */
router.post('/c-shipping-rules', (req, res) => {
  const rules = readJSON('c-shipping-rules')
  const newRule = {
    ...req.body,
    id: rules.length > 0 ? Math.max(...rules.map(r => r.id)) + 1 : 1
  }
  rules.push(newRule)
  writeJSON('c-shipping-rules', rules)
  return res.json({ code: 200, data: newRule, message: '创建成功' })
})

/** 编辑运费规则 */
router.put('/c-shipping-rules/:id', (req, res) => {
  const rules = readJSON('c-shipping-rules')
  const idx = rules.findIndex(r => r.id === Number(req.params.id))
  if (idx === -1) return res.json({ code: 404, data: null, message: '规则不存在' })
  rules[idx] = { ...rules[idx], ...req.body, id: Number(req.params.id) }
  writeJSON('c-shipping-rules', rules)
  return res.json({ code: 200, data: rules[idx], message: '更新成功' })
})

/** 删除运费规则 */
router.delete('/c-shipping-rules/:id', (req, res) => {
  const rules = readJSON('c-shipping-rules')
  const filtered = rules.filter(r => r.id !== Number(req.params.id))
  writeJSON('c-shipping-rules', filtered)
  return res.json({ code: 200, data: null, message: '删除成功' })
})

/** 批量更新运费规则状态 */
router.put('/c-shipping-rules/status/batch', (req, res) => {
  const { ids, status } = req.body
  const rules = readJSON('c-shipping-rules')
  rules.forEach(r => {
    if (ids.includes(r.id)) r.status = status
  })
  writeJSON('c-shipping-rules', rules)
  return res.json({ code: 200, data: null, message: '更新成功' })
})

export default router