<template>
  <div class="page-container">
    <el-card><div class="search-bar">
      <el-button type="primary"
                 @click="fetch"
      >刷新</el-button><el-button type="success"
                                @click="showDlg('add', {} as FullReduction)"
      >新增满减</el-button>
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
          label="活动名称"
          min-width="160"
        />
        <el-table-column label="满"
                         width="120"
        ><template #default="{ row }">¥{{ row.fullAmount }}</template></el-table-column>
        <el-table-column label="减"
                         width="120"
        ><template #default="{ row }">¥{{ row.reduceAmount }}</template></el-table-column>
        <el-table-column label="活动时间"
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
          @click="showDlg('edit', row as FullReduction)"
        >编辑</el-button><el-popconfirm
          title="确认删除？"
          @confirm="handleDelete(row.id)"
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
        <el-form-item label="活动名称"><el-input v-model="form.name"/></el-form-item>
        <el-form-item label="满额"><el-input-number
          v-model="form.fullAmount"
          :min="1"
        /></el-form-item>
        <el-form-item label="减额"><el-input-number
          v-model="form.reduceAmount"
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
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio :value="0">未开始</el-radio><el-radio :value="1">进行中</el-radio><el-radio :value="2">已结束</el-radio></el-radio-group></el-form-item>
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
    getFullReductionList,
    createFullReduction,
    updateFullReduction,
    deleteFullReduction,
    type FullReduction,
  } from '@/api/modules/marketing';

  const list = ref<FullReduction[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const dlgVisible = ref(false);
  const editId = ref<number | null>(null);
  const dlgTitle = ref('新增满减');
  const form = reactive({
    name: '',
    fullAmount: 100,
    reduceAmount: 10,
    startTime: '',
    endTime: '',
    status: 0,
  });

  async function fetch() {
    const res = await getFullReductionList({
      page: page.value,
      pageSize: pageSize.value,
    });
    list.value = res.data.list;
    total.value = res.data.total;
  }
  function showDlg(type: string, row: FullReduction) {
    editId.value = type === 'add' ? null : row.id || null;
    dlgTitle.value =
      type === 'add' ? '新增满减' : '编辑满减';
    Object.assign(
      form,
      row || {
        name: '',
        fullAmount: 100,
        reduceAmount: 10,
        startTime: '',
        endTime: '',
        status: 0,
      }
    );
    dlgVisible.value = true;
  }
  async function handleSave() {
    if (editId.value) {
      await updateFullReduction(editId.value, form);
      ElMessage.success('更新成功');
    } else {
      await createFullReduction(form);
      ElMessage.success('创建成功');
    }
    dlgVisible.value = false;
    fetch();
  }
  async function handleDelete(id: number) {
    await deleteFullReduction(id);
    ElMessage.success('删除成功');
    fetch();
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
