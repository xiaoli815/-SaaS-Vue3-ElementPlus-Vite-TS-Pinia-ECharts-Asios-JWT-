import express from 'express';
import { readJSON, writeJSON } from '../utils/fs.js';

const router = express.Router();

// ==================== C 端数据同步 ====================

/**
 * 将 B 端商品格式转换为 C 端 c-products.json 格式
 */
function toCProduct(bProduct) {
  return {
    id: bProduct.id,
    name: bProduct.name,
    desc: bProduct.description || bProduct.title || bProduct.name,
    price: bProduct.price || 0,
    originalPrice: bProduct.marketPrice || (bProduct.price ? Math.round(bProduct.price * 1.5) : 0),
    image: bProduct.cover || (bProduct.images && bProduct.images[0]) || '',
    // 始终将 cover 放在首位，并过滤掉外部占位URL（仅保留本地路径如 /product/uploads/ 或 /images/）
    images: [bProduct.cover, ...(bProduct.images || [])]
      .filter(url => url && typeof url === 'string' && url.startsWith('/')),
    categoryId: bProduct.categoryId || 1,
    sales: bProduct.sales || 0,
    stock: bProduct.stock || 0,
    isFlashSale: false,
    flashSalePrice: 0,
    isFavorite: false,
    tags: bProduct.isListed ? ['新品'] : [],
    detail: bProduct.description || '',
    // 转换 SKU 格式：B端 skuList[{specs: "黑色 / M"}] → C端 skus[{specs: [{name, value}]}]
    skus: (bProduct.skuList || []).map(sku => ({
      id: sku.id,
      productId: bProduct.id,
      specs: (sku.specs || '').split('/').map(s => {
        const [name = '', value = ''] = s.trim().split(/\s+/)
        return { name: name || '规格', value: value || s.trim() }
      }),
      price: sku.price || bProduct.price || 0,
      stock: sku.stock || 0,
      image: bProduct.cover || ''
    }))
  }
}

/**
 * 将 B 端的新增/编辑商品同步到 C 端 c-products.json
 * - 上架商品：同步到 C 端（新增或更新）
 * - 下架商品：从 C 端移除
 */
function syncProductToCMobile(bProduct) {
  const cProducts = readJSON('c-products')

  // 确保 SKU ID 不会冲突：C 端 SKU 从 productId * 1000 开始
  const formatted = toCProduct(bProduct)
  if (formatted.skus.length > 0) {
    const baseSkuId = formatted.id * 1000
    formatted.skus = formatted.skus.map((sku, i) => ({
      ...sku,
      id: baseSkuId + i
    }))
  }

  const idx = cProducts.findIndex(p => p.id === formatted.id)

  if (bProduct.isListed) {
    // 上架：新增或更新
    if (idx >= 0) {
      // 保留 C 端特有字段（收藏状态、详情等）
      const existing = cProducts[idx]
      cProducts[idx] = {
        ...formatted,
        isFavorite: existing.isFavorite || false,
        detail: existing.detail || formatted.detail
      }
    } else {
      cProducts.push(formatted)
    }
  } else {
    // 下架：从 C 端移除
    if (idx >= 0) {
      cProducts.splice(idx, 1)
    }
  }

  writeJSON('c-products', cProducts)
  return formatted
}

/**
 * 从 C 端 c-products.json 中删除指定商品
 */
function removeProductFromCMobile(productId) {
  const cProducts = readJSON('c-products')
  const idx = cProducts.findIndex(p => p.id === Number(productId))
  if (idx >= 0) {
    cProducts.splice(idx, 1)
    writeJSON('c-products', cProducts)
    return true
  }
  return false
}

/**
 * 将 B 端所有已上架商品批量同步到 C 端
 */
