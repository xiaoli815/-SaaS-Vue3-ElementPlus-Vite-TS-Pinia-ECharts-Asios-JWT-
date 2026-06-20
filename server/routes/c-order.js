import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'

const router = Router()

// 生成订单号
function genOrderId() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${Math.floor(Math.random() * 1000000)}`
}

// 创建订单
router.post('/addOrder', (req, res) => {
  const goodsArr = req.body.arr
  if (!goodsArr || !goodsArr.length) {
    return res.json({ code: 400, data: null, message: '商品列表不能为空' })
  }

  const orderId = genOrderId()
  const goodsName = goodsArr.map(v => v.goods_name).join(',')
  const goodsPrice = goodsArr.map(v => v.goods_price).join(',')
  const goodsNum = goodsArr.map(v => v.goods_num).join(',')
  const goodsImgUrl = goodsArr.map(v => v.goods_imgUrl).join(',')

  const orders = readJSON('c-orders')
  const order = {
    id: orders.length + 1,
    order_id: orderId,
    goods_name: goodsName,
    goods_price: goodsPrice,
    goods_num: goodsNum,
    order_status: '1',
    uld: 1,
    goods_imgUrl: goodsImgUrl
  }
  orders.push(order)
  writeJSON('c-orders', orders)

  res.json({ code: 0, data: [order], message: '订单创建成功' })
})

// 查询订单
router.post('/selectOrder', (req, res) => {
  const orderId = req.body.orderId
  if (!orderId) return res.json({ code: 400, data: null, message: '订单号不能为空' })

  const orders = readJSON('c-orders')
  const result = orders.filter(o => o.order_id === orderId)
  res.json({ code: 0, data: result, message: '查询成功' })
})

// 提交订单（修改订单状态为已支付）
router.post('/submitOrder', (req, res) => {
  const orderId = req.body.orderId
  const shopArr = req.body.shopArr

  const orders = readJSON('c-orders')
  const order = orders.find(o => o.order_id === orderId)
  if (!order) return res.json({ code: 404, data: null, message: '订单不存在' })

  order.order_status = '2'

  // 如果有购物车ID，清空购物车
  if (shopArr && shopArr.length) {
    let cart = readJSON('c-cart')
    const cartIds = shopArr.map(v => v.id || v.cartId)
    cart = cart.filter(c => !cartIds.includes(c.id))
    writeJSON('c-cart', cart)
  }

  writeJSON('c-orders', orders)
  res.json({ code: 0, data: { success: true }, message: '订单提交成功' })
})

// 支付（模拟）
router.post('/payOrder', (req, res) => {
  const { orderId, price, name } = req.body
  res.json({
    code: 0,
    data: {
      success: true,
      paymentUrl: `http://localhost:3001/api/payment-result?orderId=${orderId}&status=success`
    },
    message: '支付中'
  })
})

export default router