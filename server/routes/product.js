import express from 'express';
import { readJSON, writeJSON } from '../utils/fs.js';

const router = express.Router();

router.get('/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', categoryId, isListed } = req.query;
  const products = readJSON('products.json');
  
  let filtered = products;
  if (keyword) {
    filtered = filtered.filter(p => p.name.includes(keyword) || p.skuCode.includes(keyword));
  }
  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === Number(categoryId));
  }
  if (isListed !== '') {
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
  
  if (id) {
    const index = products.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...data, updateTime: new Date().toISOString() };
    }
  } else {
    products.push({
      ...data,
      id: Date.now(),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    });
  }
  
  writeJSON('products.json', products);
  res.json({ code: 200, data: null, message: '保存成功' });
});

router.post('/toggle', (req, res) => {
  const products = readJSON('products.json');
  const { id, isListed } = req.body;
  
  const product = products.find(p => p.id === Number(id));
  if (product) {
    product.isListed = isListed;
    product.updateTime = new Date().toISOString();
    writeJSON('products.json', products);
    res.json({ code: 200, data: null, message: isListed ? '上架成功' : '下架成功' });
  } else {
    res.json({ code: 404, data: null, message: '商品不存在' });
  }
});

router.delete('/delete/:id', (req, res) => {
  const products = readJSON('products.json');
  const filtered = products.filter(p => p.id !== Number(req.params.id));
  
  if (filtered.length < products.length) {
    writeJSON('products.json', filtered);
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