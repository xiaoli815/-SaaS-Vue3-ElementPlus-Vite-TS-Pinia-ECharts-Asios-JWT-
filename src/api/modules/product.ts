import { post, get, del } from '../request'

// ==================== 类型定义 ====================
export interface ProductItem {
  id: number
  name: string
  title: string
  categoryId: number
  categoryName: string
  brand: string
  price: number
  marketPrice: number
  costPrice: number
  stock: number
  sales: number
  cover: string
  images: string[]
  description: string
  status: number
  isListed: boolean
  skuList: SkuItem[]
  createTime: string
  updateTime: string
}

export interface ProductForm {
  name: string
  title: string
  categoryId: number
  categoryName: string
  brand: string
  price: number
  marketPrice: number
  costPrice: number
  cover: string
  description: string
  skuList: SkuItem[]
}

export interface SkuItem {
  id: number
  specs: string
  price: number
  stock: number
  skuCode: string
}
export interface ProductQuery {
  page?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
  isListed?: string
}
export interface CategoryItem {
  id: number
  name: string
  parentId: number
  children?: CategoryItem[]
}

/** 商品列表 */
export function getProductList(params: ProductQuery) {
  return get<{ list: ProductItem[]; total: number }>(
    '/product/list',
    params
  )
}
/** 商品详情 */
export function getProductDetail(id: number) {
  return get<ProductItem>(`/product/detail/${id}`)
}
/** 新增商品 */
export function createProduct(data: Partial<ProductItem>) {
  return post<ProductItem>('/product/save', data)
}
/** 编辑商品 */
export function updateProduct(
  id: number,
  data: Partial<ProductItem>
) {
  return post<ProductItem>('/product/save', { id, ...data })
}
/** 编辑SKU */
export function updateProductSku(
  id: number,
  skuList: SkuItem[]
) {
  return post('/product/save', { id, skuList })
}
/** 上下架 */
export function toggleListing(
  id: number,
  isListed: boolean
) {
  return post(`/product/toggle`, { id, isListed })
}
/** 删除商品 */
export function deleteProduct(id: number) {
  return del(`/product/delete/${id}`)
}
/** 分类列表 */
export function getCategories() {
  return get<CategoryItem[]>('/product/categories')
}
