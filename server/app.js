import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import productRouter from './routes/product.js'
import orderRouter from './routes/order.js'
import marketingRouter from './routes/marketing.js'
import memberRouter from './routes/member.js'
import reportRouter from './routes/report.js'
import settingRouter from './routes/setting.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由挂载
app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/marketing', marketingRouter)
app.use('/api/member', memberRouter)
app.use('/api/report', reportRouter)
app.use('/api/setting', settingRouter)

app.get('/api/health', (req, res) => {
  res.json({ code: 200, data: { status: 'running', time: new Date().toISOString() }, message: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ code: 404, data: null, message: `接口 ${req.originalUrl} 不存在` })
})

app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.status(500).json({ code: 500, data: null, message: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log('')
  console.log('========================================')
  console.log('  电商SaaS Mock 后端 v2.1 — 6模块已启动')
  console.log('  地址: http://localhost:' + PORT)
  console.log('')
  console.log('  模块: 商品/订单/营销/会员/报表/系统设置')
  console.log('  账号: admin/operator/viewer 密码 123456')
  console.log('========================================\n')
})