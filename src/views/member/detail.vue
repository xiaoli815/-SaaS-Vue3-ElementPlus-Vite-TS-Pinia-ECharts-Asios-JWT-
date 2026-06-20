<template>
  <div class="page-container"
       v-loading="loading"
  >
    <el-card v-if="member">
      <template #header><div
        style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
      >
        <span>会员详情 — {{ member.nickname }}</span><el-button @click="$router.back()">返回</el-button>
      </div></template>
      <el-descriptions
        title="基本信息"
        :column="3"
        border
        size="small"
      >
        <el-descriptions-item label="昵称">{{
          member.nickname
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{
          member.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{
          member.email
        }}</el-descriptions-item>
        <el-descriptions-item label="会员等级"><el-tag size="small">{{
          member.levelName
        }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="累计消费">¥{{ member.totalSpent }}</el-descriptions-item>
        <el-descriptions-item label="订单数">{{
          member.orderCount
        }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{
          member.registerTime
        }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag
          :type="
            member.isBlacklisted ? 'danger' : 'success'
          "
          size="small"
        >{{
          member.isBlacklisted ? '已拉黑' : '正常'
        }}</el-tag></el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <!-- 订单历史 -->
      <h4>历史订单</h4>
      <el-table
        :data="orderHistory"
        border
        size="small"
        style="margin-top: 8px"
      >
        <el-table-column
          prop="orderNo"
          label="订单号"
          width="180"
        />
        <el-table-column label="金额"
                         width="100"
        ><template #default="{ row }">¥{{ row.payAmount }}</template></el-table-column>
        <el-table-column label="状态"
                         width="90"
        ><template #default="{ row }"><el-tag size="small">{{
          row.statusText
        }}</el-tag></template></el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          width="170"
        />
        <el-table-column label="操作"><template #default="{ row }"><el-button
          type="primary"
          link
          @click="
            $router.push(`/order/detail/${row.id}`)
          "
        >查看</el-button></template></el-table-column>
      </el-table>
      <el-empty
        v-if="!orderHistory.length"
        description="暂无订单记录"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getMemberFullData,MemberItem } from '@/api/modules/member'
  import { OrderItem } from '@/api/modules/order'

  const route = useRoute()
  const member = ref<MemberItem >()
  const orderHistory = ref<OrderItem[]>([])
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMemberFullData(
        Number(route.params.id)
      )
      member.value = res.data.member
      orderHistory.value =
        res.data.orderHistory
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped lang="scss">
  .page-container {
    max-width: 1000px;
  }
</style>
