import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// ==================== 秒杀 ====================
router.get('/seckill/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword } = req.query
  let data = readJSON('seckill')
  if (keyword) data = data.filter((x) => x.name.includes(keyword))
  const total = data.length
  const start = (Number(page) - 1) * Number(pageSize)
  return res.json({ code: 200, data: { list: data.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }, message: 'ok' })
})
router.post('/seckill/create', (req, res) => {
  const data = readJSON('seckill')
  const item = { ...req.body, id: Date.now(), status: 0, statusText: '未开始' }
  data.push(item); writeJSON('seckill', data)
  return res.json({ code: 200, data: item, message: '创建成功' })
})
router.put('/seckill/:id', (req, res) => {
  let data = readJSON('seckill'); const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '不存在' })
  data[i] = { ...data[i], ...req.body, id: data[i].id }; writeJSON('seckill', data)
  return res.json({ code: 200, data: data[i], message: '更新成功' })
})
router.delete('/seckill/:id', (req, res) => {
  let data = readJSON('seckill'); data = data.filter((x) => x.id !== Number(req.params.id)); writeJSON('seckill', data)
  return res.json({ code: 200, message: '删除成功' })
})

// ==================== 拼团 ====================
router.get('/group/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword } = req.query
  let data = readJSON('group')
  if (keyword) data = data.filter((x) => x.name.includes(keyword))
  const total = data.length; const start = (Number(page) - 1) * Number(pageSize)
  return res.json({ code: 200, data: { list: data.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }, message: 'ok' })
})
router.post('/group/create', (req, res) => {
  const data = readJSON('group'); const item = { ...req.body, id: Date.now(), status: 0, statusText: '未开始' }; data.push(item); writeJSON('group', data)
  return res.json({ code: 200, data: item, message: '创建成功' })
})
router.put('/group/:id', (req, res) => {
  let data = readJSON('group'); const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '不存在' })
  data[i] = { ...data[i], ...req.body, id: data[i].id }; writeJSON('group', data)
  return res.json({ code: 200, data: data[i], message: '更新成功' })
})
router.delete('/group/:id', (req, res) => {
  let data = readJSON('group'); data = data.filter((x) => x.id !== Number(req.params.id)); writeJSON('group', data)
  return res.json({ code: 200, message: '删除成功' })
})

// ==================== 优惠券 ====================
router.get('/coupon/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword, status } = req.query
  let data = readJSON('coupon')
  if (keyword) data = data.filter((x) => x.name.includes(keyword))
  if (status !== undefined && status !== '') data = data.filter((x) => x.status === Number(status))
  const total = data.length; const start = (Number(page) - 1) * Number(pageSize)
  return res.json({ code: 200, data: { list: data.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }, message: 'ok' })
})
router.post('/coupon/create', (req, res) => {
  const data = readJSON('coupon'); const item = { ...req.body, id: Date.now(), received: 0, used: 0, status: 0, statusText: '未开始' }; data.push(item); writeJSON('coupon', data)
  return res.json({ code: 200, data: item, message: '创建成功' })
})
router.put('/coupon/:id', (req, res) => {
  let data = readJSON('coupon'); const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '不存在' })
  data[i] = { ...data[i], ...req.body, id: data[i].id }; writeJSON('coupon', data)
  return res.json({ code: 200, data: data[i], message: '更新成功' })
})
router.delete('/coupon/:id', (req, res) => {
  let data = readJSON('coupon'); data = data.filter((x) => x.id !== Number(req.params.id)); writeJSON('coupon', data)
  return res.json({ code: 200, message: '删除成功' })
})

// ==================== 满减 ====================
router.get('/full-reduction/list', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query
  const data = readJSON('full-reduction'); const total = data.length; const start = (Number(page) - 1) * Number(pageSize)
  return res.json({ code: 200, data: { list: data.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }, message: 'ok' })
})
router.post('/full-reduction/create', (req, res) => {
  const data = readJSON('full-reduction'); const item = { ...req.body, id: Date.now(), status: 0, statusText: '未开始' }; data.push(item); writeJSON('full-reduction', data)
  return res.json({ code: 200, data: item, message: '创建成功' })
})
router.put('/full-reduction/:id', (req, res) => {
  let data = readJSON('full-reduction'); const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '不存在' })
  data[i] = { ...data[i], ...req.body, id: data[i].id }; writeJSON('full-reduction', data)
  return res.json({ code: 200, data: data[i], message: '更新成功' })
})
router.delete('/full-reduction/:id', (req, res) => {
  let data = readJSON('full-reduction'); data = data.filter((x) => x.id !== Number(req.params.id)); writeJSON('full-reduction', data)
  return res.json({ code: 200, message: '删除成功' })
})

// ==================== 分销 ====================
router.get('/distribution/config', (req, res) => {
  const data = readJSON('distribution')
  return res.json({ code: 200, data, message: 'ok' })
})
router.put('/distribution/config', (req, res) => {
  writeJSON('distribution', req.body.configs)
  return res.json({ code: 200, data: req.body.configs, message: '保存成功' })
})

// ==================== 直播 ====================
router.get('/live/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword } = req.query
  let data = readJSON('live')
  if (keyword) data = data.filter((x) => x.title.includes(keyword) || x.anchor.includes(keyword))
  const total = data.length; const start = (Number(page) - 1) * Number(pageSize)
  return res.json({ code: 200, data: { list: data.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }, message: 'ok' })
})
router.post('/live/create', (req, res) => {
  const data = readJSON('live'); const item = { ...req.body, id: Date.now(), status: 0, statusText: '未开始' }; data.push(item); writeJSON('live', data)
  return res.json({ code: 200, data: item, message: '创建成功' })
})
router.put('/live/:id', (req, res) => {
  let data = readJSON('live'); const i = data.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.json({ code: 404, message: '不存在' })
  data[i] = { ...data[i], ...req.body, id: data[i].id }; writeJSON('live', data)
  return res.json({ code: 200, data: data[i], message: '更新成功' })
})
router.delete('/live/:id', (req, res) => {
  let data = readJSON('live'); data = data.filter((x) => x.id !== Number(req.params.id)); writeJSON('live', data)
  return res.json({ code: 200, message: '删除成功' })
})

export default router