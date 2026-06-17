<template>
  <div class="page-container">
    <el-card>
      <el-table
        :data="levels"
        border
        stripe
        v-loading="loading"
      >
        <el-table-column
          prop="level"
          label="等级"
          width="80"
        />
        <el-table-column
          prop="name"
          label="等级名称"
          width="140"
        />
        <el-table-column label="佣金比例"
                         width="120"
        ><template #default="{ row }">{{ (row as any).rate }}%</template></el-table-column>
        <el-table-column label="自动升级"
                         width="120"
        ><template #default="{ row }"><el-tag
          :type="
            (row as any).autoUpgrade
              ? 'success'
              : 'info'
          "
          size="small"
        >{{
          (row as any).autoUpgrade ? '是' : '否'
        }}</el-tag></template></el-table-column>
        <el-table-column
          label="升级门槛(销售额)"
          width="150"
        ><template #default="{ row }">¥{{ (row as any).upgradeAmount }}</template></el-table-column>
        <el-table-column label="操作"><template #default="{ row }"><el-button
          type="primary"
          link
          @click="editRow(row as any)"
        >编辑</el-button></template></el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="编辑分销等级"
      v-model="dlgVisible"
      width="480px"
    >
      <el-form :model="editForm"
               label-width="140px"
      >
        <el-form-item label="等级名称"><el-input v-model="editForm.name"/></el-form-item>
        <el-form-item label="佣金比例(%)"><el-input-number
          v-model="editForm.rate"
          :min="0"
          :max="100"
        /></el-form-item>
        <el-form-item label="自动升级"><el-switch v-model="editForm.autoUpgrade"/></el-form-item>
        <el-form-item label="升级门槛(销售额)"><el-input-number
          v-model="editForm.upgradeAmount"
          :min="0"
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
    getDistribConfig,
    updateDistribConfig,
    type DistribConfig,
  } from '@/api/modules/marketing';

  const levels = ref<DistribConfig[]>([]);
  const loading = ref(false);
  const dlgVisible = ref(false);
  const editForm = reactive<DistribConfig>({} as DistribConfig);

  function editRow(row: DistribConfig) {
    Object.assign(editForm, { ...row });
    dlgVisible.value = true;
  }

  async function fetch() {
    loading.value = true;
    try {
      const res = await getDistribConfig();
      levels.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function handleSave() {
    const updated = levels.value.map((l) =>
      l.id === editForm.id ? { ...editForm } : l
    );
    await updateDistribConfig(updated);
    ElMessage.success('保存成功');
    dlgVisible.value = false;
    fetch();
  }

  onMounted(fetch);
</script>

<style scoped lang="scss">
  .page-container {
    max-width: 800px;
  }
</style>
