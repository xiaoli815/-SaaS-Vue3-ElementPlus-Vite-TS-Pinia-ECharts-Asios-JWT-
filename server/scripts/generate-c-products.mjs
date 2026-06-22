/**
 * 生成 C 端商品数据（c-products.json）
 * 数据来源于 C 端 Mock 生成逻辑，共 30 个商品，带 SKU
 * 运行: node scripts/generate-c-products.mjs
 */
import { faker } from '@faker-js/faker/locale/zh_CN'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

// ========== 商品名称池（按品类分） ==========
const productNamesByCategory = {
  1: [
    'iPhone 15 Pro Max', '华为 Mate 60 Pro', '小米14 Ultra', 'OPPO Find X7',
    'vivo X100 Pro', '三星 Galaxy S24', '一加 12', '荣耀 Magic6 Pro',
    'iPad Pro M4', 'MacBook Air M3', '华为 MatePad Pro', '联想小新 Pro 16',
    'AirPods Pro 2', '华为 FreeBuds Pro 3', '小米手环 8 Pro',
    'Apple Watch Ultra 2', '佳能 EOS R6 Mark II', '索尼 A7M4',
    '大疆 DJI Mini 4 Pro', 'GoPro Hero 12 Black', '任天堂 Switch OLED',
    'PS5 Slim 光驱版', '罗技 G Pro X 机械键盘', '雷蛇 毒蝰 V3 Pro',
    '三星 T7 2TB 移动硬盘'
  ],
  2: [
    'Nike Air Force 1', 'Adidas Ultraboost 轻量跑鞋', '李宁 超轻20 跑鞋',
    '安踏 C37+ 软底跑鞋', '优衣库 轻薄羽绒服', '波司登 极寒系列羽绒服',
    "Levi's 501 经典牛仔裤", '海澜之家 商务休闲西裤', 'FILA 潮流卫衣',
    'MLB 棒球帽', '蕉下 防晒衣', '骆驼 户外冲锋衣',
    'New Balance 574 复古鞋', 'Under Armour 训练T恤', 'ZARA 女士风衣'
  ],
  3: [
    '戴森 V15 吸尘器', '小米 米家扫拖机器人2', '美的 变频空调 1.5匹',
    '格力 云佳 冷暖空调', '海尔 十字对开门冰箱', '西门子 洗碗机 13套',
    '松下 电饭煲 SR-HQ153', '飞利浦 空气炸锅 HD9650', '九阳 破壁机 L18-Y928',
    '苏泊尔 电压力锅', '科沃斯 窗宝 W1S', '追觅 无线洗地机 H20',
    '戴森 空气净化器 HP09', '小米 净水器 1000G', '德龙 全自动咖啡机'
  ],
  4: [
    '兰蔻 小黑瓶精华', '雅诗兰黛 小棕瓶眼霜', 'SK-II 神仙水 230ml',
    '海蓝之谜 面霜 60ml', '赫莲娜 绿宝瓶精华', '资生堂 红腰子精华',
    '完美日记 小细跟口红', '花西子 空气蜜粉', 'MAC 子弹头口红',
    '3CE 九宫格眼影盘', '欧莱雅 紫熨斗眼霜', '科颜氏 高保湿面霜',
    '倩碧 黄油乳液', '蒂佳婷 蓝药丸面膜', 'Tom Ford 乌木沉香香水'
  ],
  5: [
    '三只松鼠 坚果大礼包', '良品铺子 肉脯礼盒', '来伊份 零食大礼包',
    '百草味 每日坚果', '蒙牛 特仑苏纯牛奶', '伊利 安慕希酸奶',
    '三顿半 精品速溶咖啡', '瑞幸 挂耳咖啡', '五粮液 52度 500ml',
    '茅台 飞天53度', '阳澄湖大闸蟹礼券', '海参 大连淡干礼盒',
    '稻香村 糕点礼盒', '元朗 蛋卷王', '德芙 巧克力礼盒'
  ],
  6: [
    '宜家 毕利书架', '全友 真皮沙发', '顾家家居 科技布沙发',
    '林氏家居 北欧床 1.8m', '芝华仕 头等舱功能沙发', '慕思 乳胶床垫',
    '喜临门 独立弹簧床垫', '水星家纺 四件套', '富安娜 蚕丝被',
    '恒洁 智能马桶', '九牧 花洒套装', '欧普 吸顶灯',
    '公牛 轨道插座', '飞利浦 护眼台灯', '网易严选 人体工学椅'
  ],
  7: [
    '花王 纸尿裤 L号', '贝亲 奶瓶 宽口径', '好孩子 婴儿推车',
    'babycare 婴儿腰凳', '全棉时代 婴儿湿巾', '飞鹤 星飞帆 3段奶粉',
    '爱他美 卓萃 2段', '启赋 蕴淳 3段', '乐高 机械组 布加迪',
    '万代 高达模型 MG 自由', '泡泡玛特 盲盒', '迪士尼 玲娜贝儿玩偶',
    '小天才 电话手表 Z9', '牛听听 早教机', '逻辑狗 儿童思维训练'
  ],
  8: [
    '《三体》全集', '《活着》', '《百年孤独》', '《人类简史》',
    '《原则》', '《小王子》', '《哈利·波特》全集', '《盗墓笔记》全集',
    '《新华字典》第12版', '《Python编程从入门到实践》',
    '《JavaScript高级程序设计》', '《深入理解Java虚拟机》',
    '晨光 按动中性笔 24支', '国誉 活页本 B5', '派克 钢笔 IM系列'
  ]
}

