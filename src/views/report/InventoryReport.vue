<template>
  <el-card v-loading="loading">
    <!-- 库存总览卡片 -->
    <el-row :gutter="16" 
            style="margin-bottom: 20px"
    >
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--blue"
        >
          <el-statistic title="总库存量" 
                        :value="totalStock" 
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--green"
        >
          <el-statistic title="库存总价值(元)" 
                        :value="totalValue" 
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--red"
        >
          <el-statistic title="告急商品数" 
                        :value="warningCount" 
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" 
                 class="stat-card stat-card--orange"
        >
          <el-statistic title="品类数" 
                        :value="categoryCount" 
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 库存-销量柱状图 -->
    <el-card style="margin-bottom: 20px" 
             header="各商品库存 & 销量"
    >
      <div ref="barChart" 
           style="width: 100%; height: 380px"
      />
    </el-card>

    <el-row :gutter="16">
      <!-- 品类库存 -->
      <el-col :span="12">
        <el-card header="品类库存分布">
          <div ref="categoryChart" 
               style="width: 100%; height: 360px"
          />
        </el-card>
      </el-col>
      <!-- 库存明细表 -->
      <el-col :span="12">
        <el-card header="库存明细">
          <el-table :data="list" 
                    stripe 
                    max-height="360" 
                    highlight-current-row
          >
            <el-table-column prop="productName" 
                             label="商品" 
                             min-width="150" 
                             show-overflow-tooltip 
            />
            <el-table-column prop="skuName" 
                             label="SKU" 
                             min-width="120" 
                             show-overflow-tooltip 
            />
            <el-table-column prop="stock" 
                             label="库存" 
                             width="70" 
                             sortable 
            />
            <el-table-column prop="sales" 
                             label="销量" 
                             width="70" 
                             sortable 
            />
            <el-table-column prop="turnover" 
                             label="周转率" 
                             width="70" 
            />
            <el-table-column prop="status" 
                             label="状态" 
                             width="80"
            >
              <template #default="{ row }">
                <el-tag :type="statusType(row.status)" 
                        size="small"
                >{{ row.status }}</el-tag>
              </template>
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
import { getInventoryReport, type InventoryItem } from '@/api/modules/report'

const loading = ref(false)
const totalStock = ref(0)
const totalValue = ref(0)
const list = ref<InventoryItem[]>([])
const categoryStock = ref<{ categoryName: string; stock: number; value: number }[]>([])
const barChart = ref<HTMLElement | null>(null)
const categoryChart = ref<HTMLElement | null>(null)

let barInstance: echarts.ECharts | null = null
let categoryInstance: echarts.ECharts | null = null

const warningCount = computed(() => list.value.filter(i => i.status === '告急' || i.status === '偏低').length)
const categoryCount = computed(() => new Set(list.value.map(i => i.categoryName)).size)

type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined

function statusType(status: string): TagType {
  const map: Record<string, TagType> = { '告急': 'danger', '偏低': 'warning', '正常': 'success', '充足': undefined }
  return map[status]
}

async function loadData() {
  loading.value = true
  try {
    await nextTick()
    const res = await getInventoryReport()
    totalStock.value = res.data.totalStock
    totalValue.value = res.data.totalValue
    list.value = res.data.list
    categoryStock.value = res.data.categoryStock
    renderBar(res.data.list)
    renderCategory(res.data.categoryStock)
  } finally {
    loading.value = false
  }
}

function renderBar(data: InventoryItem[]) {
  if (!barChart.value) return
  if (!barInstance) barInstance = echarts.init(barChart.value)
  barInstance.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['库存', '销量'] },
    xAxis: { type: 'category', data: data.map(d => d.productName), axisLabel: { rotate: 30, interval: 0 } },
    yAxis: { type: 'value', name: '数量' },
    series: [
      { name: '库存', type: 'bar', data: data.map(d => d.stock), itemStyle: { color: '#409eff' } },
      { name: '销量', type: 'bar', data: data.map(d => d.sales), itemStyle: { color: '#67c23a' } },
    ],
  })
}

function renderCategory(data: { categoryName: string; stock: number; value: number }[]) {
  if (!categoryChart.value) return
  if (!categoryInstance) categoryInstance = echarts.init(categoryChart.value)
  categoryInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '45%'],
      data: data.map(d => ({ name: d.categoryName, value: d.value })),
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
