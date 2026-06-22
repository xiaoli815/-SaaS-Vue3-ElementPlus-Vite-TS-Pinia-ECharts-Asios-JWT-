<template>
  <el-card v-loading="loading">
    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--blue">
          <el-statistic title="总销售额(元)" :value="total.amount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--green">
          <el-statistic title="总订单数" :value="total.orders" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--orange">
          <el-statistic title="今日销量" :value="todaySales" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--red">
          <el-statistic title="较昨日增长" :value="growth" :formatter="(v: number) => v + '%'" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售趋势图 -->
    <el-card style="margin-bottom: 20px" header="销售趋势">
      <div ref="trendChart" style="width: 100%; height: 380px" />
    </el-card>

    <el-row :gutter="16">
      <!-- 品类销售分布 -->
      <el-col :span="12">
        <el-card header="品类销售分布">
          <div ref="categoryChart" style="width: 100%; height: 360px" />
        </el-card>
      </el-col>
      <!-- 商品销售排行 -->
      <el-col :span="12">
        <el-card header="商品销售排行 Top 8">
          <el-table :data="topProducts" stripe max-height="360">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="productName" label="商品名称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="amount" label="销售额(元)" width="100">
              <template #default="{ row }">{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="orders" label="订单数" width="80" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { ECharts } from 'echarts'
import { getSalesReport, type SalesData, type CategoryBreakdown, type TopProduct } from '@/api/modules/report'

const loading = ref(false)
const total = ref({ amount: 0, orders: 0 })
const todaySales = ref(0)
const growth = ref(0)
const topProducts = ref<TopProduct[]>([])
const trendChart = ref<HTMLElement | null>(null)
const categoryChart = ref<HTMLElement | null>(null)

let trendInstance: ECharts | null = null
let categoryInstance: ECharts | null = null

async function loadData() {
  loading.value = true
  try {
    await nextTick()
    const res = await getSalesReport()
    const { list, total: t, categoryBreakdown, topProducts: top } = res.data

    total.value = t
    todaySales.value = list[list.length - 1]?.amount || 0
    growth.value = list.length >= 2
      ? +(((list[list.length - 1].amount - list[list.length - 2].amount) / list[list.length - 2].amount) * 100).toFixed(1)
      : 0
    topProducts.value = top

    await renderTrend(list)
    await renderCategory(categoryBreakdown)
  } finally {
    loading.value = false
  }
}

async function renderTrend(list: SalesData[]) {
  if (!trendChart.value) return
  const echarts = await import('echarts')
  if (!trendInstance) trendInstance = echarts.init(trendChart.value)
  trendInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售额', '订单量'] },
    xAxis: { type: 'category', data: list.map(d => d.date) },
    yAxis: [
      { type: 'value', name: '销售额(元)' },
      { type: 'value', name: '订单量' },
    ],
    series: [
      { name: '销售额', type: 'bar', data: list.map(d => d.amount), itemStyle: { color: '#409eff' } },
      { name: '订单量', type: 'line', yAxisIndex: 1, data: list.map(d => d.orders), itemStyle: { color: '#67c23a' }, smooth: true },
    ],
  })
}

function renderCategory(data: CategoryBreakdown[]) {
  if (!categoryChart.value) return
  if (!categoryInstance) categoryInstance = echarts.init(categoryChart.value)
  categoryInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '45%'],
      data: data.map(d => ({ name: d.categoryName, value: d.amount })),
      label: { formatter: '{b}\n{d}%' },
    }],
  })
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.stat-card {
  text-align: center;
  &--blue { border-left: 3px solid #409eff; }
  &--green { border-left: 3px solid #67c23a; }
  &--orange { border-left: 3px solid #e6a23c; }
  &--red { border-left: 3px solid #f56c6c; }
}
</style>
