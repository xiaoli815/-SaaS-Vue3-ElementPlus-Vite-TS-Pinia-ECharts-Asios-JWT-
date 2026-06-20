<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="活动名称"
          clearable
          style="width: 200px"
          @keyup.enter="fetch"
        />
        <el-button type="primary"
                   @click="fetch"
        >查询</el-button>
        <el-button type="success"
                   @click="showDlg('add', {} as SeckillActivity)"
        >新增秒杀</el-button>
      </div>
    </el-card>
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
          min-width="180"
        />
        <el-table-column
          prop="productName"
          label="关联商品"
          min-width="160"
        />
        <el-table-column label="秒杀价"
                         width="110"
        ><template #default="{ row }">¥{{ row.seckillPrice }}</template></el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          width="80"
        /><el-table-column
          prop="limitPerUser"
          label="限购"
          width="70"
        />
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
          @click="showDlg('edit', row as SeckillActivity)"
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
        <el-form-item label="关联商品ID"><el-input-number v-model="form.productId"/></el-form-item>
        <el-form-item label="秒杀价"><el-input-number
          v-model="form.seckillPrice"
          :min="0"
          :precision="2"
        /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="form.stock"
                                                  :min="1"
        /></el-form-item>
        <el-form-item label="限购数"><el-input-number
          v-model="form.limitPerUser"
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
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    getSeckillList,
    createSeckill,
    updateSeckill,
    deleteSeckill,
    type SeckillActivity,
  } from '@/api/modules/marketing'

  const list = ref<SeckillActivity[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const keyword = ref('')
  const dlgVisible = ref(false)
  const editId = ref<number | null>(null)
  const dlgTitle = ref('新增秒杀')
  const form = reactive({
    name: '',
    productId: 0,
    seckillPrice: 0,
    stock: 100,
    limitPerUser: 1,
    startTime: '',
    endTime: '',
    status: 0,
  })

  async function fetch() {
    try {
      const res = await getSeckillList({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
      })
      list.value = res.data.list
      total.value = res.data.total
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }

  function showDlg(type: string, row: SeckillActivity) {
    if (type === 'add') {
      editId.value = null
      dlgTitle.value = '新增秒杀'
      Object.assign(form, {
        name: '',
        productId: 0,
        seckillPrice: 0,
        stock: 100,
        limitPerUser: 1,
        startTime: '',
        endTime: '',
        status: 0,
      })
    } else {
      editId.value = row.id
      dlgTitle.value = '编辑秒杀'
      Object.assign(form, row)
    }
    dlgVisible.value = true
  }

  async function handleSave() {
    try {
      if (editId.value) {
        await updateSeckill(editId.value, form)
        ElMessage.success('更新成功')
      } else {
        await createSeckill(form)
        ElMessage.success('创建成功')
      }
      dlgVisible.value = false
      fetch()
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteSeckill(id)
      ElMessage.success('删除成功')
      fetch()
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }

  import { onMounted } from 'vue'
  onMounted(fetch)
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
