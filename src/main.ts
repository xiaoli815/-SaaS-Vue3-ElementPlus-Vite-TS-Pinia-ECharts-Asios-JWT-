import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 按需注册 Element Plus 图标，避免全量引入（全量图标包体积约 500KB+）
import {
  Goods,
  List,
  Present,
  User,
  DataAnalysis,
  Setting,
  Fold,
  Expand,
  ArrowDown,
  Lock,
} from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import pinia from './store'

// 全局样式
import './styles/index.scss'

const app = createApp(App)

// 按需注册实际使用的图标组件
const icons: Record<string, unknown> = {
  Goods,
  List,
  Present,
  User,
  DataAnalysis,
  Setting,
  Fold,
  Expand,
  ArrowDown,
  Lock,
}
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component as Parameters<typeof app.component>[1])
}

app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(pinia)

app.mount('#app')
