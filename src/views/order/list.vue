<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-input
          v-model="query.keyword"
          placeholder="订单号/收货人/手机号"
          clearable
          style="width: 220px"
          @keyup.enter="fetchList"
        />
        <el-select
          v-model="query.status"
          placeholder="订单状态"
          clearable
          style="width: 140px"
          @change="fetchList"
        >
          <el-option label="待发货"
                     :value="1"
          /><el-option
            label="已发货"
            :value="2"
          /><el-option
            label="已完成"
            :value="3"
          /><el-option
            label="售后中"
            :value="4"
          /><el-option label="已取消"
                       :value="5"
          />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="onDateChange"
          style="width: 260px"
        />
        <el-button type="primary"
                   @click="fetchList"
        >查询</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 16px">
      <el-table
        :data="list"
        v-loading="loading"
        border
        stripe
      >
        <el-table-column
          prop="orderNo"
          label="订单号"
          width="180"
        />
        <el-table-column
          prop="receiverName"
          label="收货人"
          width="80"
        />
        <el-table-column label="商品"
                         min-width="200"
        ><template #default="{ row }"><span
          v-for="it in row.items"
          :key="it.productId"
          class="goods-tag"
        >{{ it.productName }}({{ it.skuSpecs }}) x{{
          it.quantity
        }}</span></template></el-table-column>
        <el-table-column label="实付金额"
                         width="110"
        ><template #default="{ row }">¥{{ row.payAmount }}</template></el-table-column>
        <el-table-column label="状态"
                         width="90"
        ><template #default="{ row }"><el-tag
          :type="statusTag(row.status)"
          size="small"
        >{{ row.statusText }}</el-tag></template></el-table-column>
        <el-table-column label="创建时间"
                         width="170"
        ><template #default="{ row }">{{
          row.createTime
        }}</template></el-table-column>
        <el-table-column
          label="操作"
          width="180"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="
                $router.push(`/order/detail/${row.id}`)
              "
            >详情</el-button>
            <el-button
              v-if="row.status === 1"
              type="success"
              link
              @click="handleConfirm(row)"
            >接单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          layout="total,prev,pager,next"
          @change="fetchList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getOrderList,
    confirmOrder,
    type OrderItem,
  } from '@/api/modules/order';

  const list = ref<OrderItem[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const dateRange = ref<string[]>([]);
  const query = reactive({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: undefined as number | undefined,
    startDate: '',
    endDate: '',
  });

  function onDateChange(val: string[] | null) {
    if (val) {
      query.startDate = val[0];
      query.endDate = val[1];
    } else {
      query.startDate = '';
      query.endDate = '';
    }
    fetchList();
  }

  function statusTag(s: number) {
    const m: Record<
      number,
      | 'primary'
      | 'success'
      | 'warning'
      | 'info'
      | 'danger'
      | undefined
    > = {
      1: 'warning',
      2: undefined,
      3: 'success',
      4: 'danger',
      5: 'info',
    };
    return m[s];
  }

  async function fetchList() {
    loading.value = true;
    try {
      const res = await getOrderList(query);
      list.value = res.data.list;
      total.value = res.data.total;
    } finally {
      loading.value = false;
    }
  }

  async function handleConfirm(row: any) {
    await confirmOrder(row.id);
    ElMessage.success('接单成功');
    fetchList();
  }

  onMounted(fetchList);
</script>

<style scoped lang="scss">
  .page-container {
    .search-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    .goods-tag {
      display: inline-block;
      background: #ecf5ff;
      color: #409eff;
      padding: 2px 6px;
      border-radius: 3px;
      margin-right: 4px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
</style>
