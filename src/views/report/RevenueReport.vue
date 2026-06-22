<template>
  <el-card v-loading="loading">
    <!-- 统计卡片 -->
    <el-row :gutter="16" 
            style="margin-bottom: 20px"
    >
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--blue"
        >
          <el-statistic title="总营收(元)" 
                        :value="summary.totalRevenue" 
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--red"
        >
          <el-statistic title="总退款(元)" 
                        :value="summary.totalRefund" 
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--green"
        >
          <el-statistic title="净营收(元)" 
                        :value="summary.netRevenue" 
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--orange"
        >
          <el-statistic title="退款率" 
                        :value="+summary.avgRefundRate.toFixed(2)" 
                        :suffix="'%'" 
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 营收趋势图 -->
    <el-card style="margin-bottom: 20px" 
             header="营收趋势"
    >
      <div ref="revenueChart" 
           style="width: 100%; height: 380px" 
      />
    </el-card>

    <el-row :gutter="16">
      <!-- 支付方式分布 -->
      <el-col :span="12">
        <el-card header="支付方式分布">
          <div ref="paymentChart" 
               style="width: 100%; height: 360px" 
          />
        </el-card>
      </el-col>
      <!-- 支付方式明细 -->
      <el-col :span="12">
        <el-card header="支付方式明细">
          <el-table :data="paymentBreakdown" 
                    stripe 
                    max-height="360"
          >
            <el-table-column prop="method" 
                             label="支付方式" 
                             width="120" 
            />
            <el-table-column prop="amount" 
                             label="金额(元)" 
                             width="120"
            >
              <template #default="{ row }">{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="orders" 
                             label="订单数" 
                             width="100" 
            />
            <el-table-column prop="percentage" 
                             label="占比" 
                             width="80"
            >
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
import { getRevenueReport, type RevenueData, type PaymentBreakdown } from '@/api/modules/report'

const loading = ref(false)
const summary = ref({ totalRevenue: 0, totalRefund: 0, netRevenue: 0, avgRefundRate: 0 })
const paymentBreakdown = ref<PaymentBreakdown[]>([])
const revenueChart = ref<HTMLElement | null>(null)
const paymentChart = ref<HTMLElement | null>(null)

let revenueInstance: echarts.ECharts | null = null
let paymentInstance: echarts.ECharts | null = null

async function loadData() {
  loading.value = true
  try {
    await nextTick()
    const res = await getRevenueReport()
    summary.value = res.data.summary
    paymentBreakdown.value = res.data.paymentBreakdown
    renderRevenue(res.data.list)
    renderPayment(res.data.paymentBreakdown)
  } finally {
    loading.value = false
  }
}

function renderRevenue(list: RevenueData[]) {
  if (!revenueChart.value) return
  if (!revenueInstance) revenueInstance = echarts.init(revenueChart.value)
  revenueInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['营收', '退款', '净营收'] },
    xAxis: { type: 'category', data: list.map(d => d.date) },
    yAxis: { type: 'value', name: '金额(元)' },
    series: [
      { name: '营收', type: 'bar', data: list.map(d => d.revenue), itemStyle: { color: '#409eff' } },
      { name: '退款', type: 'bar', data: list.map(d => d.refund), itemStyle: { color: '#f56c6c' } },
      { name: '净营收', type: 'line', data: list.map(d => d.netRevenue), itemStyle: { color: '#67c23a' }, smooth: true },
    ],
  })
}

function renderPayment(data: PaymentBreakdown[]) {
  if (!paymentChart.value) return
  if (!paymentInstance) paymentInstance = echarts.init(paymentChart.value)
  paymentInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['45%', '75%'], center: ['50%', '45%'],
      data: data.map(d => ({ name: d.method, value: d.amount })),
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
  &--red { border-left: 3px solid #f56c6c; }
  &--orange { border-left: 3px solid #e6a23c; }
}
</style>
