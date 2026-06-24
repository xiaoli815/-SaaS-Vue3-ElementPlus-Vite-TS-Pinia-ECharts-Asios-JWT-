import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'

const router = Router()

// ==================== 数据工具 ====================

// 加载C端商品数据（从 c-products.json 读取，数据以C端Mock为主）
function loadCProducts() {
  return readJSON('c-products')
}

// 将 B端同步的商品数据格式化为 C端前端组件期望的格式
function formatProductForC(p) {
  if (!p) return p
  // C端 ProductDetail 组件用 mainImages 做轮播图
  const mainImages = p.images && p.images.length > 0 ? p.images : [p.image || '']
  // C端 SkuPopUp 组件用 skuList (字段名: skuId, specName, specValue)
  const skuList = (p.skus || []).map(sku => ({
    skuId: sku.id || sku.skuId,
    productId: sku.productId || p.id,
    price: sku.price || p.price,
    stock: sku.stock || 0,
    specs: (sku.specs || []).map(s => ({
      specName: s.name || s.specName || '规格',
      specValue: s.value || s.specValue || ''
    }))
  }))
  return {
    ...p,
    mainImages,
    skuList,
    salesCount: p.sales || 0,
    description: p.desc || p.description || p.detail || ''
  }
}

// ==================== 首页 ====================

// 轮播图
router.get('/home/banners', (req, res) => {
  const banners = [
    { id: 1, imageUrl: '/images/banner1.jpg', link: '/product/list?category=1' },
    { id: 2, imageUrl: '/images/banner2.jpg', link: '/product/list?category=2' },
    { id: 3, imageUrl: '/images/banner3.jpg', link: '/product/list?category=3' },
    { id: 4, imageUrl: '/images/banner4.jpg', link: '/flash' }
  ]
  res.json({ code: 200, msg: 'success', data: banners })
})

// 热门商品
router.get('/home/hot', (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1)
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 20)
  const products = loadCProducts()
  const sorted = [...products].sort((a, b) => (b.sales || 0) - (a.sales || 0))
  const start = (page - 1) * pageSize
  const list = sorted.slice(start, start + pageSize).map(formatProductForC)
  res.json({ code: 200, msg: 'success', data: { list, total: sorted.length, page, pageSize } })
})

// ==================== 商品 ====================

// 商品列表
router.get('/products', (req, res) => {
  const keyword = (req.query.keyword || '').toLowerCase()
  const categoryId = Number(req.query.categoryId) || 0
  let products = loadCProducts()
  if (keyword) products = products.filter(p => p.name.toLowerCase().includes(keyword))
  if (categoryId) products = products.filter(p => p.categoryId === categoryId)
  const list = products.map(formatProductForC)
  res.json({ code: 200, msg: 'success', data: { list, total: products.length } })
})

// 商品详情
router.get('/goods/detail', (req, res) => {
  const goodsId = Number(req.query.goodsId)
  const products = loadCProducts()
  const product = products.find(p => p.id === goodsId)
  if (!product) return res.json({ code: 404, msg: '商品不存在', data: null })
  res.json({ code: 200, msg: 'success', data: formatProductForC(product) })
})

// 单个商品
router.get('/products/:id', (req, res) => {
  const products = loadCProducts()
  const product = products.find(p => p.id === Number(req.params.id))
  if (!product) return res.json({ code: 404, msg: '商品不存在', data: null })
  res.json({ code: 200, msg: 'success', data: formatProductForC(product) })
})

// 收藏/取消收藏
router.post('/products/:id/favorite', (req, res) => {
  res.json({ code: 200, msg: 'success', data: true })
})

// ==================== 分类 ====================

