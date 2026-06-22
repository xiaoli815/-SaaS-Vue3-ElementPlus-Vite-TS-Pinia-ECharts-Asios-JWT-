<template>
  <el-card v-loading="loading">
    <!-- 转化漏斗卡片 -->
    <el-row :gutter="16" 
            style="margin-bottom: 20px"
    >
      <el-col :span="4" 
              v-for="step in funnelSteps" 
              :key="step.key"
      >
        <el-card shadow="hover" 
                 class="funnel-card"
        >
          <div class="funnel-label">{{ step.label }}</div>
          <div class="funnel-value">{{ step.value.toLocaleString() }}</div>
          <div class="funnel-rate" 
               v-if="step.rate !== undefined"
          >
            转化率 {{ +(step.rate * 100).toFixed(1) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 转化率趋势 -->
    <el-card style="margin-bottom: 20px" 
             header="转化率趋势"
    > 
      <div ref="conversionChart" 
           style="width: 100%; height: 380px" 
      />
    </el-card>

    <el-row :gutter="16">
      <!-- 设备转化 -->
      <el-col :span="12">
        <el-card header="设备转化对比">
          <div ref="deviceChart" 
               style="width: 100%; height: 360px" 
          />
        </el-card>
      </el-col>
      <!-- 设备转化明细 -->
      <el-col :span="12">
        <el-card header="设备转化明细">
          <el-table :data="deviceBreakdown" 
                    stripe
                    max-height="360"
          >
            <el-table-column prop="device" 
                             label="设备" 
                             width="100" 
            />
            <el-table-column prop="visits" 
                             label="访问量" 
                             width="100" 
            >
              <template #default="{ row }">{{ row.visits.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="orders" 
                             label="订单数" 
                             width="80" 
            />
            <el-table-column prop="rate" 
                             label="转化率" 
                             width="100" 
            >
              <template #default="{ row }">{{ +(row.rate * 100).toFixed(2) }}%</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getConversionReport, type ConversionData, type FunnelData, type DeviceBreakdown } from '@/api/modules/report'

const loading = ref(false)
const funnel = ref<FunnelData>({ totalVisits: 0, totalProductViews: 0, totalAddCart: 0, totalOrders: 0, productViewRate: 0, addCartRate: 0, orderRate: 0 })
const deviceBreakdown = ref<DeviceBreakdown[]>([])
const conversionChart = ref<HTMLElement | null>(null)
const deviceChart = ref<HTMLElement | null>(null)

let conversionInstance: echarts.ECharts | null = null
let deviceInstance: echarts.ECharts | null = null

const funnelSteps = computed(() => [
  { key: 'visits', label: '访问数', value: funnel.value.totalVisits },
  { key: 'productViews', label: '商品浏览', value: funnel.value.totalProductViews, rate: funnel.value.productViewRate },
  { key: 'addCart', label: '加入购物车', value: funnel.value.totalAddCart, rate: funnel.value.addCartRate },
  { key: 'orders', label: '下单', value: funnel.value.totalOrders, rate: funnel.value.orderRate },
])

async function loadData() {
  loading.value = true
  try {
    await nextTick()
    const res = await getConversionReport()
    funnel.value = res.data.funnel
    deviceBreakdown.value = res.data.deviceBreakdown
    renderConversion(res.data.list)
    renderDevice(res.data.deviceBreakdown)
  } finally {
    loading.value = false
  }
}

function renderConversion(list: ConversionData[]) {
  if (!conversionChart.value) return
  if (!conversionInstance) conversionInstance = echarts.init(conversionChart.value)
  conversionInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['转化率', '加购率'] },
    xAxis: { type: 'category', data: list.map(d => d.date) },
    yAxis: { type: 'value', name: '%', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '转化率', type: 'line', smooth: true,
        data: list.map(d => +(d.rate * 100).toFixed(2)),
        itemStyle: { color: '#409eff' }, areaStyle: {},
      },
      {
        name: '加购率', type: 'line', smooth: true,
        data: list.map(d => +(d.cartRate * 100).toFixed(2)),
        itemStyle: { color: '#e6a23c' },
      },
    ],
  })
}

function renderDevice(data: DeviceBreakdown[]) {
  if (!deviceChart.value) return
  if (!deviceInstance) deviceInstance = echarts.init(deviceChart.value)
  deviceInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['转化率'] },
    xAxis: { type: 'category', data: data.map(d => d.device) },
    yAxis: { type: 'value', name: '%', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '转化率', type: 'bar',
        data: data.map(d => +(d.rate * 100).toFixed(2)),
        itemStyle: { color: '#67c23a' },
        label: { show: true, position: 'top', formatter: '{c}%' },
      },
    ],
  })
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.funnel-card {
  text-align: center;
  border-top: 3px solid #409eff;
}
.funnel-label { font-size: 13px; color: #909399; margin-bottom: 8px; }
.funnel-value { font-size: 24px; font-weight: 700; color: #303133; }
.funnel-rate { font-size: 12px; color: #67c23a; margin-top: 6px; }
</style>
