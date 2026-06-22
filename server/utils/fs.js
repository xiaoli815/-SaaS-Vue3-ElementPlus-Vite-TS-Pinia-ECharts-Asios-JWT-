import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

/**
 * B端订单状态 → C端订单状态 映射
 */
const STATUS_MAP = {
  0: 1,   // 待确认 → 待付款
  1: 2,   // 待发货 → 待发货
  2: 3,   // 已发货 → 运输中
  3: 4,   // 已完成 → 已完成
  4: 5,   // 售后中 → 售后中
  5: 6,   // 已取消 → 已取消
}

/**
 * 构建 productId → cover image 映射表（从 products.json 读取）
 */
function buildProductImageMap() {
  try {
    const products = readJSON('products.json')
    const map = {}
    for (const p of products) {
      map[p.id] = p.cover || ''
    }
    return map
  } catch {
    return {}
  }
}

/**
 * 将 B端订单格式 转换为 C端订单格式
 */
function convertOrderToCFormat(bOrder, productImageMap) {
  return {
    id: bOrder.id,
    orderId: bOrder.orderNo,
    goods: (bOrder.items || []).map(item => ({
      goodsId: item.productId,
      name: item.productName,
      image: productImageMap[item.productId] || '/images/product/default.jpg',
      price: item.price,
      count: item.quantity,
      specText: item.skuSpecs || '',
    })),
    addressId: 1,
    totalAmount: bOrder.payAmount || bOrder.totalAmount,
    status: STATUS_MAP[bOrder.status] || 1,
    createTime: bOrder.createTime,
    remark: bOrder.remark || '',
    userId: bOrder.userId || 1,
    userName: bOrder.userName || '',
    userPhone: bOrder.userPhone || '',
    receiverName: bOrder.receiverName || '',
    receiverPhone: bOrder.receiverPhone || '',
    receiverAddress: bOrder.receiverAddress || '',
    payType: bOrder.payType || '',
    logistics: bOrder.logistics || null,
  }
}

/**
 * 同步 orders.json 到 c-orders.json
 */
function syncOrdersToC() {
  try {
    const bOrders = readJSON('orders.json')
    const cOrders = readJSON('c-orders.json')
    const productImageMap = buildProductImageMap()

    const existingIds = new Set(cOrders.map(o => o.orderId))
    const newOrders = bOrders.filter(o => !existingIds.has(o.orderNo))

    if (newOrders.length > 0) {
      const converted = newOrders.map(o => convertOrderToCFormat(o, productImageMap))
      const updatedCOrders = [...cOrders, ...converted]
      fs.writeFileSync(
        path.join(DATA_DIR, 'c-orders.json'),
        JSON.stringify(updatedCOrders, null, 2),
        'utf-8'
      )
      console.log(`[Sync] 已同步 ${newOrders.length} 个订单到 c-orders.json`)
    }
  } catch (err) {
    console.error('[Sync Error] 订单同步失败:', err.message)
  }
}

/**
 * 读取 JSON 数据文件
 */
export function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename.endsWith('.json') ? filename : `${filename}.json`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

/**
 * 写入 JSON 数据文件
 */
export function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename.endsWith('.json') ? filename : `${filename}.json`)
  const normalizedFilename = filename.endsWith('.json') ? filename : `${filename}.json`
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

  if (normalizedFilename === 'orders.json') {
    syncOrdersToC()
  }
}

/**
 * 全量同步（应用启动时调用）
 */
export function fullSyncOrders() {
  console.log('[Sync] 开始全量同步订单数据...')
  syncOrdersToC()
}
