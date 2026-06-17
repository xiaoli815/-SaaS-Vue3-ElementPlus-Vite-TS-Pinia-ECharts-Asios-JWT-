import express from 'express';
import { readJSON, writeJSON } from '../utils/fs.js';

const router = express.Router();

router.get('/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', status, startDate, endDate } = req.query;
  const orders = readJSON('orders.json');
  
  let filtered = orders;
  if (keyword) {
    filtered = filtered.filter(o => o.orderNo.includes(keyword) || 
      o.receiverName.includes(keyword) || 
      o.receiverPhone.includes(keyword));
  }
  if (status) {
    filtered = filtered.filter(o => o.status === Number(status));
  }
  if (startDate) {
    filtered = filtered.filter(o => o.createTime >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(o => o.createTime <= endDate + ' 23:59:59');
  }
  
  filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  const total = filtered.length;
  const list = filtered.slice((page - 1) * pageSize, page * pageSize);
  
  res.json({ code: 200, data: { list, total }, message: 'ok' });
});

router.get('/detail/:id', (req, res) => {
  const orders = readJSON('orders.json');
  const order = orders.find(o => o.id === Number(req.params.id));
  if (order) {
    res.json({ code: 200, data: order, message: 'ok' });
  } else {
    res.json({ code: 404, data: null, message: '订单不存在' });
  }
});

router.post('/confirm', (req, res) => {
  const orders = readJSON('orders.json');
  const { id } = req.body;
  
  const order = orders.find(o => o.id === Number(id));
  if (order && order.status === 0) {
    order.status = 1;
    order.statusText = '待发货';
    order.confirmTime = new Date().toISOString();
    writeJSON('orders.json', orders);
    res.json({ code: 200, data: null, message: '接单成功' });
  } else {
    res.json({ code: 400, data: null, message: '订单状态不允许接单' });
  }
});

router.post('/deliver', (req, res) => {
  const orders = readJSON('orders.json');
  const { id, company, trackingNo } = req.body;
  
  const order = orders.find(o => o.id === Number(id));
  if (order && order.status === 1) {
    order.status = 2;
    order.statusText = '已发货';
    order.logistics = { company, trackingNo };
    order.deliverTime = new Date().toISOString();
    writeJSON('orders.json', orders);
    res.json({ code: 200, data: null, message: '发货成功' });
  } else {
    res.json({ code: 400, data: null, message: '订单状态不允许发货' });
  }
});

router.post('/adjust', (req, res) => {
  const orders = readJSON('orders.json');
  const { id, payAmount, remark } = req.body;
  
  const order = orders.find(o => o.id === Number(id));
  if (order && order.status === 1) {
    order.payAmount = payAmount;
    order.adjustRemark = remark;
    order.adjustTime = new Date().toISOString();
    writeJSON('orders.json', orders);
    res.json({ code: 200, data: null, message: '改价成功' });
  } else {
    res.json({ code: 400, data: null, message: '订单状态不允许改价' });
  }
});

router.post('/after-sale/review', (req, res) => {
  const orders = readJSON('orders.json');
  const { id, approve, remark } = req.body;
  
  const order = orders.find(o => o.id === Number(id));
  if (order && order.afterSale && order.afterSale.status === 0) {
    order.afterSale.status = approve ? 1 : 2;
    order.afterSale.statusText = approve ? '已同意' : '已拒绝';
    order.afterSale.reviewRemark = remark;
    order.afterSale.reviewTime = new Date().toISOString();
    
    if (approve) {
      order.status = 4;
      order.statusText = '售后中';
    }
    
    writeJSON('orders.json', orders);
    res.json({ code: 200, data: null, message: approve ? '同意售后成功' : '拒绝售后成功' });
  } else {
    res.json({ code: 400, data: null, message: '售后状态不允许操作' });
  }
});

export default router;