router.get('/category/list', (req, res) => {
  const categories = [
    { id: 1, name: '手机数码', icon: 'phone-o', children: [
      { id: 101, name: '手机' }, { id: 102, name: '平板电脑' }, { id: 103, name: '笔记本' },
      { id: 104, name: '耳机/音箱' }, { id: 105, name: '智能穿戴' }, { id: 106, name: '相机/摄像机' },
      { id: 107, name: '游戏设备' }, { id: 108, name: '电脑外设' }
    ]},
    { id: 2, name: '服装鞋帽', icon: 'bag-o', children: [
      { id: 201, name: '男装' }, { id: 202, name: '女装' }, { id: 203, name: '运动鞋' },
      { id: 204, name: '休闲鞋' }, { id: 205, name: '羽绒服/棉服' }, { id: 206, name: '卫衣/针织衫' },
      { id: 207, name: '帽子/配饰' }, { id: 208, name: '户外服饰' }
    ]},
    { id: 3, name: '家用电器', icon: 'tv-o', children: [
      { id: 301, name: '空调' }, { id: 302, name: '冰箱' }, { id: 303, name: '洗衣机' },
      { id: 304, name: '厨房电器' }, { id: 305, name: '清洁电器' }, { id: 306, name: '生活电器' },
      { id: 307, name: '个护电器' }, { id: 308, name: '净水设备' }
    ]},
    { id: 4, name: '美妆护肤', icon: 'gem-o', children: [
      { id: 401, name: '面部精华' }, { id: 402, name: '眼霜/眼精华' }, { id: 403, name: '化妆水/爽肤水' },
      { id: 404, name: '面霜/乳液' }, { id: 405, name: '口红/唇釉' }, { id: 406, name: '面膜' },
      { id: 407, name: '防晒' }, { id: 408, name: '香水' }
    ]},
    { id: 5, name: '食品饮料', icon: 'star-o', children: [
      { id: 501, name: '休闲零食' }, { id: 502, name: '坚果炒货' }, { id: 503, name: '乳品饮料' },
      { id: 504, name: '咖啡/茶饮' }, { id: 505, name: '酒类' }, { id: 506, name: '生鲜水果' },
      { id: 507, name: '糕点礼盒' }, { id: 508, name: '进口食品' }
    ]},
    { id: 6, name: '家居家装', icon: 'home-o', children: [
      { id: 601, name: '家具' }, { id: 602, name: '沙发' }, { id: 603, name: '床/床垫' },
      { id: 604, name: '家纺' }, { id: 605, name: '卫浴' }, { id: 606, name: '灯具' },
      { id: 607, name: '收纳' }, { id: 608, name: '办公家具' }
    ]},
    { id: 7, name: '母婴用品', icon: 'contact-o', children: [
      { id: 701, name: '奶粉' }, { id: 702, name: '纸尿裤' }, { id: 703, name: '婴儿推车' },
      { id: 704, name: '奶瓶/餐具' }, { id: 705, name: '湿巾/洗护' }, { id: 706, name: '玩具' },
      { id: 707, name: '童装' }, { id: 708, name: '早教' }
    ]},
    { id: 8, name: '图书文娱', icon: 'bookmark-o', children: [
      { id: 801, name: '文学小说' }, { id: 802, name: '经管励志' }, { id: 803, name: '少儿读物' },
      { id: 804, name: '科技编程' }, { id: 805, name: '文具用品' }, { id: 806, name: '运动户外' },
      { id: 807, name: '乐器' }, { id: 808, name: '宠物用品' }
    ]}
  ]
  res.json({ code: 200, msg: 'success', data: categories })
})

router.get('/category/goods', (req, res) => {
  const categoryId = Number(req.query.categoryId)
  const page = Math.max(Number(req.query.page) || 1, 1)
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 20)
  const products = loadCProducts()
  const filtered = categoryId ? products.filter(p => p.categoryId === categoryId) : products
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize).map(formatProductForC)
  res.json({ code: 200, msg: 'success', data: { list, total: filtered.length } })
})

// ==================== 购物车 ====================

let cartData = []
let cartIdCounter = 1

// 从文件加载购物车
function loadCart() {
  try { cartData = readJSON('c-cart') } catch { cartData = [] }
  cartIdCounter = cartData.length > 0 ? Math.max(...cartData.map(c => c.cartId || 0)) + 1 : 1
}
loadCart()

function saveCart() { writeJSON('c-cart', cartData) }

router.get('/cart', (req, res) => {
  loadCart()
  const list = cartData.map(item => ({
    cartId: item.cartId || item.id,
    skuId: item.skuId || 0,
    goodsId: item.goodsId || 0,
    name: item.name || '',
    image: item.image || '',
    price: item.price || 0,
    specText: item.specText || '',
    count: item.count || 1,
    stock: item.stock || 999,
    checked: item.checked !== undefined ? item.checked : true
  }))
  res.json({ code: 200, msg: 'success', data: list })
})

