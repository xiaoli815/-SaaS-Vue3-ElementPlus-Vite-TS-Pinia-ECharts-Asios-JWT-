import { get, put, post, del } from '../request'
import { OrderItem } from './order'



export interface MemberItem {
  id: number
  username: string
  nickname: string
  avatar: string
  phone: string
  email: string
  level: number
  levelName: string
  points: number
  balance: number
  totalSpent: number
  orderCount: number
  tags: string[]
  isBlacklisted: boolean
  registerTime: string
  lastLoginTime: string
}
export interface LevelConfig {
  id: number
  name: string
  minSpent: number
  discount: number
  icon: string
  color: string
}
export interface TagItem {
  id: number
  name: string
  color: string
  memberCount: number
}

export interface MemberQuery {
  page?: number
  pageSize?: number
  keyword?: string
  level?: number
  isBlacklisted?: number
}
/** 会员列表 */
export function getMemberList(params?: MemberQuery) {
  return get<{ list: MemberItem[]; total: number }>(
    '/member/list',
    params
  )
}
/** 会员详情 */
export function getMemberDetail(id: number) {
  return get<MemberItem>(`/member/detail/${id}`)
}
/** 修改会员等级 */
export function updateMemberLevel(
  id: number,
  level: number
) {
  return put(`/member/level/${id}`, { level })
}
/** 等级配置列表 */
export function getLevelConfigs() {
  return get<LevelConfig[]>('/member/levels')
}
/** 更新等级配置 */
export function updateLevelConfig(
  id: number,
  data: Partial<LevelConfig>
) {
  return put(`/member/level-config/${id}`, data)
}
/** 标签列表 */
export function getTags() {
  return get<TagItem[]>('/member/tags')
}
/** 创建标签 */
export function createTag(data: Partial<TagItem>) {
  return post('/member/tag/create', data)
}
/** 删除标签 */
export function deleteTag(id: number) {
  return del(`/member/tag/delete/${id}`)
}
/** 黑名单操作 */
export function toggleBlacklist(
  id: number,
  isBlacklisted: boolean
) {
  return put(`/member/blacklist/${id}`, { isBlacklisted })
}
/** 会员全量数据 */
export function getMemberFullData(id: number) {
  return get<{ member: MemberItem; orderHistory: OrderItem[] }>(`/member/full-data/${id}`)
}
