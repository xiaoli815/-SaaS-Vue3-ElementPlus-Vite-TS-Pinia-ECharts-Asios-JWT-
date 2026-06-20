<template>
  <div class="page-container">
    <h3 style="margin-bottom: 16px">
      数据报表（ECharts 可视化）
    </h3>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="销售统计"
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

    <el-card style="margin-top: 16px"
             v-loading="loading"
    >
      <!-- 销售统计 -->
      <template v-if="activeTab === 'sales'">
        <div
          ref="chartRef"
          style="width: 100%; height: 400px"
        />
        <el-row :gutter="16"
                style="margin-top: 16px"
        >
          <el-col :span="6"><el-statistic
            title="总销量"
            :value="salesData.totalSales"
          /></el-col>
          <el-col :span="6"><el-statistic
            title="总订单数"
            :value="salesData.totalOrders"
          /></el-col>
          <el-col :span="6"><el-statistic
            title="今日销量"
            :value="salesData.todaySales"
          /></el-col>
          <el-col :span="6"><el-statistic
            title="较昨日增长"
            :value="salesData.growth"
            :formatter="(val: number) => val + '%'"
          /></el-col>
        </el-row>
      </template>

      <!-- 客流统计 -->
      <template v-if="activeTab === 'traffic'">
        <div
          ref="chartRef"
          style="width: 100%; height: 400px"
        />
      </template>

      <!-- 营收统计 -->
      <template v-if="activeTab === 'revenue'">
        <div
          ref="chartRef"
          style="width: 100%; height: 400px"
        />
      </template>

      <!-- 转化统计 -->
      <template v-if="activeTab === 'conversion'">
        <div
          ref="chartRef"
          style="width: 100%; height: 400px"
        />
      </template>

      <!-- 库存统计 -->
      <template v-if="activeTab === 'inventory'">
        <div
          ref="chartRef"
          style="width: 100%; height: 400px"
        />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import * as echarts from 'echarts'
  import {
    getSalesReport,
    getTrafficReport,
    getRevenueReport,
    getConversionReport,
    getInventoryReport,
    type SalesData,
    type TrafficData,
    type RevenueData,
    type ConversionData,
    type InventoryData,
  } from '@/api/modules/report'

  const route = useRoute()
  const activeTab = ref(
    (route.params.tab as string) || 'sales'
  )

  watch(
    () => route.params.tab,
    (val) => {
      if (val) activeTab.value = val as string
    }
  )
  const chartRef = ref<HTMLElement | null>(null)
  const loading = ref(false)

  let chart: echarts.ECharts | null = null

  const salesData = ref({
    totalSales: 0,
    totalOrders: 0,
    todaySales: 0,
    growth: 0,
  })

  function renderSales(data: { list: SalesData[]; total?: { amount: number; orders: number } }) {
  const growth = data.list.length >= 2
    ? +(((data.list[data.list.length - 1].amount - data.list[data.list.length - 2].amount) / data.list[data.list.length - 2].amount) * 100).toFixed(1)
    : 0
  salesData.value = {
    totalSales: data.total?.amount || 0,
    totalOrders: data.total?.orders || 0,
    todaySales: data.list[data.list.length - 1]?.amount || 0,
    growth,
  }
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售额(元)', '订单量'] },
    xAxis: { type: 'category', data: data.list.map((d: SalesData) => d.date) },
    yAxis: [{ type: 'value', name: '销售额(元)' }, { type: 'value', name: '订单量' }],
    series: [
      { name: '销售额(元)', type: 'bar', data: data.list.map((d: SalesData) => d.amount), itemStyle: { color: '#409eff' } },
      { name: '订单量', type: 'line', yAxisIndex: 1, data: data.list.map((d: SalesData) => d.orders), itemStyle: { color: '#67c23a' } },
    ],
  })
}
function renderTraffic(data: { list: TrafficData[] }) {
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['PV', 'UV', '新用户'] },
    xAxis: { type: 'category', data: data.list.map((d: TrafficData) => d.date) },
    yAxis: { type: 'value' },
    series: [
      { name: 'PV', type: 'line', data: data.list.map((d: TrafficData) => d.pv), smooth: true, itemStyle: { color: '#409eff' } },
      { name: 'UV', type: 'bar', data: data.list.map((d: TrafficData) => d.uv), itemStyle: { color: '#e6a23c' } },
      { name: '新用户', type: 'line', data: data.list.map((d: TrafficData) => d.newUsers), itemStyle: { color: '#67c23a' } },
    ],
  })
}
function renderRevenue(data: { list: RevenueData[] }) {
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['营收', '退款', '净营收'] },
    xAxis: { type: 'category', data: data.list.map((d: RevenueData) => d.date) },
    yAxis: { type: 'value', name: '金额(元)' },
    series: [
      { name: '营收', type: 'bar', data: data.list.map((d: RevenueData) => d.revenue), itemStyle: { color: '#409eff' } },
      { name: '退款', type: 'bar', data: data.list.map((d: RevenueData) => d.refund), itemStyle: { color: '#f56c6c' } },
      { name: '净营收', type: 'line', data: data.list.map((d: RevenueData) => d.netRevenue), itemStyle: { color: '#67c23a' } },
    ],
  })
}
function renderConversion(data: { list: ConversionData[] }) {
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['转化率'] },
    xAxis: { type: 'category', data: data.list.map((d: ConversionData) => d.date) },
    yAxis: { type: 'value', name: '转化率(%)', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '转化率', type: 'line', data: data.list.map((d: ConversionData) => +(d.rate * 100).toFixed(2)), smooth: true, areaStyle: {}, itemStyle: { color: '#409eff' } },
    ],
  })
}
function renderInventory(data: { list: InventoryData[] }) {
  chart?.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    yAxis: { type: 'value', name: '数量' },
    xAxis: { type: 'category', data: data.list.map((d: InventoryData) => d.productName), axisLabel: { rotate: 30 } },
    series: [
      { name: '库存', type: 'bar', data: data.list.map((d: InventoryData) => d.stock), itemStyle: { color: '#409eff' } },
      { name: '销量', type: 'bar', data: data.list.map((d: InventoryData) => d.sales), itemStyle: { color: '#67c23a' } },
    ],
  })
}

  async function loadData() {
    loading.value = true
    try {
      await nextTick()
      if (!chart)
        chart = echarts.init(
          chartRef.value as HTMLDivElement
        )

      if (activeTab.value === 'sales') {
        const res = await getSalesReport()
        renderSales(res.data)
      } else if (activeTab.value === 'traffic') {
        const res = await getTrafficReport()
        renderTraffic(res.data)
      } else if (activeTab.value === 'revenue') {
        const res = await getRevenueReport()
        renderRevenue(res.data)
      } else if (activeTab.value === 'conversion') {
        const res = await getConversionReport()
        renderConversion(res.data)
      } else if (activeTab.value === 'inventory') {
        const res = await getInventoryReport()
        renderInventory(res.data)
      }
    } catch {
      // 全局拦截器已弹出错误提示
    } finally {
      loading.value = false
    }
  }

  watch(activeTab, loadData)

  onMounted(async () => {
    await loadData()
  })
</script>

<style scoped lang="scss">
  .page-container {
    max-width: 1400px;
  }
</style>