router.post('/cart/add', (req, res) => {
  loadCart()
  const { skuId, goodsId, count, name, image, price, specText } = req.body
  const exist = cartData.find(item => item.skuId === skuId && item.goodsId === goodsId)
  if (exist) {
    exist.count = (exist.count || 0) + (count || 1)
  } else {
    cartData.push({
      cartId: cartIdCounter++,
      skuId: skuId || 0,
      goodsId: goodsId || 0,
      count: count || 1,
      checked: true,
      name: name || '',
      image: image || '',
      price: price || 0,
      specText: specText || ''
    })
  }
  saveCart()
  res.json({ code: 200, msg: '加入购物车成功', data: null })
})

router.post('/cart/clear', (req, res) => {
  const { ids } = req.body
  loadCart()
  if (ids && ids.length) {
    cartData = cartData.filter(item => !ids.includes(String(item.cartId)))
  } else {
    cartData = []
  }
  saveCart()
  res.json({ code: 200, msg: 'success', data: null })
})

// ==================== 订单 ====================

function loadOrders() {
  try { return readJSON('c-orders') } catch { return [] }
}

function saveOrders(data) {
  writeJSON('c-orders', data)
}

/** 从请求 Token 中提取 userId */
function getUserId(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  const match = token.match(/^token_(\d+)_/)
  return match ? Number(match[1]) : 1
}

router.get('/order/list', (req, res) => {
  const orders = loadOrders()
  const status = req.query.status
  const userId = getUserId(req)
  // 按用户过滤，只返回当前用户的订单
  let list = orders.filter(o => o.userId === userId || o.userId === undefined)
  if (status) list = list.filter(o => o.status === Number(status))
  res.json({ code: 200, msg: 'success', data: { list, total: list.length } })
})

router.post('/order/pre', (req, res) => {
  const { cartIds } = req.body
  loadCart()
  let goodsList = []
  if (cartIds && cartIds.length) {
    goodsList = cartData.filter(item => cartIds.includes(item.cartId))
  } else {
    goodsList = cartData.filter(item => item.checked)
  }
  const goods = goodsList.map(item => ({
    goodsId: item.goodsId,
    skuId: item.skuId,
    name: item.name,
    image: item.image,
    price: item.price,
    count: item.count,
    specText: item.specText || '暂无规格'
  }))
  const totalAmount = goods.reduce((sum, g) => sum + g.price * g.count, 0)
  res.json({
    code: 200, msg: 'success',
    data: { goods, totalAmount, discountAmount: 0, finalAmount: totalAmount }
  })
})

router.post('/order/submit', (req, res) => {
  const { goods, addressId, totalAmount, remark } = req.body
  const orders = loadOrders()
  const orderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1
  const userId = getUserId(req)
  const order = {
    id: orderId,
    orderId: String(orderId),
    goods,
    addressId: addressId || 1,
    totalAmount: totalAmount || 0,
    status: 1,
    userId,
    createTime: new Date().toISOString(),
    remark: remark || ''
  }
  orders.push(order)
  saveOrders(orders)
  cartData = []
  saveCart()
  res.json({ code: 200, msg: '下单成功', data: { orderId: order.orderId, order } })
})

router.post('/order/cancel', (req, res) => {
  const orders = loadOrders()
  const idx = orders.findIndex(o => o.orderId === String(req.body.orderid))
  if (idx > -1) orders[idx].status = 4
  saveOrders(orders)
  res.json({ code: 200, msg: 'success', data: null })
})

router.post('/order/confirm', (req, res) => {
  const orders = loadOrders()
  const idx = orders.findIndex(o => o.orderId === String(req.body.orderid))
  if (idx > -1) orders[idx].status = 3
  saveOrders(orders)
  res.json({ code: 200, msg: 'success', data: null })
})

// ==================== 用户 ====================

router.post('/user/login', (req, res) => {
  const { username, password } = req.body
  const users = readJSON('c-users')
  const user = users.find(u => u.phone === username || u.tel === username || u.nickname === username)
  if (!user || user.password !== password) {
    return res.json({ code: 401, msg: '用户名或密码错误', data: null })
  }
  const token = 'token_' + user.id + '_' + Date.now()
  res.json({
    code: 200, msg: 'success',
    data: { token, userId: user.id, nickname: user.nickname, avatar: user.avatar }
  })
})

