import { Router } from 'express'
import { readJSON } from '../utils/fs.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

/** 销量统计 */
router.get('/sales', (req, res) => {
  return res.json({ code: 200, data: readJSON('report-sales'), message: 'ok' })
})

/** 客流统计 */
router.get('/traffic', (req, res) => {
  return res.json({ code: 200, data: readJSON('report-traffic'), message: 'ok' })
})

/** 营收统计 */
router.get('/revenue', (req, res) => {
  return res.json({ code: 200, data: readJSON('report-revenue'), message: 'ok' })
})

/** 转化统计 */
router.get('/conversion', (req, res) => {
  return res.json({ code: 200, data: readJSON('report-conversion'), message: 'ok' })
})

/** 库存统计 */
router.get('/inventory', (req, res) => {
  return res.json({ code: 200, data: readJSON('report-inventory'), message: 'ok' })
})

export default router