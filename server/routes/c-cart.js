import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'

const router = Router()

// 查询购物车
router.get('/', (req, res) => {
  const cart = readJSON('c-cart')
  res.json({ code: 0, data: cart, message: '查询成功' })
})

// 添加购物车
router.post('/addCart', (req, res) => {
  const goodsId = parseInt(req.body.goodsId)
  const goods = readJSON('c-goods')
  const sortList = readJSON('c-sortList')
  const all = [...goods, ...sortList]
  const item = all.find(g => g.id === Math.abs(goodsId))

  if (!item) {
    return res.json({ code: 404, data: null, message: '商品不存在' })
  }

  const cart = readJSON('c-cart')
  const exist = cart.find(c => c.goods_id === goodsId)

  if (exist) {
    exist.goods_num = (exist.goods_num || 1) + 1
  } else {
    cart.push({
      id: Date.now() % 1000000000,
      uld: 1,
      goods_id: goodsId,
      goods_name: item.name,
      goods_price: item.price,
      goods_num: 1,
      goods_imgUrl: item.UrlImg || item.imgUrl
    })
  }

  writeJSON('c-cart', cart)
  res.json({ code: 0, data: { success: true }, message: '已添加到购物车' })
})

// 删除购物车商品
router.post('/delete', (req, res) => {
  const cartId = parseInt(req.body.cartId)
  let cart = readJSON('c-cart')
  cart = cart.filter(c => c.id !== cartId)
  writeJSON('c-cart', cart)
  res.json({ code: 0, data: null, message: '删除成功' })
})

// 更新购物车数量
router.post('/updateQuantity', (req, res) => {
  const cartId = parseInt(req.body.cartId)
  const goodsNum = parseInt(req.body.goodsNum)
  const cart = readJSON('c-cart')
  const item = cart.find(c => c.id === cartId)
  if (!item) return res.json({ code: 404, data: null, message: '商品不存在' })
  item.goods_num = goodsNum
  writeJSON('c-cart', cart)
  res.json({ code: 0, data: null, message: '更新成功' })
})

export default router