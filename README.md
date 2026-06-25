# 电商 SaaS 后台管理系统

基于 **Vue 3 + Vite + TypeScript + Pinia + Element Plus** 的全功能电商 SaaS 后台管理系统，配套 Express Mock 后端服务，开箱即用。

## 技术栈

| 类别     | 技术                    | 版本                               |
| -------- | ----------------------- | ---------------------------------- |
| 框架     | Vue 3                   | Composition API + `<script setup>` |
| 构建工具 | Vite                    | 5.x                                |
| 语言     | TypeScript              | 5.4                                |
| UI 框架  | Element Plus            | 2.14（中文语言包）                 |
| 图标     | @element-plus/icons-vue | 按需注册                           |
| 状态管理 | Pinia                   | 2.3 + persistedstate 持久化        |
| 路由     | Vue Router              | 4.6（动态路由 + 路由守卫）         |
| HTTP     | Axios                   | 1.6（请求/响应拦截 + JWT 注入）    |
| 图表     | ECharts                 | 6.1                                |
| 样式     | Sass                    | SCSS                               |
| 代码规范 | ESLint + Prettier       | TypeScript + Vue                   |

## 后端服务

| 技术    | 说明                  |
| ------- | --------------------- |
| Express | 4.19                  |
| JWT     | 登录认证 + Token 续期 |
| Multer  | 商品图片上传          |
| CORS    | 跨域支持              |

## 功能模块

### 商品管理

- 商品列表（搜索、分类筛选、上下架）
- 新增 / 编辑商品（富文本描述、SKU 规格、图片上传）

### 订单管理

- 订单列表（状态筛选、多维度搜索）
- 订单详情（商品明细、收货信息、物流跟踪）
- 订单状态流转（待确认 → 待发货 → 已发货 → 已完成）

### 营销中心

| 模块       | 功能                         |
| ---------- | ---------------------------- |
| 秒杀活动   | 活动配置、商品关联、限时管理 |
| 拼团活动   | 团规则配置、拼团商品管理     |
| 优惠券管理 | 优惠券发放、使用规则         |
| 满减活动   | 阶梯满减配置                 |
| 分销配置   | 佣金比例、分销规则           |
| 直播管理   | 直播间配置                   |

### 会员管理

- 会员列表（标签筛选、等级筛选）
- 会员详情（消费记录、积分明细）
- 等级管理（升级规则配置）
- 标签管理（自定义标签分组）

### 数据报表

| 报表     | 图表类型        |
| -------- | --------------- |
| 销售报表 | 折线图 + 柱状图 |
| 流量报表 | 折线图 + 饼图   |
| 营收报表 | 柱状图 + 对比图 |
| 转化报表 | 漏斗图 + 数值卡 |
| 库存报表 | 表格 + 进度条   |

### 系统设置

- 角色管理（权限分配）
- 店铺信息（品牌配置）
- 支付配置（微信/支付宝）
- 页面配置（装修模板）

## 快速开始

```bash
# 环境要求：Node.js >= 18

# 1. 安装前端依赖
npm install

# 2. 安装后端依赖
cd server && npm install && cd ..

# 3. 启动后端（端口 3001）
cd server && npm run dev

# 4. 新终端，启动前端（端口 3002）
npm run dev
```

浏览器访问 `http://localhost:3002`

## 预置账号

| 角色   | 用户名   | 密码   | 权限               |
| ------ | -------- | ------ | ------------------ |
| 管理员 | admin    | 123456 | 全部功能           |
| 运营   | operator | 123456 | 商品 / 订单 / 营销 |
| 只读   | viewer   | 123456 | 只读浏览           |

## 常用命令

| 命令                       | 说明                     |
| -------------------------- | ------------------------ |
| `npm run dev`              | 启动前端开发服务         |
| `npm run build`            | 类型检查 + 生产构建      |
| `npm run build:prod`       | 生产构建（跳过类型检查） |
| `npm run preview`          | 预览构建产物             |
| `cd server && npm run dev` | 启动后端开发服务         |
| `cd server && npm start`   | 启动后端（生产模式）     |