router.get('/user/info', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  // 从 token 中提取 userId（格式：token_<id>_<timestamp>）
  const match = token.match(/^token_(\d+)_/)
  const userId = match ? Number(match[1]) : 1
  const users = readJSON('c-users')
  const user = users.find(u => u.id === userId) || users[0]
  res.json({
    code: 200, msg: 'success',
    data: { id: user.id, nickname: user.nickname, avatar: user.avatar, phone: user.phone }
  })
})

router.post('/user/logout', (req, res) => {
  res.json({ code: 200, msg: 'success', data: null })
})

// ==================== 秒杀 ====================

// 从 B 端 seckill.json 读取秒杀活动，关联 c-products 商品详情
function loadBSeckillItems() {
  const seckillList = readJSON('seckill')
  const products = loadCProducts()

  return seckillList.map((sk, idx) => {
    const product = products.find(p => p.id === sk.productId) || products[0]
    const formatted = formatProductForC(product)
    // 生成接近当前时间的秒杀时段（现在+1h → 现在+3h）
    const now = Date.now()
    const startMs = now + 3600000  // 1小时后开始
    const endMs = now + 10800000  // 3小时后结束

    return {
      seckillId: sk.id,
      title: sk.name,
      goodsId: sk.productId,
      image: formatted.image || '',
      mainImages: formatted.mainImages || [formatted.image || ''],
      description: formatted.description || '',
      originalPrice: formatted.originalPrice || formatted.price,
      seckillPrice: sk.seckillPrice,
      startTime: new Date(startMs).toISOString(),
      endTime: new Date(endMs).toISOString(),
      totalStock: sk.stock || 0,
      remainStock: Math.floor(sk.stock * (1 - idx * 0.1)),
      limitCount: sk.limitPerUser || 1,
      soldCount: Math.floor(sk.stock * idx * 0.1),
      status: sk.status,  // 0=未开始 1=进行中 2=已结束
      skuList: (formatted.skuList || []).map(sku => ({
        ...sku,
        seckillPrice: Math.floor((sku.price || sk.seckillPrice) * 0.8),
        remainStock: sku.stock || 0
      }))
    }
  })
}

router.get('/seckill/list', (req, res) => {
  const seckillList = loadBSeckillItems()
  res.json({ code: 200, msg: 'success', data: seckillList })
})

router.get('/seckill/detail', (req, res) => {
  const seckillId = Number(req.query.seckillId)
  const seckillList = loadBSeckillItems()
  const item = seckillList.find(s => s.seckillId === seckillId)
  if (!item) return res.json({ code: 404, msg: '秒杀活动不存在', data: null })
  res.json({ code: 200, msg: 'success', data: item })
})

// ==================== 优惠券 ====================

// 将 B 端优惠券/满减活动转为 C 端 Coupon 格式
function convertBCouponToC(bCoupon) {
  const now = Date.now()
  // B 端测试数据日期较旧，统一调整为当前时间附近的未来日期
  const startAt = now + 3600000             // 1小时后开始
  const endAt = now + 86400000 * 60          // 60天后过期
  const isUsable = bCoupon.status === 1      // status=1 表示可用

  // type: B端 1=满减券 2=直减券 3=折扣券
  let type, value, discount
  if (bCoupon.type === 3 || bCoupon.typeText === '折扣券') {
    type = '折扣'
    value = 90  // 默认 9折
    discount = value * 10  // 900
  } else if (bCoupon.type === 2 || bCoupon.typeText === '直减券') {
    type = '无门槛'
    value = bCoupon.value || 0
    discount = value * 100
  } else {
    // 满减券 (type=1) 或满减活动
    type = '满减'
    value = bCoupon.value || bCoupon.reduceAmount || 0
    discount = value * 100
  }

  return {
    id: bCoupon.id,
    name: bCoupon.name,
    type,
    value,
    minUseAmount: bCoupon.minAmount || bCoupon.fullAmount || 0,
    startAt,
    endAt,
    description: bCoupon.name,
    category: '店铺券',
    productIds: [],
    stackRule: 'stackable',
    isUsable,
    discount,
    minOrderAmount: (bCoupon.minAmount || bCoupon.fullAmount || 0) * 100,
    valid: isUsable,
    reason: !isUsable ? (bCoupon.statusText || '') : '',
    expireTime: new Date(endAt).toISOString(),
    collected: false
  }
}

