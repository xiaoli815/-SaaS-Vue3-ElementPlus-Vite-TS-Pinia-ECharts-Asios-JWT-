# 电商 SaaS 后台管理系统

基于 Vue 3 + Vite + TypeScript + Pinia + Element Plus 构建的全功能电商 SaaS 后台管理系统，配套 Express Mock 后端服务，开箱即用。

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3.4 | Composition API + `<script setup>` |
| 构建 | Vite 5 | 极速开发体验 |
| 语言 | TypeScript 5.4 | 类型安全 |
| UI 框架 | Element Plus 2.14 | 组件库（中文语言包） |
| 图标 | @element-plus/icons-vue | 按需注册 |
| 状态管理 | Pinia 2.3 + persistedstate | 支持持久化 |
| 路由 | Vue Router 4.6 | 动态路由、路由守卫 |
| HTTP | Axios 1.6 | 请求/响应拦截 |
| 图表 | ECharts 6.1 | 数据可视化 |
| 样式 | Sass | SCSS 预处理 |
| 代码规范 | ESLint + Prettier | 代码格式化与检查 |

## 后端服务

| 技术 | 说明 |
|------|------|
| Express 4.19 | Mock API 服务 |
| JWT | 身份认证 |
| Multer | 图片上传 |
| Faker.js | Mock 数据生成 |

## 功能模块

### B 端管理后台

- **商品管理** — 商品列表、新增/编辑商品、上下架、分类筛选
- **订单管理** — 订单列表、订单详情、订单状态流转
- **营销中心**
  - 秒杀活动
  - 拼团活动
  - 优惠券管理
  - 满减活动
  - 分销配置
  - 直播管理
- **会员管理** — 会员列表、会员详情、等级/标签管理
- **数据报表**
  - 销售报表
  - 流量报表
  - 营收报表
  - 转化报表
  - 库存报表
- **系统设置** — 角色管理、店铺信息、支付配置、页面配置

### C 端 API（Mock 后端提供）

- 首页数据 / 商品浏览 / 购物车 / 订单 / 秒杀 / 优惠券 / 用户

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 1. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
cd server && npm install && cd ..
```

### 2. 启动 Mock 后端

```bash
cd server
npm run dev
# 服务运行在 http://localhost:3001
```

### 3. 启动前端开发服务

```bash
npm run dev
# 服务运行在 http://localhost:3002
```

### 4. 构建生产版本

```bash
npm run build
# 产物输出到 dist/
```

## 预置账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 运营 | operator | 123456 |
| 只读 | viewer | 123456 |

C 端测试账号：`13800138000` / `123456`

## 项目结构

```
├── index.html                 # 入口 HTML
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
├── eslint.config.js           # ESLint 配置
├── .prettierrc                # Prettier 配置
│
├── public/                    # 静态资源（上传图片等）
│
├── server/                    # Mock 后端服务
│   ├── app.js                 # Express 入口
│   ├── routes/                # API 路由（auth / product / order / marketing / member / report / setting / c-mobile）
│   ├── middleware/             # 中间件（JWT 认证）
│   ├── data/                  # JSON 数据文件
│   └── utils/                 # 工具函数
│
└── src/                       # 前端源码
    ├── main.ts                # 应用入口
    ├── App.vue                # 根组件
    ├── env.d.ts               # 环境类型声明
    ├── api/                   # API 接口封装
    │   ├── request.ts         # Axios 实例 & 拦截器
    │   └── modules/           # 按模块划分的接口
    ├── router/                # 路由配置
    ├── store/                 # Pinia 状态管理
    │   └── modules/           # app / user 模块
    ├── components/            # 公共组件（Sidebar 等）
    ├── styles/                # 全局样式 & 主题变量
    ├── utils/                 # 工具函数
    └── views/                 # 页面视图
        ├── login/             # 登录页
        ├── layout/            # 布局框架
        ├── product/           # 商品管理
        ├── order/             # 订单管理
        ├── marketing/         # 营销中心
        ├── member/            # 会员管理
        ├── report/            # 数据报表
        ├── setting/           # 系统设置
        └── error/             # 404 页面
```

## 构建优化

- **路径别名** — `@/` 映射至 `src/`
- **代理配置** — `/api` 和 `/product` 代理至 `localhost:3001`，解决开发阶段跨域
- **代码分割** — Vendor / Element Plus / ECharts / Axios 独立 chunk，利于浏览器缓存
- **图标按需注册** — 避免全量引入 Element Plus 图标（约 500KB+）
- **资源内联** — 小于 4KB 的资源内联为 base64，减少 HTTP 请求

## 开发说明

- 使用 `<script setup lang="ts">` 语法
- Element Plus 中文语言包已全局配置
- Pinia 状态已集成 `pinia-plugin-persistedstate` 持久化
- 路由守卫在 `router/index.ts` 中统一处理页面标题
- 后端使用 JSON 文件模拟数据库，数据存储在 `server/data/` 目录