// 分类ID到目录名的映射
const categoryToDir = {
  1: 'phone', 2: 'clothes', 3: 'electric', 4: 'cosmetics',
  5: 'food', 6: 'home', 7: 'baby', 8: 'book'
}

// 图片关键字映射
const categoryImages = {
  'iPhone': { category: 'phone', index: 1 }, '华为': { category: 'phone', index: 2 },
  '小米': { category: 'phone', index: 3 }, 'OPPO': { category: 'phone', index: 4 },
  'vivo': { category: 'phone', index: 5 }, '三星': { category: 'phone', index: 6 },
  '一加': { category: 'phone', index: 7 }, '荣耀': { category: 'phone', index: 8 },
  'iPad': { category: 'phone', index: 9 }, 'MacBook': { category: 'phone', index: 10 },
  'AirPods': { category: 'phone', index: 13 }, 'Apple Watch': { category: 'phone', index: 14 },
  '佳能': { category: 'phone', index: 15 }, '索尼': { category: 'phone', index: 15 },
  '大疆': { category: 'phone', index: 15 }, 'GoPro': { category: 'phone', index: 15 },
  '任天堂': { category: 'phone', index: 15 }, 'PS5': { category: 'phone', index: 15 },
  '罗技': { category: 'phone', index: 15 }, '雷蛇': { category: 'phone', index: 15 },
  '移动硬盘': { category: 'phone', index: 15 },
  'Nike': { category: 'clothes', index: 16 }, 'Adidas': { category: 'clothes', index: 17 },
  '李宁': { category: 'clothes', index: 18 }, '安踏': { category: 'clothes', index: 19 },
  '优衣库': { category: 'clothes', index: 20 }, '波司登': { category: 'clothes', index: 21 },
  "Levi's": { category: 'clothes', index: 22 }, '海澜之家': { category: 'clothes', index: 23 },
  'FILA': { category: 'clothes', index: 24 }, 'MLB': { category: 'clothes', index: 25 },
  '蕉下': { category: 'clothes', index: 26 }, '骆驼': { category: 'clothes', index: 27 },
  'New Balance': { category: 'clothes', index: 28 },
  'Under Armour': { category: 'clothes', index: 29 }, 'ZARA': { category: 'clothes', index: 30 },
  '戴森': { category: 'electric', index: 1 }, '米家': { category: 'electric', index: 2 },
  '美的': { category: 'electric', index: 3 }, '格力': { category: 'electric', index: 4 },
  '海尔': { category: 'electric', index: 5 }, '西门子': { category: 'electric', index: 6 },
  '松下': { category: 'electric', index: 7 }, '飞利浦': { category: 'electric', index: 8 },
  '九阳': { category: 'electric', index: 9 }, '苏泊尔': { category: 'electric', index: 10 },
  '科沃斯': { category: 'electric', index: 11 }, '追觅': { category: 'electric', index: 12 },
  '净水器': { category: 'electric', index: 14 }, '德龙': { category: 'electric', index: 15 },
  '兰蔻': { category: 'cosmetics', index: 1 }, '雅诗兰黛': { category: 'cosmetics', index: 2 },
  'SK-II': { category: 'cosmetics', index: 3 }, '海蓝之谜': { category: 'cosmetics', index: 4 },
  '赫莲娜': { category: 'cosmetics', index: 5 }, '资生堂': { category: 'cosmetics', index: 6 },
  '完美日记': { category: 'cosmetics', index: 7 }, '花西子': { category: 'cosmetics', index: 8 },
  'MAC': { category: 'cosmetics', index: 9 }, '3CE': { category: 'cosmetics', index: 10 },
  '欧莱雅': { category: 'cosmetics', index: 11 }, '科颜氏': { category: 'cosmetics', index: 12 },
  '倩碧': { category: 'cosmetics', index: 13 }, '蒂佳婷': { category: 'cosmetics', index: 14 },
  'Tom Ford': { category: 'cosmetics', index: 15 },
  '三只松鼠': { category: 'food', index: 1 }, '良品铺子': { category: 'food', index: 2 },
  '来伊份': { category: 'food', index: 3 }, '百草味': { category: 'food', index: 4 },
  '蒙牛': { category: 'food', index: 5 }, '伊利': { category: 'food', index: 6 },
  '三顿半': { category: 'food', index: 7 }, '瑞幸': { category: 'food', index: 8 },
  '五粮液': { category: 'food', index: 9 }, '茅台': { category: 'food', index: 10 },
  '阳澄湖': { category: 'food', index: 11 }, '海参': { category: 'food', index: 12 },
  '稻香村': { category: 'food', index: 13 }, '元朗': { category: 'food', index: 14 },
  '德芙': { category: 'food', index: 15 },
  '宜家': { category: 'home', index: 1 }, '全友': { category: 'home', index: 2 },
  '顾家': { category: 'home', index: 3 }, '林氏': { category: 'home', index: 4 },
  '芝华仕': { category: 'home', index: 5 }, '慕思': { category: 'home', index: 6 },
  '喜临门': { category: 'home', index: 7 }, '水星': { category: 'home', index: 8 },
  '富安娜': { category: 'home', index: 9 }, '恒洁': { category: 'home', index: 10 },
  '九牧': { category: 'home', index: 11 }, '欧普': { category: 'home', index: 12 },
  '公牛': { category: 'home', index: 13 }, '网易严选': { category: 'home', index: 15 },
  '花王': { category: 'baby', index: 1 }, '贝亲': { category: 'baby', index: 2 },
  '好孩子': { category: 'baby', index: 3 }, 'babycare': { category: 'baby', index: 4 },
  '全棉时代': { category: 'baby', index: 5 }, '飞鹤': { category: 'baby', index: 6 },
  '爱他美': { category: 'baby', index: 7 }, '启赋': { category: 'baby', index: 8 },
  '乐高': { category: 'baby', index: 9 }, '万代': { category: 'baby', index: 10 },
  '泡泡玛特': { category: 'baby', index: 11 }, '迪士尼': { category: 'baby', index: 12 },
  '小天才': { category: 'baby', index: 13 }, '牛听听': { category: 'baby', index: 14 },
  '逻辑狗': { category: 'baby', index: 15 },
  '《三体》': { category: 'book', index: 1 }, '《活着》': { category: 'book', index: 2 },
  '《百年孤独》': { category: 'book', index: 3 }, '《人类简史》': { category: 'book', index: 4 },
  '《原则》': { category: 'book', index: 5 }, '《小王子》': { category: 'book', index: 6 },
  '《哈利·波特》': { category: 'book', index: 7 }, '《盗墓笔记》': { category: 'book', index: 8 },
  '《新华字典》': { category: 'book', index: 9 }, '《Python': { category: 'book', index: 10 },
  '《JavaScript': { category: 'book', index: 11 },
  '《深入理解Java': { category: 'book', index: 12 },
  '晨光': { category: 'book', index: 13 }, '国誉': { category: 'book', index: 14 },
  '派克': { category: 'book', index: 15 }
}

