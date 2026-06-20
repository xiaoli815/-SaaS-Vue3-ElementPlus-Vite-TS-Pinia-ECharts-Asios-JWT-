import { get, post, put, del } from '../request'

// ==================== 秒杀 ====================
export interface SeckillActivity {
  id: number
  name: string
  productId: number
  productName: string
  seckillPrice: number
  stock: number
  startTime: string
  endTime: string
  limitPerUser: number
  status: number
  statusText: string
}
export interface SeckillQuery {
  page?: number
  pageSize?: number
  keyword?: string
}
export function getSeckillList(params?: SeckillQuery) {
  return get<{ list: SeckillActivity[]; total: number }>(
    '/marketing/seckill/list',
    params
  )
}
export function createSeckill(
  data: Partial<SeckillActivity>
) {
  return post('/marketing/seckill/create', data)
}
export function updateSeckill(
  id: number,
  data: Partial<SeckillActivity>
) {
  return put(`/marketing/seckill/${id}`, data)
}
export function deleteSeckill(id: number) {
  return del(`/marketing/seckill/${id}`)
}

// ==================== 拼团 ====================
export interface GroupActivity {
  id: number
  name: string
  productId: number
  productName: string
  groupPrice: number
  groupSize: number
  stock: number
  startTime: string
  endTime: string
  duration: number
  status: number
  statusText: string
}
export interface GroupQuery {
  page?: number
  pageSize?: number
  keyword?: string
}
export function getGroupList(params?: GroupQuery) {
  return get<{ list: GroupActivity[]; total: number }>(
    '/marketing/group/list',
    params
  )
}
export function createGroup(data: Partial<GroupActivity>) {
  return post('/marketing/group/create', data)
}
export function updateGroup(
  id: number,
  data: Partial<GroupActivity>
) {
  return put(`/marketing/group/${id}`, data)
}
export function deleteGroup(id: number) {
  return del(`/marketing/group/${id}`)
}

// ==================== 优惠券 ====================
export interface CouponItem {
  id: number
  name: string
  type: number
  typeText: string
  value: number
  minAmount: number
  total: number
  received: number
  used: number
  startTime: string
  endTime: string
  status: number
  statusText: string
}
export interface CouponQuery {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}
export function getCouponList(params?: CouponQuery) {
  return get<{ list: CouponItem[]; total: number }>(
    '/marketing/coupon/list',
    params
  )
}
export function createCoupon(data: Partial<CouponItem>) {
  return post('/marketing/coupon/create', data)
}
export function updateCoupon(
  id: number,
  data: Partial<CouponItem>
) {
  return put(`/marketing/coupon/${id}`, data)
}
export function deleteCoupon(id: number) {
  return del(`/marketing/coupon/${id}`)
}

// ==================== 满减 ====================
export interface FullReduction {
  id: number
  name: string
  fullAmount: number
  reduceAmount: number
  startTime: string
  endTime: string
  status: number
  statusText: string
}
export interface FullReductionQuery {
  page?: number
  pageSize?: number
}
export function getFullReductionList(params?: FullReductionQuery) {
  return get<{ list: FullReduction[]; total: number }>(
    '/marketing/full-reduction/list',
    params
  )
}
export function createFullReduction(
  data: Partial<FullReduction>
) {
  return post('/marketing/full-reduction/create', data)
}
export function updateFullReduction(
  id: number,
  data: Partial<FullReduction>
) {
  return put(`/marketing/full-reduction/${id}`, data)
}
export function deleteFullReduction(id: number) {
  return del(`/marketing/full-reduction/${id}`)
}

// ==================== 分销 ====================
export interface DistribConfig {
  id: number
  level: number
  name: string
  rate: number
  autoUpgrade: boolean
  upgradeAmount: number
}
export function getDistribConfig() {
  return get<DistribConfig[]>(
    '/marketing/distribution/config'
  )
}
export function updateDistribConfig(data: DistribConfig[]) {
  return put('/marketing/distribution/config', {
    configs: data,
  })
}

// ==================== 直播 ====================
export interface LiveActivity {
  id: number
  roomId: string
  title: string
  cover: string
  anchor: string
  startTime: string
  endTime: string
  productIds: number[]
  status: number
  statusText: string
}

export interface LiveForm {
  title: string
  roomId: string
  anchor: string
  cover: string
  productIdsStr: string
  startTime: string
  endTime: string
}

export interface LiveQuery {
  page?: number
  pageSize?: number
  keyword?: string
}
export function getLiveList(params?: LiveQuery) {
  return get<{ list: LiveActivity[]; total: number }>(
    '/marketing/live/list',
    params
  )
}
export function createLive(data: Partial<LiveActivity>) {
  return post('/marketing/live/create', data)
}
export function updateLive(
  id: number,
  data: Partial<LiveActivity>
) {
  return put(`/marketing/live/${id}`, data)
}
export function deleteLive(id: number) {
  return del(`/marketing/live/${id}`)
}
