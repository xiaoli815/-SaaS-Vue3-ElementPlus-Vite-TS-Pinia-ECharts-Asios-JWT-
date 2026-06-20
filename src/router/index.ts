import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import {defineAsyncComponent} from 'vue'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: defineAsyncComponent(() => import('@/views/login/index.vue')),
    meta: { title: '登录' },
  },
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/product/list',
    children: [
      {
        path: 'product/list',
        name: 'ProductList',
        component: defineAsyncComponent(() => import('@/views/product/list.vue')),
        meta: { title: '商品列表', icon: 'Goods' },
      },
      {
        path: 'product/edit/:id?',
        name: 'ProductEdit',
        component: defineAsyncComponent(() => import('@/views/product/edit.vue')),
        meta: {
          title: '商品编辑',
          icon: 'Edit',
          hidden: true,
        },
      },
      {
        path: 'order/list',
        name: 'OrderList',
        component: defineAsyncComponent(() => import('@/views/order/list.vue')),
        meta: { title: '订单列表', icon: 'List' },
      },
      {
        path: 'order/detail/:id',
        name: 'OrderDetail',
        component: defineAsyncComponent(() => import('@/views/order/detail.vue')),
        meta: {
          title: '订单详情',
          icon: 'Document',
          hidden: true,
        },
      },
      {
        path: 'marketing/seckill',
        name: 'Seckill',
        component: defineAsyncComponent(() => import('@/views/marketing/seckill.vue')),
        meta: { title: '秒杀活动', icon: 'Timer' },
      },
      {
        path: 'marketing/group',
        name: 'GroupBuy',
        component: defineAsyncComponent(() => import('@/views/marketing/group.vue')),
        meta: { title: '拼团活动', icon: 'UserFilled' },
      },
      {
        path: 'marketing/coupon',
        name: 'Coupon',
        component: defineAsyncComponent(() => import('@/views/marketing/coupon.vue')),
        meta: { title: '优惠券管理', icon: 'Ticket' },
      },
      {
        path: 'marketing/full-reduction',
        name: 'FullReduction',
        component: defineAsyncComponent(() => import('@/views/marketing/full-reduction.vue')),
        meta: { title: '满减活动', icon: 'Discount' },
      },
      {
        path: 'marketing/distribution',
        name: 'Distribution',
        component: defineAsyncComponent(() => import('@/views/marketing/distribution.vue')),
        meta: { title: '分销配置', icon: 'Share' },
      },
      {
        path: 'marketing/live',
        name: 'Live',
        component: defineAsyncComponent(() => import('@/views/marketing/live.vue')),
        meta: { title: '直播管理', icon: 'VideoCamera' },
      },
      {
        path: 'member/list',
        name: 'MemberList',
        component: defineAsyncComponent(() => import('@/views/member/list.vue')),
        meta: { title: '会员列表', icon: 'User' },
      },
      {
        path: 'member/detail/:id',
        name: 'MemberDetail',
        component: defineAsyncComponent(() => import('@/views/member/detail.vue')),
        meta: {
          title: '会员详情',
          icon: 'User',
          hidden: true,
        },
      },
      {
        path: 'report/:tab(sales|traffic|revenue|conversion|inventory)',
        name: 'ReportView',
        component: defineAsyncComponent(() => import('@/views/report/index.vue')),
        meta: { title: '数据报表', icon: 'DataAnalysis' },
      },
      {
        path: 'setting/:tab(roles|shop|payment|page)',
        name: 'SettingView',
        component: defineAsyncComponent(() => import('@/views/setting/index.vue')),
        meta: { title: '系统设置', icon: 'Setting' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: defineAsyncComponent(() => import('@/views/error/404.vue')),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...asyncRoutes],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  document.title =
    (to.meta.title as string) || '电商SaaS后台管理系统'
  next()
})

export default router