function productImage(name, categoryId = 1) {
  for (const [keyword, mapping] of Object.entries(categoryImages)) {
    if (name.includes(keyword)) {
      return `/images/product/${mapping.category}/product${mapping.index}.jpg`
    }
  }
  const dir = categoryToDir[categoryId] || 'phone'
  const index = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 15) + 1
  return `/images/product/${dir}/product${index}.jpg`
}

function generateSkus(productId, basePrice, productName) {
  const colors = ['曜石黑', '珍珠白', '星空灰', '深海蓝', '樱粉金', '薄荷绿', '落日橙', '雾霾蓝']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL']
  const skus = []
  let id = productId * 1000

  const selectedColors = faker.helpers.arrayElements(colors, faker.number.int({ min: 2, max: 4 }))
  const selectedSizes = faker.helpers.arrayElements(sizes, faker.number.int({ min: 2, max: 4 }))

  selectedColors.forEach(color => {
    selectedSizes.forEach(size => {
      skus.push({
        id: id++,
        productId,
        specs: [
          { name: '颜色', value: color },
          { name: '尺码', value: size }
        ],
        price: Math.round(basePrice + faker.number.int({ min: -10, max: 30 })),
        stock: faker.number.int({ min: 0, max: 200 }),
        image: productImage(productName)
      })
    })
  })

  return skus
}