// 加载优惠券数据（合并 B端 coupon.json + full-reduction.json + 已有 c-coupons.json）
function loadCoupons() {
  const cCoupons = readJSON('c-coupons')      // 已有 C 端优惠券
  const bCoupons = readJSON('coupon')           // B 端运营优惠券
  const bFullReduction = readJSON('full-reduction') // B 端满减活动

  const convertedBCoupons = bCoupons.map(convertBCouponToC)
  const convertedBFull = bFullReduction.map(fr => convertBCouponToC({
    ...fr,
    type: 1,
    typeText: '满减券',
    value: fr.reduceAmount,
    minAmount: fr.fullAmount
  }))

  // 去重：B端转换的优惠券优先，同名不同ID都保留；通过 id 去重
  const allCoupons = [...convertedBCoupons, ...convertedBFull]
  const existingIds = new Set(allCoupons.map(c => c.id))
  const merged = [
    ...allCoupons,
    ...cCoupons.filter(c => !existingIds.has(c.id))
  ]
  return merged
}

// 加载用户已领取优惠券
function loadCollectedCoupons() {
  try { return readJSON('c-collected-coupons') } catch { return {} }
}

// 获取优惠券列表（优惠券中心）
router.get('/coupons/list', (req, res) => {
  const coupons = loadCoupons()
  const collected = loadCollectedCoupons()
  const userId = String(getUserId(req))
  const collectedIds = collected[userId] || []
  const data = coupons.map(c => ({ ...c, collected: collectedIds.includes(c.id) }))
  res.json({ code: 200, msg: 'success', data })
})

// 获取指定商品可用优惠券
router.get('/coupons/product/:productId', (req, res) => {
  const productId = Number(req.params.productId)
  const coupons = loadCoupons()
  const collected = loadCollectedCoupons()
  const userId = String(getUserId(req))
  const collectedIds = collected[userId] || []
  const now = Date.now()

  const productCoupons = coupons.filter(coupon => {
    if (coupon.category === '平台券') return false
    if (!coupon.productIds || !coupon.productIds.includes(productId)) return false
    if (now > coupon.endAt) return false
    return true
  }).map(c => ({ ...c, collected: collectedIds.includes(c.id) }))

  res.json({ code: 200, msg: 'success', data: productCoupons })
})

// 获取可用优惠券（结算页，按金额过滤）
router.get('/coupons/available', (req, res) => {
  const amount = Number(req.query.amount) || 0
  const coupons = loadCoupons()
  const collected = loadCollectedCoupons()
  const userId = String(getUserId(req))
  const collectedIds = collected[userId] || []
  const now = Date.now()

  const available = coupons.filter(coupon => {
    if (!collectedIds.includes(coupon.id)) return false
    if (now > coupon.endAt) return false
    if (!coupon.isUsable) return false
    if (amount < coupon.minUseAmount) return false
    return true
  })

  res.json({ code: 200, msg: 'success', data: available })
})

// 领取优惠券
router.post('/coupons/collect', (req, res) => {
  const { id } = req.body
  const coupons = loadCoupons()
  const collected = loadCollectedCoupons()
  const userId = String(getUserId(req))

  const coupon = coupons.find(c => c.id === id)
  if (!coupon) return res.json({ code: 404, msg: '优惠券不存在', data: null })
  if (Date.now() > coupon.endAt) return res.json({ code: 400, msg: '优惠券已过期', data: null })

  if (!collected[userId]) collected[userId] = []
  if (collected[userId].includes(id)) return res.json({ code: 400, msg: '已领取过该优惠券', data: null })

  collected[userId].push(id)
  writeJSON('c-collected-coupons', collected)
  res.json({ code: 200, msg: '领取成功', data: null })
})

// 我的优惠券
router.get('/coupons/my', (req, res) => {
  const coupons = loadCoupons()
  const collected = loadCollectedCoupons()
  const userId = String(getUserId(req))
  const collectedIds = collected[userId] || []
  const myCoupons = coupons.filter(c => collectedIds.includes(c.id)).map(c => ({ ...c, collected: true }))
  res.json({ code: 200, msg: 'success', data: myCoupons })
})

