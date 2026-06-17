import { get, put } from '../request';

export interface RoleItem {
  id: number;
  name: string;
  permissions: PermissionGroup[];
}
export interface PermissionGroup {
  group: string;
  items: PermissionItem[];
}
export interface PermissionItem {
  key: string;
  name: string;
  checked: boolean;
}
export interface ShopInfo {
  id: number;
  name: string;
  logo: string;
  phone: string;
  address: string;
  description: string;
  notice: string;
}
export interface PaymentConfig {
  wechat: {
    enabled: boolean;
    appId: string;
    mchId: string;
    apiKey: string;
  };
  alipay: {
    enabled: boolean;
    appId: string;
    privateKey: string;
  };
}
export interface PageConfig {
  homePage: PageBlock[];
}
export interface PageBlock {
  id: string;
  type: string;
  config: Record<string, any>;
}

/** 角色列表 */
export function getRoles() {
  return get<RoleItem[]>('/setting/roles');
}
/** 编辑角色权限 */
export function updateRole(
  id: number,
  permissions: PermissionGroup[]
) {
  return put(`/setting/role/${id}`, { permissions });
}
/** 获取店铺信息 */
export function getShopInfo() {
  return get<ShopInfo>('/setting/shop-info');
}
/** 更新店铺信息 */
export function updateShopInfo(data: Partial<ShopInfo>) {
  return put('/setting/shop-info', data);
}
/** 获取支付配置 */
export function getPaymentConfig() {
  return get<PaymentConfig>('/setting/payment-config');
}
/** 更新支付配置 */
export function updatePaymentConfig(
  data: Partial<PaymentConfig>
) {
  return put('/setting/payment-config', data);
}
/** 获取页面装修配置 */
export function getPageConfig() {
  return get<PageConfig>('/setting/page-config');
}
/** 更新页面装修配置 */
export function updatePageConfig(data: PageConfig) {
  return put('/setting/page-config', data);
}
