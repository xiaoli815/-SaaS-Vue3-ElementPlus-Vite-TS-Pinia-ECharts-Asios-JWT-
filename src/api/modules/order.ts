import { get, post } from '../request';

export interface OrderItem {
  id: string;
  orderNo: string;
  userId: number;
  userName: string;
  userPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  totalAmount: number;
  payAmount: number;
  discountAmount: number;
  freight: number;
  payType: string;
  payTime: string;
  source: string;
  status: number;
  statusText: string;
  remark: string;
  items: OrderProductItem[];
  afterSaleStatus: number;
  afterSale?: AfterSaleInfo;
  logistics?: LogisticsInfo;
  createTime: string;
  updateTime: string;
}
export interface OrderProductItem {
  productId: number;
  productName: string;
  skuSpecs: string;
  price: number;
  quantity: number;
  cover: string;
}
export interface AfterSaleInfo {
  type: number;
  typeText: string;
  reason: string;
  status: number;
  statusText: string;
  reply?: string;
  applyTime: string;
  reviewTime?: string;
}
export interface LogisticsInfo {
  company: string;
  trackingNo: string;
  deliverTime: string;
}
export interface OrderQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
}

/** 订单列表 */
export function getOrderList(params: OrderQuery) {
  return get<{ list: OrderItem[]; total: number }>(
    '/order/list',
    params
  );
}
/** 订单详情 */
export function getOrderDetail(id: string) {
  return get<OrderItem>(`/order/detail/${id}`);
}
/** 接单确认 */
export function confirmOrder(id: string) {
  return post(`/order/confirm`, { id });
}
/** 改价 */
export function updateOrderPrice(
  id: string,
  payAmount: number,
  remark?: string
) {
  return post(`/order/adjust`, { id, payAmount, remark });
}
/** 修改订单信息 */
export function updateOrderInfo(
  id: string,
  data: Partial<OrderItem>
) {
  return post(`/order/adjust`, { id, ...data });
}
/** 发货（录入物流单号） */
export function deliverOrder(
  id: string,
  company: string,
  trackingNo: string
) {
  return post(`/order/deliver`, {
    id,
    company,
    trackingNo,
  });
}
/** 退款处理 */
export function refundOrder(
  id: string,
  amount: number,
  reason: string
) {
  return post(`/order/adjust`, { id, payAmount: amount, remark: reason });
}
/** 售后审核 */
export function reviewAfterSale(
  id: string,
  approved: boolean,
  reply: string
) {
  return post(`/order/after-sale/review`, {
    id,
    approve: approved,
    remark: reply,
  });
}
