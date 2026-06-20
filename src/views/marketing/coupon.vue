<template>
  <div class="page-container">
    <el-card><div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="优惠券名称"
        clearable
        style="width: 200px"
        @keyup.enter="fetch"
      /><el-select
        v-model="status"
        placeholder="状态"
        clearable
        style="width: 120px"
        @change="fetch"
      ><el-option label="未开始"
                  :value="0"
      /><el-option
        label="发放中"
        :value="1"
      /><el-option
        label="已结束"
        :value="2"
      /></el-select><el-button type="primary"
                               @click="fetch"
      >查询</el-button><el-button type="success"
                                @click="showDlg('add')"
      >新增优惠券</el-button>
    </div></el-card>
    <el-card style="margin-top: 16px">
      <el-table :data="list"
                border
                stripe
      >
        <el-table-column
          prop="id"
          label="ID"
          width="70"
        /><el-table-column
          prop="name"
          label="优惠券名称"
          min-width="160"
        />
        <el-table-column
          prop="typeText"
          label="类型"
          width="90"
        />
        <el-table-column label="面额"
                         width="100"
        ><template #default="{ row }">{{
          row.type === 3
            ? row.value + '%'
            : '¥' + row.value
        }}</template></el-table-column>
        <el-table-column label="门槛"
                         width="100"
        ><template #default="{ row }">{{
          row.minAmount > 0
            ? '满¥' + row.minAmount
            : '无门槛'
        }}</template></el-table-column>
        <el-table-column label="发放/使用"
                         width="140"
        ><template #default="{ row }">{{ row.received }}/{{ row.total }} (用{{
          row.used
        }})</template></el-table-column>
        <el-table-column label="有效期"
                         min-width="300"
        ><template #default="{ row }">{{ row.startTime }} ~
          {{ row.endTime }}</template></el-table-column>
        <el-table-column label="状态"
                         width="90"
        ><template #default="{ row }"><el-tag
          :type="
            row.status === 1
              ? 'success'
              : row.status === 0
                ? 'warning'
                : 'info'
          "
          size="small"
        >{{ row.statusText }}</el-tag></template></el-table-column>
        <el-table-column label="操作"
                         width="150"
        ><template #default="{ row }"><el-button
          type="primary"
          link
          @click="showDlg('edit', row as CouponItem)"
        >编辑</el-button><el-popconfirm
          title="确认删除？"
          @confirm="handleDelete(row.id as number)"
        ><template #reference><el-button type="danger"
                                         link
        >删除</el-button></template></el-popconfirm></template></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          layout="total,prev,pager,next"
          @change="fetch"
        />
      </div>
    </el-card>
    <el-dialog
      :title="dlgTitle"
      v-model="dlgVisible"
      width="500px"
    >
      <el-form :model="form"
               label-width="90px"
      >
        <el-form-item label="优惠券名称"><el-input v-model="form.name"/></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.type"><el-option
          label="满减券"
          :value="1"
        /><el-option
          label="直减券"
          :value="2"
        /><el-option
          label="折扣券"
          :value="3"
        /></el-select></el-form-item>
        <el-form-item label="面额"><el-input-number
          v-model="form.value"
          :min="1"
        /><span style="margin-left: 4px; color: #999">{{
          form.type === 3 ? '%' : '元'
        }}</span></el-form-item>
        <el-form-item label="最低消费"><el-input-number
          v-model="form.minAmount"
          :min="0"
        /></el-form-item>
        <el-form-item label="发行总量"><el-input-number v-model="form.total"
                                                    :min="1"
        /></el-form-item>
        <el-form-item label="开始时间"><el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        /></el-form-item>
        <el-form-item label="结束时间"><el-date-picker
          v-model="form.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dlgVisible = false">取消</el-button><el-button type="primary"
                                                                                        @click="handleSave"
      >保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    type CouponItem,
  } from '@/api/modules/marketing';

  const list = ref<CouponItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const keyword = ref('');
  const status = ref<number | undefined>();
  const dlgVisible = ref(false);
  const editId = ref<number | null>(null);
  const dlgTitle = ref('新增优惠券');
  const form = reactive({
    name: '',
    type: 1,
    value: 10,
    minAmount: 100,
    total: 1000,
    startTime: '',
    endTime: '',
  });

  async function fetch() {
    try {
      const res = await getCouponList({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
        status: status.value,
      });
      list.value = res.data.list;
      total.value = res.data.total;
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }
  function showDlg(type: string, row?: CouponItem) {
    editId.value = type === 'add' ? null : row?.id || null;
    dlgTitle.value =
      type === 'add' ? '新增优惠券' : '编辑优惠券';
    Object.assign(
      form,
      row || {
        name: '',
        type: 1,
        value: 10,
        minAmount: 100,
        total: 1000,
        startTime: '',
        endTime: '',
      }
    );
    dlgVisible.value = true;
  }
  async function handleSave() {
    try {
      if (editId.value) {
        await updateCoupon(editId.value, form);
        ElMessage.success('更新成功');
      } else {
        await createCoupon(form);
        ElMessage.success('创建成功');
      }
      dlgVisible.value = false;
      fetch();
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }
  async function handleDelete(id: number) {
    try {
      await deleteCoupon(id);
      ElMessage.success('删除成功');
      fetch();
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }
  onMounted(fetch);
</script>

<style scoped lang="scss">
  .page-container {
    .search-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
