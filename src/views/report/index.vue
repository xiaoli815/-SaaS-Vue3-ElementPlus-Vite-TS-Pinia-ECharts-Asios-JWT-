<template>
  <div class="page-container">
    <h3 style="margin-bottom: 16px">数据报表（ECharts 可视化）</h3>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="销量统计" 
                   name="sales" 
      />
      <el-tab-pane label="客流统计" 
                   name="traffic" 
      />  
      <el-tab-pane label="营收统计" 
                   name="revenue" 
      />
      <el-tab-pane label="转化统计" 
                   name="conversion" 
      />
      <el-tab-pane label="库存统计" 
                   name="inventory" 
      />
    </el-tabs>

    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, shallowRef, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref((route.params.tab as string) || 'sales')

// 按 Tab 动态加载报表组件，避免首屏加载所有图表组件（含 echarts ~1MB）
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  sales: defineAsyncComponent(() => import('./SalesReport.vue')),
  traffic: defineAsyncComponent(() => import('./TrafficReport.vue')),
  revenue: defineAsyncComponent(() => import('./RevenueReport.vue')),
  conversion: defineAsyncComponent(() => import('./ConversionReport.vue')),
  inventory: defineAsyncComponent(() => import('./InventoryReport.vue')),
}
const currentComponent = shallowRef(componentMap[activeTab.value])

watch(activeTab, (tab) => {
  currentComponent.value = componentMap[tab]
})

watch(() => route.params.tab, val => {
  if (val) activeTab.value = val as string
})
</script>

<style scoped lang="scss">
.page-container {
  max-width: 1400px;
}
</style>
