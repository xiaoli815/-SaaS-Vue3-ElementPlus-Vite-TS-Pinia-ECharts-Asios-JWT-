import { get } from '../request'

export interface SalesData {
  date: string
  amount: number
  orders: number
  avgPrice: number
}
export interface TrafficData {
  date: string
  pv: number
  uv: number
  newUsers: number
  avgStay: number
  bounceRate: number
}
export interface RevenueData {
  date: string
  revenue: number
  refund: number
  netRevenue: number
  refundRate: number
}
export interface ConversionData {
  date: string
  visits: number
  orders: number
  rate: number
  addCartCount: number
  cartRate: number
}
export interface InventoryItem {
  productName: string
  skuName: string
  stock: number
  sales: number
  turnover: number
  stockValue: number
  status: string
  categoryName: string
}
export interface CategoryBreakdown {
  categoryName: string
  amount: number
  orders: number
  avgPrice: number
}
export interface TopProduct {
  productName: string
  amount: number
  orders: number
  salesCount: number
}
export interface SourceBreakdown {
  source: string
  pv: number
  uv: number
  percentage: number
}
export interface PaymentBreakdown {
  method: string
  amount: number
  orders: number
  percentage: number
}
export interface FunnelData {
  totalVisits: number
  totalProductViews: number
  totalAddCart: number
  totalOrders: number
  productViewRate: number
  addCartRate: number
  orderRate: number
}
export interface DeviceBreakdown {
  device: string
  visits: number
  orders: number
  rate: number
}
export interface StatusSummary {
  status: string
  count: number
  value: number
}

export interface ReportQuery {
  startDate?: string
  endDate?: string
  type?: string
}

/** 销量统计 */
export function getSalesReport(params?: ReportQuery) {
  return get<{
    list: SalesData[]
    total: { amount: number; orders: number }
    categoryBreakdown: CategoryBreakdown[]
    topProducts: TopProduct[]
  }>('/report/sales', params)
}
/** 客流统计 */
export function getTrafficReport(params?: ReportQuery) {
  return get<{
    list: TrafficData[]
    summary: {
      totalPv: number
      totalUv: number
      totalNewUsers: number
      avgStay: number
      avgBounceRate: number
    }
    sourceBreakdown: SourceBreakdown[]
  }>('/report/traffic', params)
}
/** 营收统计 */
export function getRevenueReport(params?: ReportQuery) {
  return get<{
    list: RevenueData[]
    summary: {
      totalRevenue: number
      totalRefund: number
      netRevenue: number
      avgRefundRate: number
    }
    paymentBreakdown: PaymentBreakdown[]
  }>('/report/revenue', params)
}
/** 转化统计 */
export function getConversionReport(params?: ReportQuery) {
  return get<{
    list: ConversionData[]
    avgRate: number
    avgCartRate: number
    funnel: FunnelData
    deviceBreakdown: DeviceBreakdown[]
  }>('/report/conversion', params)
}
/** 库存统计 */
export function getInventoryReport(params?: ReportQuery) {
  return get<{
    list: InventoryItem[]
    totalStock: number
    totalValue: number
    statusSummary: StatusSummary[]
    categoryStock: { categoryName: string; stock: number; value: number }[]
  }>('/report/inventory', params)
}
