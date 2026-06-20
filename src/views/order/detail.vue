<template>
  <div class="page-container"
       v-loading="loading"
  >
    <el-card v-if="order">
      <template #header><div
        style="
            display: flex;
            justify-content: space-between;
          "
      >
        <span>订单详情 — {{ order.orderNo }}</span><el-tag :type="statusTag(order.status) as any">{{
          order.statusText
        }}</el-tag>
      </div></template>

      <!-- 收货信息 -->
      <el-descriptions
        title="收货信息"
        :column="3"
        border
        size="small"
      >
        <el-descriptions-item label="收货人">{{
          order.receiverName
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{
          order.receiverPhone
        }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{
          order.receiverAddress
        }}</el-descriptions-item>
      </el-descriptions>

      <!-- 商品明细 -->
      <el-table
        :data="order.items"
        border
        size="small"
        style="margin-top: 16px"
      >
        <el-table-column label="商品图"
                         width="70"
        ><template #default="{ row }"><el-image
          :src="row.cover"
          style="width: 45px; height: 45px"
        /></template></el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
        /><el-table-column
          prop="skuSpecs"
          label="规格"
          width="150"
        />
        <el-table-column label="单价"
                         width="100"
        ><template #default="{ row }">¥{{ row.price }}</template></el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="70"
        />
        <el-table-column label="小计"
                         width="100"
        ><template #default="{ row }">¥{{
          (row.price * row.quantity).toFixed(2)
        }}</template></el-table-column>
      </el-table>

      <!-- 金额 -->
      <el-descriptions
        :column="4"
        border
        size="small"
        style="margin-top: 16px"
        title="金额信息"
      >
        <el-descriptions-item label="商品总额">¥{{ order.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">¥{{ order.discountAmount }}</el-descriptions-item>
        <el-descriptions-item label="运费">¥{{ order.freight }}</el-descriptions-item>
        <el-descriptions-item label="实付金额"><span
          style="
              color: #f56c6c;
              font-size: 16px;
              font-weight: bold;
            "
        >¥{{ order.payAmount }}</span></el-descriptions-item>
      </el-descriptions>

      <!-- 物流信息 -->
      <div v-if="order.logistics"
           style="margin-top: 16px"
      >
        <el-descriptions
          title="物流信息"
          :column="2"
          border
          size="small"
        >
          <el-descriptions-item label="物流公司">{{
            order.logistics.company
          }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{
            order.logistics.trackingNo
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 售后信息 -->
      <div v-if="order.afterSale"
           style="margin-top: 16px"
      >
        <el-descriptions
          title="售后信息"
          :column="2"
          border
          size="small"
        >
          <el-descriptions-item label="售后类型">{{
            order.afterSale.typeText
          }}</el-descriptions-item>
          <el-descriptions-item label="售后状态">{{
            order.afterSale.statusText
          }}</el-descriptions-item>
          <el-descriptions-item
            label="申请原因"
            :span="2"
          >{{
            order.afterSale.reason
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 操作按钮 -->
      <div
        style="
          margin-top: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        "
      >
        <el-button
          v-if="order.status === 1"
          type="primary"
          @click="showDeliver = true"
        >发货</el-button>
        <el-button
          v-if="order.status === 1"
          type="warning"
          @click="showAdjust = true"
        >改价</el-button>
        <el-button
          v-if="
            order.afterSale && order.afterSale.status === 0
          "
          type="success"
          @click="handleAfterReview(true)"
        >同意售后</el-button>
        <el-button
          v-if="
            order.afterSale && order.afterSale.status === 0
          "
          type="danger"
          @click="handleAfterReview(false)"
        >拒绝售后</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </el-card>

    <!-- 发货弹窗 -->
    <el-dialog
      v-model="showDeliver"
      title="录入物流信息"
      width="400px"
    >
      <el-form :model="deliverForm"
               label-width="80px"
      >
        <el-form-item label="物流公司"><el-select v-model="deliverForm.company"><el-option
          v-for="c in [
            '顺丰速运',
            '中通快递',
            '圆通速递',
            '韵达快递',
            'EMS',
          ]"
          :key="c"
          :label="c"
          :value="c"
        /></el-select></el-form-item>
        <el-form-item label="物流单号"><el-input v-model="deliverForm.trackingNo"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="showDeliver = false">取消</el-button><el-button type="primary"
                                                                                         @click="handleDeliver"
      >确认发货</el-button></template>
    </el-dialog>

    <!-- 改价弹窗 -->
    <el-dialog
      v-model="showAdjust"
      title="订单改价"
      width="400px"
    >
      <el-form :model="adjustForm"
               label-width="80px"
      >
        <el-form-item label="新价格"><el-input-number
          v-model="adjustForm.payAmount"
          :min="0.01"
          :precision="2"
        /></el-form-item>
        <el-form-item label="备注"><el-input v-model="adjustForm.remark"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="showAdjust = false">取消</el-button><el-button type="primary"
                                                                                        @click="handleAdjust"
      >确认改价</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import {
    getOrderDetail,
    deliverOrder,
    updateOrderPrice,
    reviewAfterSale,
    type OrderItem,
  } from '@/api/modules/order';

  const route = useRoute();
  const order = ref<OrderItem | null>(null);
  const loading = ref(false);
  const showDeliver = ref(false);
  const showAdjust = ref(false);
  const deliverForm = reactive({
    company: '顺丰速运',
    trackingNo: '',
  });
  const adjustForm = reactive({ payAmount: 0, remark: '' });

  function statusTag(s: number) {
    const m: Record<number, string> = {
      1: 'warning',
      2: '',
      3: 'success',
      4: 'danger',
      5: 'info',
    };
    return m[s] || '';
  }

  async function fetch() {
    loading.value = true;
    try {
      const res = await getOrderDetail(
        route.params.id as string
      );
      order.value = res.data;
    } catch {
      // 全局拦截器已弹出错误提示
    } finally {
      loading.value = false;
    }
  }

  async function handleDeliver() {
    try {
      if (!deliverForm.trackingNo) {
        ElMessage.warning('请输入物流单号');
        return;
      }
      await deliverOrder(
        order.value!.id,
        deliverForm.company,
        deliverForm.trackingNo
      );
      ElMessage.success('发货成功');
      showDeliver.value = false;
      fetch();
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }

  async function handleAdjust() {
    try {
      await updateOrderPrice(
        order.value!.id,
        adjustForm.payAmount,
        adjustForm.remark
      );
      ElMessage.success('改价成功');
      showAdjust.value = false;
      fetch();
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }

  async function handleAfterReview(approved: boolean) {
    try {
      const reply = approved
        ? '同意售后申请'
        : '售后申请不符合条件';
      await reviewAfterSale(order.value!.id, approved, reply);
      ElMessage.success(
        approved ? '已同意售后' : '已拒绝售后'
      );
      fetch();
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }

  onMounted(() => {
    adjustForm.payAmount = order.value?.payAmount || 0;
    fetch();
  });
</script>

<style scoped lang="scss">
  .page-container {
    max-width: 1200px;
  }
</style>
