<template>
  <el-card v-loading="loading">
    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--blue">
          <el-statistic title="总PV" :value="summary.totalPv" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--green">
          <el-statistic title="总UV" :value="summary.totalUv" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--orange">
          <el-statistic title="新用户数" :value="summary.totalNewUsers" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--purple">
          <el-statistic title="平均跳出率" :value="+(summary.avgBounceRate * 100).toFixed(1)" :suffix="'%'" />
        </el-card>
      </el-col>
    </el-row>

    <!-- PV/UV/新用户趋势 -->
    <el-card style="margin-bottom: 20px" header="流量趋势">
      <div ref="trafficChart" style="width: 100%; height: 380px" />
    </el-card>

    <el-row :gutter="16">
      <!-- 来源分布 -->
      <el-col :span="12">
        <el-card header="流量来源分布">
          <div ref="sourceChart" style="width: 100%; height: 360px" />
        </el-card>
      </el-col>
      <!-- 来源明细 -->
      <el-col :span="12">
        <el-card header="来源明细">
          <el-table :data="sourceBreakdown" stripe max-height="360">
            <el-table-column prop="source" label="来源" width="100" />
            <el-table-column prop="pv" label="PV" width="100">
              <template #default="{ row }">{{ row.pv.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="uv" label="UV" width="100">
              <template #default="{ row }">{{ row.uv.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="percentage" label="占比" width="100">
              <template #default="{ row }">{{ row.percentage }}%</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getTrafficReport, type TrafficData, type SourceBreakdown } from '@/api/modules/report'

const loading = ref(false)
const summary = ref({ totalPv: 0, totalUv: 0, totalNewUsers: 0, avgStay: 0, avgBounceRate: 0 })
const sourceBreakdown = ref<SourceBreakdown[]>([])
const trafficChart = ref<HTMLElement | null>(null)
const sourceChart = ref<HTMLElement | null>(null)

let trafficInstance: echarts.ECharts | null = null
let sourceInstance: echarts.ECharts | null = null

async function loadData() {
  loading.value = true
  try {
    await nextTick()
    const res = await getTrafficReport()
    summary.value = res.data.summary
    sourceBreakdown.value = res.data.sourceBreakdown
    renderTraffic(res.data.list)
    renderSource(res.data.sourceBreakdown)
  } finally {
    loading.value = false
  }
}

function renderTraffic(list: TrafficData[]) {
  if (!trafficChart.value) return
  if (!trafficInstance) trafficInstance = echarts.init(trafficChart.value)
  trafficInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['PV', 'UV', '新用户'] },
    xAxis: { type: 'category', data: list.map(d => d.date) },
    yAxis: { type: 'value' },
    series: [
      { name: 'PV', type: 'line', data: list.map(d => d.pv), smooth: true, itemStyle: { color: '#409eff' } },
      { name: 'UV', type: 'bar', data: list.map(d => d.uv), itemStyle: { color: '#e6a23c' } },
      { name: '新用户', type: 'line', data: list.map(d => d.newUsers), smooth: true, itemStyle: { color: '#67c23a' } },
    ],
  })
}

function renderSource(data: SourceBreakdown[]) {
  if (!sourceChart.value) return
  if (!sourceInstance) sourceInstance = echarts.init(sourceChart.value)
  sourceInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['45%', '75%'], center: ['50%', '45%'],
      data: data.map(d => ({ name: d.source, value: d.pv })),
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
  &--purple { border-left: 3px solid #9b59b6; }
}
</style>