## 项目结构

```
├── index.html                  # 入口 HTML
├── vite.config.ts              # Vite 配置（别名 / 代理 / 代码分割）
├── tsconfig.json               # TypeScript 配置
├── .env.production             # 生产环境变量
├── vercel.json                 # Vercel 部署配置
│
├── public/
│   └── product/uploads/        # 商品图片上传目录
│
├── server/                     # Express Mock 后端
│   ├── app.js                  # 入口（CORS / 路由挂载 / 静态资源）
│   ├── routes/
│   │   ├── auth.js             # 登录认证
│   │   ├── product.js          # 商品 CRUD
│   │   ├── order.js            # 订单管理
│   │   ├── marketing.js        # 营销活动
│   │   ├── member.js           # 会员管理
│   │   ├── report.js           # 数据报表
│   │   ├── setting.js          # 系统设置
│   │   ├── upload.js           # 图片上传
│   │   └── c-mobile.js         # C 端 API
│   ├── middleware/              # 中间件（JWT 认证）
│   ├── data/                   # JSON 数据存储
│   └── utils/fs.js             # JSON 文件读写工具
│
└── src/                        # 前端源码
    ├── main.ts                 # 入口（Element Plus 全局配置）
    ├── App.vue                 # 根组件
    ├── api/
    │   ├── request.ts          # 封装 GET/POST/PUT/DELETE
    │   └── modules/            # 按模块划分的接口
    │       ├── user.ts
    │       ├── product.ts
    │       ├── order.ts
    │       ├── marketing.ts
    │       ├── member.ts
    │       ├── report.ts
    │       └── setting.ts
    ├── router/
    │   └── index.ts            # 动态路由 + 路由守卫
    ├── store/
    │   ├── index.ts            # Pinia 实例
    │   └── modules/
    │       ├── app.ts          # 全局状态
    │       └── user.ts         # 用户状态（Token 持久化）
    ├── styles/
    │   └── index.scss          # 全局样式
    ├── utils/
    │   └── http.ts             # Axios 实例 + 拦截器
    ├── components/
    │   └── Sidebar/            # 侧边栏组件
    └── views/
        ├── login/              # 登录页
        ├── layout/             # 布局（keep-alive 缓存）
        ├── product/            # 商品列表 / 编辑
        ├── order/              # 订单列表 / 详情
        ├── marketing/          # 秒杀 / 拼团 / 优惠券 / 满减 / 分销 / 直播
        ├── member/             # 会员列表 / 详情
        ├── report/             # 数据报表（5 个子页签）
        ├── setting/            # 系统设置（4 个子页签）
        └── error/              # 404 页面
```

## 构建优化

| 优化项          | 说明                                           |
| --------------- | ---------------------------------------------- |
| 路由懒加载      | 全部路由使用 `() => import()` 动态导入         |
| 代码分割        | Vue / ElementPlus / ECharts / Axios 独立 chunk |
| 图标按需注册    | Element Plus 图标按需引入，约节省 500KB+       |
| 资源内联        | 小于 4KB 的资源内联为 base64，减少请求数       |
| keep-alive 缓存 | 路由切换缓存页面，避免重复渲染                 |
| SourceMap 关闭  | 生产构建不输出 sourcemap，减小体积             |
| 代理跨域        | 开发环境 `/api` 代理到后端，无需手动配置 CORS  |

## 开发说明

- 使用 `<script setup lang="ts">` 语法
- Element Plus 中文语言包已全局配置
- Pinia 集成 `pinia-plugin-persistedstate`，Token 持久化到 localStorage
- 路由守卫在 `router/index.ts` 中统一设置页面标题
- Axios 拦截器自动注入 Bearer Token，统一处理业务错误码
- 后端使用 JSON 文件模拟数据库，数据存储在 `server/data/` 目录
- 端口监听环境变量 `process.env.PORT`，兼容云平台动态端口
