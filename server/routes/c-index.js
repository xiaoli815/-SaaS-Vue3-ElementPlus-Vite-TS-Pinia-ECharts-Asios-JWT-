import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'

const router = Router()

// 首页数据
router.get('/index', (req, res) => {
  const sortList = readJSON('c-sort')
  const goodsList = readJSON('c-goods')
  res.json({ code: 0, data: { sortList, goodsList }, message: '查询成功' })
})

// 通过商品ID查询
router.get('/goods/id', (req, res) => {
  const id = parseInt(req.query.id)
  const goods = readJSON('c-goods')
  const sortList = readJSON('c-sortList')
  const all = [...goods, ...sortList]
  const item = all.find(g => g.id === id)
  if (!item) return res.json({ code: 404, data: null, message: '商品不存在' })
  res.json({ code: 0, data: item, message: '查询成功' })
})

// 搜索商品列表
router.get('/goods/shopList', (req, res) => {
  const searchName = (req.query.searchName || '').toLowerCase()
  const goods = readJSON('c-goods')
  const list = searchName
    ? goods.filter(g => g.name.toLowerCase().includes(searchName))
    : goods
  res.json({ code: 0, data: { list }, message: '查询成功' })
})

// 分类页面数据
router.get('/goods/list', (req, res) => {
  const goods = readJSON('c-goods')
  const mockCategories = [
    { id: 1, name: '上衣', data: [] },
    { id: 2, name: '裤子', data: [] },
    { id: 3, name: '裙子', data: [] },
    { id: 4, name: '套装', data: [] },
    { id: 5, name: '配饰', data: [] }
  ]
  goods.forEach((item, index) => {
    const categoryIndex = index % mockCategories.length
    mockCategories[categoryIndex].data.push({ id: item.id, name: item.name, imgUrl: item.imgUrl })
  })
  res.json({ code: 0, data: mockCategories, message: '查询成功' })
})

// 分类列表
router.get('/goods/sortList', (req, res) => {
  const sortList = readJSON('c-sortList')
  res.json({ code: 0, data: sortList, message: '查询成功' })
})

export default router