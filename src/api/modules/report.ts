import { get } from '../request';

export interface SalesData {
  date: string;
  amount: number;
  orders: number;
  avgPrice: number;
}
export interface TrafficData {
  date: string;
  pv: number;
  uv: number;
  newUsers: number;
}
export interface RevenueData {
  date: string;
  revenue: number;
  refund: number;
  netRevenue: number;
}
export interface ConversionData {
  date: string;
  visits: number;
  orders: number;
  rate: number;
}
export interface InventoryData {
  productName: string;
  stock: number;
  sales: number;
  turnover: number;
}

export interface ReportQuery {
  startDate?: string;
  endDate?: string;
  type?: string;
}

/** 销量统计 */
export function getSalesReport(params?: ReportQuery) {
  return get<{
    list: SalesData[];
    total: { amount: number; orders: number };
  }>('/report/sales', params);
}
/** 客流统计 */
export function getTrafficReport(params?: ReportQuery) {
  return get<{
    list: TrafficData[];
    summary: {
      totalPv: number;
      totalUv: number;
      totalNewUsers: number;
    };
  }>('/report/traffic', params);
}
/** 营收统计 */
export function getRevenueReport(params?: ReportQuery) {
  return get<{
    list: RevenueData[];
    summary: {
      totalRevenue: number;
      totalRefund: number;
      netRevenue: number;
    };
  }>('/report/revenue', params);
}
/** 转化统计 */
export function getConversionReport(params?: ReportQuery) {
  return get<{ list: ConversionData[]; avgRate: number }>(
    '/report/conversion',
    params
  );
}
/** 库存统计 */
export function getInventoryReport(params?: ReportQuery) {
  return get<{
    list: InventoryData[];
    totalStock: number;
    totalValue: number;
  }>('/report/inventory', params);
}