// 使用优惠券
router.post('/coupons/use', (req, res) => {
  const { id } = req.body
  const collected = loadCollectedCoupons()
  const userId = String(getUserId(req))
  const userCoupons = collected[userId] || []
  if (!userCoupons.includes(id)) return res.json({ code: 400, msg: '未领取该优惠券', data: null })
  collected[userId] = userCoupons.filter(cid => cid !== id)
  writeJSON('c-collected-coupons', collected)
  res.json({ code: 200, msg: '使用成功', data: null })
})

// ==================== 地址 ====================

let addressList = [
  { id: 1, receiverName: '张三', phone: '13800138001', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园路1号创新大厦A栋1502室', isDefault: true },
  { id: 2, receiverName: '李四', phone: '13900139002', province: '北京市', city: '北京市', district: '朝阳区', detail: '望京街道望京SOHO T1 2001', isDefault: false },
  { id: 3, receiverName: '王五', phone: '13700137003', province: '上海市', city: '上海市', district: '浦东新区', detail: '张江高科技园区博云路2号', isDefault: false }
]
let addressIdCounter = 4

router.get('/address/list', (req, res) => {
  res.json({ code: 200, msg: 'success', data: addressList })
})

router.post('/address/save', (req, res) => {
  const body = req.body
  if (body.id) {
    const idx = addressList.findIndex(a => a.id === body.id)
    if (idx > -1) {
      addressList[idx] = { ...addressList[idx], ...body }
      if (body.isDefault) {
        addressList.forEach(a => { if (a.id !== body.id) a.isDefault = false })
      }
    }
  } else {
    const newAddr = { id: addressIdCounter++, ...body, isDefault: body.isDefault || false }
    if (newAddr.isDefault) addressList.forEach(a => a.isDefault = false)
    addressList.push(newAddr)
  }
  res.json({ code: 200, msg: 'success', data: null })
})

router.delete('/address/delete', (req, res) => {
  const id = Number(req.query.id)
  addressList = addressList.filter(a => a.id !== id)
  res.json({ code: 200, msg: 'success', data: null })
})

router.post('/address/setDefault/:id', (req, res) => {
  const id = Number(req.params.id)
  addressList.forEach(a => a.isDefault = a.id === id)
  res.json({ code: 200, msg: 'success', data: null })
})

// ==================== 搜索 ====================

router.get('/search/suggestions', (req, res) => {
  const keyword = (req.query.keyword || '').trim()
  if (!keyword) return res.json([])
  res.json([
    { keyword: `${keyword}手机`, count: 1234 },
    { keyword: `${keyword}电脑`, count: 890 },
    { keyword: `${keyword}耳机`, count: 567 },
    { keyword: `${keyword}充电器`, count: 345 },
    { keyword: `${keyword}数据线`, count: 234 }
  ])
})

router.get('/search/products', (req, res) => {
  const keyword = (req.query.keyword || '').trim()
  if (!keyword) return res.json({ code: 200, msg: 'success', data: { list: [], total: 0 } })
  const products = loadCProducts()
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
  const list = filtered.map(formatProductForC)
  res.json({ code: 200, msg: 'success', data: { list, total: filtered.length } })
})

// ==================== 运费计算 ====================

// 加载运费规则
function loadShippingRules() {
  return readJSON('c-shipping-rules')
}

// 省份名称 → 编码映射表（用于运费计算）
const PROVINCE_CODE_MAP = {
  '北京市': '110000', '天津市': '120000', '河北省': '130000', '山西省': '140000',
  '内蒙古自治区': '150000', '辽宁省': '210000', '吉林省': '220000', '黑龙江省': '230000',
  '上海市': '310000', '江苏省': '320000', '浙江省': '330000', '安徽省': '340000',
  '福建省': '350000', '江西省': '360000', '山东省': '370000', '河南省': '410000',
  '湖北省': '420000', '湖南省': '430000', '广东省': '440000', '广西壮族自治区': '450000',
  '海南省': '460000', '重庆市': '500000', '四川省': '510000', '贵州省': '520000',
  '云南省': '530000', '西藏自治区': '540000', '陕西省': '610000', '甘肃省': '620000',
  '青海省': '630000', '宁夏回族自治区': '640000', '新疆维吾尔自治区': '650000'
}

// 根据省份名称获取编码
function getProvinceCode(province) {
  return PROVINCE_CODE_MAP[province] || null
}

/**
 * 运费计算接口
 * POST /api/c/shipping/calculate
 * Body: { addressId, items: [{ goodsId, skuId, count, price, weight? }] }
 */
router.post('/shipping/calculate', (req, res) => {
  const { addressId, items } = req.body || {}
  console.log('[运费计算] 入参:', { addressId, items })
  if (!addressId || !items || !items.length) {
    return res.json({ code: 400, msg: '参数不完整', data: null })
  }

  // 获取地址省份编码
  const address = addressList.find(a => a.id === Number(addressId))
  let provinceCode = '*'
  if (!address) {
    console.warn('[运费计算] 地址不存在，使用全国通用规则:', addressId)
  } else {
    provinceCode = getProvinceCode(address.province) || '*'
    console.log('[运费计算] 省份:', address.province, '编码:', provinceCode)
  }

  // 获取运费规则
  const rules = loadShippingRules()

  // 计算订单金额
  const orderAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.count || 1), 0)

  // 计算总重量
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0.5) * (item.count || 1), 0)

  // 获取商品所属店铺ID（从商品数据中查找第一个商品的店铺）
  let storeId = null
  if (items.length > 0) {
    const products = loadCProducts()
    const firstProduct = products.find(p => p.id === Number(items[0].goodsId))
    if (firstProduct) {
      storeId = firstProduct.storeId || null
    }
  }

  // 规则优先级：店铺包邮 > 地区运费 > 满额包邮 > 按重量计费
  const priorityMap = { store: 1, area: 2, amount: 3, weight: 4 }

  const matchedRules = rules
    .filter(r => r.status)  // 只取启用规则
    .filter(r => {
      // 省份匹配：'*' 表示全国，否则精确匹配
      return r.provinceCodes.includes('*') || r.provinceCodes.includes(provinceCode)
    })
    .filter(r => {
      // 店铺规则只匹配对应店铺
      if (r.type === 'store' && r.storeId !== null) {
        return r.storeId === storeId
      }
      return true
    })
    .sort((a, b) => (priorityMap[a.type] || 99) - (priorityMap[b.type] || 99))

  if (matchedRules.length === 0) {
    return res.json({
      code: 200, msg: 'success',
      data: { fee: 0, freeAmount: 0, appliedRule: null, isFree: true }
    })
  }

  const rule = matchedRules[0]  // 取优先级最高的规则
  let fee = 0
  let freeAmount = 0
  let isFree = false

  switch (rule.type) {
    case 'store':
      // 店铺包邮
      isFree = true
      break

    case 'area':
      if (rule.freeThreshold > 0 && orderAmount >= rule.freeThreshold) {
        isFree = true
      } else {
        fee = rule.baseFee
        freeAmount = rule.freeThreshold > 0 ? rule.freeThreshold - orderAmount : 0
      }
      break

    case 'amount':
      if (orderAmount >= rule.freeThreshold) {
        isFree = true
      } else {
        fee = rule.baseFee
        freeAmount = rule.freeThreshold - orderAmount
      }
      break

    case 'weight':
      const weight = Math.max(totalWeight, rule.minWeight || 1)
      const calcFee = Math.max(rule.baseFee, Math.ceil(weight * (rule.weightRate || 200)))
      if (rule.freeThreshold > 0 && orderAmount >= rule.freeThreshold) {
        isFree = true
      } else {
        fee = calcFee
        freeAmount = rule.freeThreshold > 0 ? rule.freeThreshold - orderAmount : 0
      }
      break
  }

  res.json({
    code: 200, msg: 'success',
    data: { fee, freeAmount, appliedRule: rule, isFree }
  })
})

// ==================== 收藏 ====================

let favoriteData = {} // { [userId]: [productId, ...] }

function loadFavorites() {
  try { favoriteData = readJSON('c-favorites') } catch { favoriteData = {} }
}
function saveFavorites() { writeJSON('c-favorites', favoriteData) }
loadFavorites()

router.get('/favorites', (req, res) => {
  const userId = String(getUserId(req))
  const productIds = favoriteData[userId] || []
  const products = loadCProducts()
  const list = products.filter(p => productIds.includes(p.id)).map(formatProductForC)
  res.json({ code: 200, msg: 'success', data: list })
})

// ==================== 地址详情 ====================

router.get('/address/detail', (req, res) => {
  const id = Number(req.query.id)
  const address = addressList.find(a => a.id === id)
  if (!address) return res.json({ code: 404, msg: '地址不存在', data: null })
  res.json({ code: 200, msg: 'success', data: address })
})

export default router