// ========== 生成 120 个商品 ==========
const productList = []

for (let i = 1; i <= 120; i++) {
  const categoryId = ((i - 1) % 8) + 1
  const namePool = productNamesByCategory[categoryId]
  const name = namePool[(i - 1) % namePool.length]
  const price = parseFloat(faker.commerce.price({ min: 29, max: 5999, dec: 0 }))
  const originalPrice = Math.round(
    price * faker.number.float({ min: 1.1, max: 2.5, fractionDigits: 1 })
  )

  productList.push({
    id: i,
    name,
    desc: faker.commerce.productDescription(),
    price,
    originalPrice: originalPrice > price ? originalPrice : Math.round(price * 1.2),
    image: productImage(name, categoryId),
    images: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () =>
      productImage(name, categoryId)
    ),
    categoryId,
    sales: faker.number.int({ min: 26, max: 15800 }),
    stock: faker.number.int({ min: 0, max: 200 }),
    isFlashSale: i <= 4,
    flashSalePrice:
      i <= 4
        ? Math.round(price * faker.number.float({ min: 0.7, max: 0.9, fractionDigits: 1 }))
        : 0,
    isFavorite: false,
    tags: faker.helpers.arrayElements(
      ['爆款', '新品', '限时特惠', '热卖', '品质优选', '店主推荐', '今日特价', '会员专享'],
      faker.number.int({ min: 1, max: 3 })
    ),
    detail: faker.lorem.paragraphs({ min: 3, max: 6 })
  })
}

// 为每个商品生成 SKU
productList.forEach(p => {
  p.skus = generateSkus(p.id, p.price, p.name)
})

// 写入文件
const outputPath = path.join(DATA_DIR, 'c-products.json')
fs.writeFileSync(outputPath, JSON.stringify(productList, null, 2), 'utf-8')

console.log(`✅ 已生成 ${productList.length} 个商品到 c-products.json`)
console.log(`   路径: ${outputPath}`)
