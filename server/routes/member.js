import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

/** 会员列表 */
router.get('/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword, level, isBlacklisted } = req.query
  let data = readJSON('member')
  if (keyword) { const kw = keyword.toLowerCase(); data = data.filter((x) => x.nickname.includes(kw) || x.phone.includes(kw) || x.email.includes(kw)) }
  if (level !== undefined && level !== '') data = data.filter((x) => x.level === Number(level))
  if (isBlacklisted !== undefined && isBlacklisted !== '') data = data.filter((x) => x.isBlacklisted === (isBlacklisted === 'true'))
  const total = data.length; const start = (Number(page) - 1) * Number(pageSize)
  return res.json({ code: 200, data: { list: data.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }, message: 'ok' })
})

/** 会员详情 */
router.get('/detail/:id', (req, res) => {
  const data = readJSON('member')
  const item = data.find((x) => x.id === Number(req.params.id))
  if (!item) return res.json({ code: 404, message: '会员不存在' })
  return res.json({ code: 200, data: item, message: 'ok' })
})

/** 修改会员等级 */
router.put('/level/:id', (req, res) => {
  const { level } = req.body
  let data = readJSON('member')
  const levels = readJSON('member-levels')
  const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '会员不存在' })
  const levelCfg = levels.find((l) => l.id === Number(level))
  data[i].level = Number(level)
  data[i].levelName = levelCfg ? levelCfg.name : data[i].levelName
  writeJSON('member', data)
  return res.json({ code: 200, data: data[i], message: '等级更新成功' })
})

/** 等级配置列表 */
router.get('/levels', (req, res) => {
  return res.json({ code: 200, data: readJSON('member-levels'), message: 'ok' })
})

/** 更新等级配置 */
router.put('/level-config/:id', (req, res) => {
  let data = readJSON('member-levels')
  const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '等级不存在' })
  data[i] = { ...data[i], ...req.body, id: data[i].id }
  writeJSON('member-levels', data)
  return res.json({ code: 200, data: data[i], message: '更新成功' })
})

/** 标签列表 */
router.get('/tags', (req, res) => {
  return res.json({ code: 200, data: readJSON('member-tags'), message: 'ok' })
})

/** 创建标签 */
router.post('/tag/create', (req, res) => {
  let data = readJSON('member-tags')
  const item = { ...req.body, id: Date.now(), memberCount: 0 }
  data.push(item); writeJSON('member-tags', data)
  return res.json({ code: 200, data: item, message: '创建成功' })
})

/** 删除标签 */
router.delete('/tag/delete/:id', (req, res) => {
  let data = readJSON('member-tags')
  data = data.filter((x) => x.id !== Number(req.params.id))
  writeJSON('member-tags', data)
  return res.json({ code: 200, message: '删除成功' })
})

/** 黑名单操作 */
router.put('/blacklist/:id', (req, res) => {
  let data = readJSON('member')
  const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '会员不存在' })
  data[i].isBlacklisted = !!req.body.isBlacklisted
  writeJSON('member', data)
  return res.json({ code: 200, data: data[i], message: req.body.isBlacklisted ? '已加入黑名单' : '已移除黑名单' })
})

/** 全量数据 */
router.get('/full-data/:id', (req, res) => {
  const data = readJSON('member')
  const item = data.find((x) => x.id === Number(req.params.id))
  if (!item) return res.json({ code: 404, message: '会员不存在' })
  // 附加订单统计
  const orders = readJSON('orders')
  const memberOrders = orders.filter((o) => o.userId === item.id)
  return res.json({ code: 200, data: { ...item, orderHistory: memberOrders }, message: 'ok' })
})

export default router