function syncAllListedToCMobile() {
  const bProducts = readJSON('products.json')
  const listed = bProducts.filter(p => p.isListed)
  const cProducts = readJSON('c-products')

  for (const bp of listed) {
    const formatted = toCProduct(bp)
    if (formatted.skus.length > 0) {
      const baseSkuId = formatted.id * 1000
      formatted.skus = formatted.skus.map((sku, i) => ({
        ...sku,
        id: baseSkuId + i
      }))
    }
    const idx = cProducts.findIndex(p => p.id === formatted.id)
    if (idx >= 0) {
      const existing = cProducts[idx]
      cProducts[idx] = {
        ...formatted,
        isFavorite: existing.isFavorite || false,
        detail: existing.detail || formatted.detail
      }
    } else {
      cProducts.push(formatted)
    }
  }

  writeJSON('c-products', cProducts)
  console.log(`🔄 已同步 ${listed.length} 个 B 端上架商品到 C 端`)
}

// 启动时自动同步一次
syncAllListedToCMobile()

// ==================== B 端商品管理路由 ====================

router.get('/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', categoryId, isListed } = req.query;
  const products = readJSON('products.json');

  let filtered = products;
  if (keyword) {
    filtered = filtered.filter(p => p.name.includes(keyword) || (p.skuCode && p.skuCode.includes(keyword)));
  }
  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === Number(categoryId));
  }
  if (isListed !== undefined && isListed !== '') {
    filtered = filtered.filter(p => p.isListed === (isListed === 'true'));
  }

  const total = filtered.length;
  const list = filtered.slice((page - 1) * pageSize, page * pageSize);

  res.json({ code: 200, data: { list, total }, message: 'ok' });
});

router.get('/detail/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id === Number(req.params.id));
  if (product) {
    res.json({ code: 200, data: product, message: 'ok' });
  } else {
    res.json({ code: 404, data: null, message: '商品不存在' });
  }
});

router.post('/save', (req, res) => {
  const products = readJSON('products.json');
  const { id, ...data } = req.body;

  let savedProduct;

  if (id) {
    const index = products.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...data, updateTime: new Date().toISOString() };
      savedProduct = products[index];
    }
  } else {
    const newId = Date.now();
    savedProduct = {
      ...data,
      id: newId,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    products.push(savedProduct);
  }

  writeJSON('products.json', products);

  // 同步到 C 端
  if (savedProduct) {
    syncProductToCMobile(savedProduct)
    console.log(`🔄 商品 "${savedProduct.name}" 已同步到 C 端 c-products.json`)
  }

  res.json({ code: 200, data: savedProduct || null, message: '保存成功' });
});

router.post('/toggle', (req, res) => {
  const products = readJSON('products.json');
  const { id, isListed } = req.body;

  const product = products.find(p => p.id === Number(id));
  if (product) {
    product.isListed = isListed;
    product.updateTime = new Date().toISOString();
    writeJSON('products.json', products);

    // 同步到 C 端
    syncProductToCMobile(product)
    console.log(`🔄 商品 "${product.name}" ${isListed ? '已上架' : '已下架'}，已同步到 C 端`)

    res.json({ code: 200, data: null, message: isListed ? '上架成功' : '下架成功' });
  } else {
    res.json({ code: 404, data: null, message: '商品不存在' });
  }
});

router.delete('/delete/:id', (req, res) => {
  const products = readJSON('products.json');
  const productId = Number(req.params.id);
  const filtered = products.filter(p => p.id !== productId);

  if (filtered.length < products.length) {
    writeJSON('products.json', filtered);

    // 同步：从 C 端删除
    removeProductFromCMobile(productId)
    console.log(`🗑️  商品 ID:${productId} 已从 B 端和 C 端删除`)

    res.json({ code: 200, data: null, message: '删除成功' });
  } else {
    res.json({ code: 404, data: null, message: '商品不存在' });
  }
});

router.get('/categories', (req, res) => {
  const categories = readJSON('categories.json');
  res.json({ code: 200, data: categories, message: 'ok' });
});

export default router;
